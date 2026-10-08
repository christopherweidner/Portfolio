---
title: Insights from EWOR x Google Cloud x Google DeepMind
date: 2026-10-08
summary: How AI is changing software development, and why your job is now writing the constraints, not the code
---

Yesterday I was at the Google office in Berlin for an evening with EWOR, Google Cloud and Google DeepMind. The office itself was pretty cool (there's a screen in the lobby showing live Google searches from all over the world). The talk that stuck with me the most was from Paul Müller, EWOR Partner and co-founder of Adjust (~$1bn exit). He talked about how AI changes building software startups. Normally I hate those kinds of talks, because everybody has to say something about AI and nothing is meaningful or shifts the way I operate. But this one was different. It was fun to listen to, because you could tell that Paul himself likes to experiment and code with AI. He even built his own tool for it (more on that below). These are my personal key takeaways:

## Frontier Model Fallacy

Just because you use the newest, best frontier model doesn't mean you can brute-force your way to a good result just by prompting what you want with unconstrained logic. That's just wishing and hoping for a good result. When you write software you actually want to sell, you still have to check the code, because you can't trust the result.

What we should do instead is use affordable open-weight models (e.g. DeepSeek, Gemma, ...). They're not as good as the frontier models at everything, but they're good enough when you give them tight constraints, for a fraction of the price. We're talking about a 50x cost reduction, while frontier reasoning tokens are only getting more expensive. But how does that help us write software that we as developers can trust?

## Limit Entropy

How do we limit entropy? We give the model very tight boundaries to eliminate hallucinations. So our job is not writing code, but defining and writing the constraints. We design tests that the SUT (software under test) has to pass. Those tests need to be very strict and clear, and our job is to ensure the quality and completeness of the tests.

Then we can take a cheap model and say: "Write the code so it passes all the tests." And we don't need to worry about it, because if it passes the tests, we know it works, at least for everything our tests cover. That's why the tests are the real product. It maybe won't make it in one go, but our open-weight model is so cheap that it can just try 3 times, and every time it gets clear feedback from the tests: pass or fail.

## Languages as Cages

To further eliminate unwanted results, we should use Go (and Rust for the parts that have to be really fast). Yes, Go is a boring language, but that's actually the point. We don't need to write it ourselves, and the big advantage over the JavaScript/TypeScript world (e.g. Next.js) is that instead of a thousand ways to implement what we want, there are far fewer. So the output tells us it works, and Go makes it much harder for the agent to produce something weird along the way. Also, the boring training data prevents hallucinations, and the compiler errors guide the agent's self-correction.

## How Do We Test the Software?

The core idea is to just observe the behavior instead of checking the code. Classic unit tests don't work well here: they're tied to the internal code, the agent repeats its own mistakes in the mocks, and you end up with 100% green tests on broken output.

Instead, we intercept what actually goes over the wire: HTTP requests, database queries and queues. The production code runs unmodified and doesn't even know it's being tested. Where the output isn't deterministic (e.g. an LLM response), a second LLM grades it against rules you write down.

Paul built his own tool for exactly this. It sits between your app and everything it talks to and only checks what goes in and out. You're the architect and define *what* the app should do, the agent is the builder and figures out *how*, and the tool is the judge. If the suite passes, the code is correct.

## The Workflow

| Step | What happens |
|---|---|
| **1. Specify Criteria** | Define performance and auth gates |
| **2. Headless Build** | Agents build inside server sandboxes |
| **3. Wire Audit** | Automated intercept and evaluation loop |
| **4. Pull Request** | Merge upon clean wire verification |

Headless is the important part. No more sitting in front of your laptop watching tokens stream across the screen or interrupting the agent mid-build. The agents run in the background, and the only thing you look at is the pull request.

## Your New Job

It's harder at the beginning, because you have to write all the requirements by hand yourself. But it gets better over time. Our job now is to make the requirements a bit better every day, refine the test suites, and tighten the boundaries by one percent. Paul basically described it as being the devil for your AI: you're just trying to make its life harder. That's real AI-driven software development, without the "zero-shot hype".