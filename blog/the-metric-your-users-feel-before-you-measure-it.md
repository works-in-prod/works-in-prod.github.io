---
title: "Measuring time to first token"
slug: the-metric-your-users-feel-before-you-measure-it
date: 2026-05-21T02:00:00.000Z
authors: [ambersariya]
tags:
  - ai-engineering
  - observability
  - performance
last_updated: 2026-11-20T10:38:51.000Z
---

For a streaming chat response, total duration doesn't tell you how long the user stared at an empty screen.

I measure time to first token (TTFT) alongside total duration: in this test, the time from starting the request until the client receives the first non-empty piece of generated text.

<!-- truncate -->

That definition matters. A connection opening, a keep-alive or an event containing only metadata isn't the first token. The measurement also includes work outside model inference, such as the network and application processing. It isn't the same as timing when the browser actually paints the text.

## Measure the first content event

In [k6's HTTP metrics](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/), `http_req_duration` covers sending the request, waiting and receiving the response. It doesn't isolate the wait for generated text. `http_req_waiting` measures time to first byte, which may arrive before any useful content.

For an SSE endpoint, I've used [xk6-sse](https://github.com/phymbert/xk6-sse). With Go and xk6 installed, this builds a k6 binary with the extension:

```bash
xk6 build --with github.com/phymbert/xk6-sse
```

The example below assumes a GET endpoint whose SSE data events contain JSON like `{"content":"Hello"}`, with `[DONE]` marking completion. Adapt the method, authentication and content extraction to your API; SSE itself doesn't define that payload format.

```javascript
import sse from "k6/x/sse";
import { check } from "k6";
import { Trend } from "k6/metrics";

const ttft = new Trend("ttft_ms", true);

export default function () {
  const url = __ENV.STREAM_URL;
  const params = {
    method: "GET",
    headers: { Accept: "text/event-stream" },
  };
  const start = Date.now();
  let firstTokenRecorded = false;

  const response = sse.open(url, params, (client) => {
    client.on("event", (event) => {
      if (firstTokenRecorded || !event.data || event.data === "[DONE]") {
        return;
      }

      const payload = JSON.parse(event.data);
      if (typeof payload.content === "string" && payload.content.length > 0) {
        ttft.add(Date.now() - start);
        firstTokenRecorded = true;
      }
    });
  });

  check(response, {
    "stream returned 200": (result) => result.status === 200,
    "stream contained text": () => firstTokenRecorded,
  });
}
```

[Time-valued k6 trends use milliseconds](https://grafana.com/docs/k6/latest/javascript-api/k6-metrics/trend/), so this records the elapsed milliseconds without dividing by 1,000. Run the resulting binary with your endpoint supplied as `STREAM_URL`.

The connection stays open after recording TTFT so the test still consumes the response. Closing it early would change the workload you're trying to observe.

Track errors, timeouts and streams with no text alongside TTFT. Those requests have no TTFT sample; a low percentile among successful streams can hide a failing service. The checks make some failures visible, but a real test also needs endpoint-specific error handling and failure thresholds.

## Choose the load profile deliberately

Ramping concurrency and holding at selected levels can help show where responsiveness changes. Keep the ramp and hold results distinguishable, and define whether you classify samples by request start or measurement time.

A 60-second hold with 50 virtual users doesn't imply 50 requests. Each user may complete several iterations. If you need one iteration per user, use a [per-VU-iterations scenario](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/per-vu-iterations/) and check how many iterations completed. That is a different experiment from sustaining concurrency for a fixed duration.

## What we learnt

In our tests, models differed in how quickly they started and how quickly they finished. Prompt-cache hits reduced the first-token delay by hundreds of milliseconds for large system prompts. We also saw TTFT degrade as concurrency increased before throughput alone made the problem obvious.

Those were observations from our workload, not performance guarantees for another model or deployment.

Before testing, choose a p95 TTFT target at the concurrency you expect, along with an acceptable error rate. Keep measuring total duration and token throughput too. A quick first token is useful, but it doesn't tell you whether the rest of the response arrives at a useful pace.
