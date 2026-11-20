---
title: "Benchmarking Docling on the wrong hardware"
slug: the-classic-works-on-my-machine-now-with-neural-networks
date: 2026-05-21T09:00:00.000Z
last_updated: 2026-11-20T10:38:51.000Z
authors: [ambersariya]
tags:
  - ai-engineering
  - python
  - lessons-learned
  - document-parsing
  - testing
---

We compared ten document parsers, chose the one that best preserved our documents, and then found it was too slow on our production hardware.

The evaluation helped us choose for extraction quality. It didn't tell us enough about the environment where the parser would run.

<!-- truncate -->

## What we needed to preserve

Our assistant retrieved content from product documentation: policies, guides and structured forms. The quality of that retrieval depended on what survived parsing.

A table flattened into unrelated values loses meaning. So does a heading treated as an ordinary paragraph or a caption separated from its figure. Those defects affect what the assistant can retrieve and cite.

Our document set needed support for:

- Scanned PDFs requiring optical character recognition (OCR).
- Tables with merged cells and multi-row headers.
- Heading hierarchy, columns and other layout structure.
- Figures and diagrams whose meaning needed to be captured in text.

We started with `python-docx`, `pdfplumber`, `pypdf` and PyMuPDF. They were useful for parts of the problem, but our initial approaches didn't preserve enough structure across the more difficult documents.

## Making the comparison repeatable

We built a [comparison harness](https://github.com/ambersariya/pdf-parsing-comparison) to run parsers against the same input documents. We measured parse time and peak memory, then compared text extraction, table structure and layout quality.

Word count was one proxy for text extraction, not proof that the content was correct. The qualitative review mattered too: a parser could return plenty of words and still lose the relationships between them.

In that evaluation, Docling best met the extraction requirements we cared about. We integrated it.

## The hardware gap

We had run the evaluation on an M4 Pro MacBook with Apple Silicon MPS acceleration. Our production Kubernetes nodes were CPU-only.

In our tests, documents that parsed in two or three seconds on the laptop could take minutes in a production pod. Our load balancer's 60-second timeout made that a request-path problem, not just a slower batch job.

We saw timeouts, 502 responses, retries, backlog and memory pressure. Several weeks of thread and concurrency tuning followed. The [Docling removal post](/we-spent-five-weeks-making-docling-work-then-we-deleted-it/) covers that work.

Those timings describe our setup and document set. They aren't a general CPU-versus-GPU benchmark. But they were enough to show that our original evaluation hadn't answered the deployment question.

The harness made comparisons consistent. We had still chosen the wrong environment for a performance measurement that mattered.

## Reconsidering the approach

We could have evaluated GPU nodes, moved parsing behind an asynchronous job or spent more time tuning the local pipeline. Each would have changed the cost and behaviour of the system.

Instead, we reconsidered whether inference needed to run locally at all. The requirement was to extract structured content from documents. Local inference had been our implementation choice.

We tried Claude through Bedrock. Documents within the direct-input limit went to the API as document blocks. Larger files used a fallback that rendered pages as images. AWS [documents the Converse message limits](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Message.html), including 4.5 MB per document.

On our document set, the extraction quality was comparable to what we'd been getting from Docling. Moving inference out of the pods removed the local model loading and CPU tuning from that path.

It introduced different considerations: provider availability, quotas, per-request cost, data handling and output quality. For our system, that was a better trade-off.

## What I'd add to the evaluation

**Run on representative hardware.** If a library performs inference locally, test it under the CPU, memory, accelerator and concurrency constraints it will actually have. Laptop timings can help development without being deployment evidence.

**Measure the complete operation.** Include startup, model downloads or loading, realistic document sizes, timeouts and concurrent requests where those affect the design.

**Compare different approaches.** Asking which local library is best excludes managed services before you've considered their trade-offs. Include plausible alternatives, then assess them against the same extraction and operational requirements.

**Keep evaluation and decision separate.** A harness reports what you measured. Deciding that a tool fits the system still requires judgement about what you left out.

I'd keep the structured comparison. I'd change the questions it had to answer before we committed to the result.
