---
layout: page
title: SpecVoice / Fast Whisper
description: Speculative decoding and correctness-tested low-latency inference for Whisper ASR.
importance: 1
category: systems
related_publications: false
---

SpecVoice grows out of a Fast Whisper speculative-decoding prototype. The goal is to reduce end-to-end ASR latency while preserving the target model's output semantics and making the speedup claims reproducible.

The system pairs **Whisper Tiny** as a draft model with **Whisper Large V3** as the verifier, includes KV-cache-aware decoding and benchmarking utilities, and exposes a CLI plus FastAPI serving path.

Current work is focused on correctness-tested speculative ASR, synchronized benchmarking, and extending the prototype toward streaming voice-agent workloads.

[View the repository](https://github.com/AarushRathore1729/Simplismart_Assign)
