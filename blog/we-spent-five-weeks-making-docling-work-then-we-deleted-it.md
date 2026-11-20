---
title: "Why we removed Docling"
slug: we-spent-five-weeks-making-docling-work-then-we-deleted-it
date: 2026-05-21T08:00:00.000Z
last_updated: 2026-11-20T10:38:51.000Z
authors: [ambersariya]
tags:
  - ai-engineering
  - python
  - lessons-learned
  - document-parsing
---

We spent five weeks integrating and tuning Docling, then removed it. The removal deleted 1,452 lines from `uv.lock` alone.

The parser met our document-extraction requirements. Running its models inside our application pods cost more operational work than we'd expected, and a managed API eventually met the need with less local infrastructure.

<!-- truncate -->

## Adding the parser

[Docling](https://github.com/docling-project/docling) handles document conversion, including PDFs, tables and Word documents. Our integration also brought model downloads, OCR dependencies and inference into the application runtime.

The first pull request was merged and reverted on the same day. That should probably have earned more attention than it did.

A couple of days later, the integration was back. We needed to:

- Download Hugging Face models during container startup.
- Set `HOME` and `HF_HOME` so the container could write to its cache.
- Fix how the `DOCLING_MODELS` list passed through shell arguments.
- Add Tesseract OCR and OpenCV to the runtime image.
- Keep EasyOCR out of the model list when it wasn't part of the intended setup.

Each issue was manageable. Together, they were a sign that we'd taken on more than a parsing function.

## Managing the models

Downloading models during startup was too slow for our production health checks. We introduced a CI workflow to prepare them in the image, then moved towards an S3 cache and a Kubernetes init container as image size became a problem.

The model sync workflow had its own configuration and bugs. It also had to stay aligned with the Docling version in `pyproject.toml`. Updating the parser or OCR engine meant coordinating the Dockerfile, sync workflow and cached models before deployment.

We'd added a parsing library and ended up maintaining a model-distribution process.

## Tuning the runtime

Several rounds of changes followed:

- Reduced the OpenMP thread count from four to two after CPU throttling.
- Pinned `images_scale` to `1.0` and set the accelerator to `AUTO`.
- Fixed thread initialisation and split up the parse method to make tuning easier.
- Switched from EasyOCR to RapidOCR, then updated the model sync workflow and defaults.
- Skipped OCR for native digital PDFs where it wasn't needed.

These changes addressed specific problems, but the operational cost kept growing.

On the day of the last round of fixes, we added a parser using a vision-language model (VLM) through Bedrock. We validated that route in a few hours. It removed local inference from the request path.

## Removing the unused integration

We changed the default routing to use the VLM parsers. Docling was still in the source, Docker image and dependency tree, but it was handling no traffic.

So we removed the parser, its tests, the model sync workflow, settings, entrypoint bootstrap and inference dependencies. That was where the 1,452-line lockfile reduction came from.

## What replaced it

The primary parser sends document bytes to Claude through Bedrock. For documents that exceed the direct-input limit, a fallback rasterises PDF pages with `pypdfium2` and sends page images for extraction. DOCX files on that fallback route go through headless LibreOffice first.

AWS [documents a 4.5 MB limit per document in Converse messages](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Message.html). The fallback also has to respect image, request and model limits; converting a file to images doesn't remove those constraints.

| Concern | Our Docling integration | Replacement |
| --- | --- | --- |
| Document extraction | Locally loaded parser and OCR models | Bedrock document input, with a page-image fallback |
| Model distribution | S3 sync workflow and startup configuration | Managed by the provider |
| Local dependencies | Torch, OCR engines, OpenCV and model files | `pypdfium2` and LibreOffice for the fallback |
| Runtime concerns | Model loading, memory, CPU and thread tuning | API latency, quotas, cost and failure handling |

We removed one set of responsibilities and accepted another. The managed route still needs monitoring, retries where appropriate, and review of what document data can be sent to the provider.

## What I'd check earlier

Our mistake was treating extraction quality as enough evidence to commit to the integration. We hadn't adequately checked what it would take to operate the chosen pipeline on CPU-limited production pods.

That doesn't establish that Docling needs a GPU or can't run well on a CPU. Its [configuration options](https://docling-project.github.io/docling/usage/advanced_options/) and the workload matter. We may have missed settings that would have helped.

A managed API also isn't an option everywhere. Self-hosting, offline processing and data-handling constraints can justify the work of operating local models.

For our workload and environment, the API route met the need with less local operational work. I'd compare that option earlier next time, alongside testing the local parser on production-equivalent hardware.
