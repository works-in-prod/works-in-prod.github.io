---
title: "Tracing a Bedrock application with OpenTelemetry"
slug: you-cant-debug-what-bedrock-swallowed
date: 2026-05-21T05:00:00.000Z
authors: [ambersariya]
tags:
  - ai-engineering
  - observability
  - python
  - opentelemetry
last_updated: 2026-11-20T10:38:51.000Z
---

A request takes twelve seconds. Was the time spent retrieving context, building the prompt, waiting for Bedrock or processing the response?

We hit this early on an LLM project. A single request duration wasn't enough to tell us where to look. Tracing the steps around the model call made the delay easier to investigate.

<!-- truncate -->

## Trace the code you control

Amazon Bedrock runs the model, but retrieval, prompt assembly, retries and fallback handling are still part of your application. Those steps don't need to be a mystery just because inference happens elsewhere.

I used [OpenTelemetry spans](https://opentelemetry.io/docs/languages/python/instrumentation/) to make those boundaries visible. A span records an operation's timing and can carry attributes and error information. Nested spans show how the work fits together.

For Python 3.10 or later, a small decorator can help with synchronous functions and methods:

```python
import functools
from collections.abc import Callable
from typing import ParamSpec, TypeVar

from opentelemetry import trace

Parameters = ParamSpec("Parameters")
Result = TypeVar("Result")


def traced(
    tracer: trace.Tracer,
) -> Callable[[Callable[Parameters, Result]], Callable[Parameters, Result]]:
    def decorate(
        function: Callable[Parameters, Result],
    ) -> Callable[Parameters, Result]:
        @functools.wraps(function)
        def wrapper(*args: Parameters.args, **kwargs: Parameters.kwargs) -> Result:
            with tracer.start_as_current_span(function.__qualname__):
                return function(*args, **kwargs)

        return wrapper

    return decorate
```

Configure the OpenTelemetry SDK and exporter at application startup, then pass a tracer to the decorator: `@traced(trace.get_tracer(__name__))`. The span context records timing and, by default, exceptions that escape the block. Calling the API without a configured recording provider won't give you an exported trace.

This wrapper doesn't handle coroutines or generators. For those, the span must cover the awaited work or stream consumption, rather than just the creation of a coroutine or iterator.

## Read the request as a timeline

Once the relevant steps were instrumented, we could distinguish time spent in retrieval, prompt assembly and the model call. That gave us somewhere specific to investigate instead of treating every slow request as a model problem.

A long model span tells you where time went. It doesn't, by itself, prove the cause. Model choice, prompt size, caching and provider behaviour still need separate investigation.

We also used OpenTelemetry for application metrics, including fallback use and prompt-cache hits. Those need deliberate instrumentation and an appropriate collection setup. A timing decorator doesn't automatically produce business metrics, and sampled traces aren't necessarily a reliable count of every request.

Keep raw prompts, retrieved documents and user content out of span attributes unless you have an explicit, appropriate data-handling policy. Useful tracing shouldn't depend on copying sensitive content into another system.

The model's output can still be difficult to explain. But we can make the surrounding application easier to inspect. I'd wire that in early, while the request path is still small enough to follow.
