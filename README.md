# 🕸️ GraphFlow (WIP)

A minimal, composable alternative to LangGraph — built for **TypeScript first**, no hidden magic, just **simple primitives** you can combine to build anything.

## ✨ Features

- **Graph execution engine** — describe your workflows as nodes + edges
- **Tool nodes** with [Zod](https://zod.dev) schemas → no more painful prompt templates
- **AI nodes** — built-in primitive for calling LLMs without boilerplate
- **Parallel execution** — run multiple nodes concurrently and merge results
- **Combiner nodes** — define how parallel results should be merged
- **Subgraphs** — modularize and reuse graph components
- **Agent node** — agents as just another node type
- **Built-in agent** — implemented *only using library primitives* (no internal hacks)

## 🚀 Example

```ts
import { runGraph, tool, ai, parallel, combine, subgraph, agent } from "graphflow";
import { z } from "zod";

// Define a tool
const searchTool = tool(
  async ({ query }) => `results for ${query}`,
  {
    name: "search",
    description: "Search the web",
    schema: z.object({ query: z.string() })
  }
);

// Define an AI node
const summarizer = ai({
  provider: "openai:gpt-4o",
  prompt: (state) => `Summarize this: ${state.input}`
});

// Define a small graph
const graph = {
  __start__: "search",
  search: searchTool,
  search: "summarize",
  summarize: summarizer,
  summarize: "__end__"
};

// Run it
const result = await runGraph(graph, "Tell me about GraphFlow");
console.log(result.response);
```

## 🧩 Philosophy

GraphFlow is built on 3 principles:
1. **Primitives, not abstractions** — simple building blocks like `tool`, `ai`, `parallel`, `combine`.
2. **Composable** — graphs can be modularized and reused.
3. **Transparent** — no hidden magic. Even agents are just graphs built from primitives.

## 📦 Installation

NOT PUBLISHED YET

## 📚 Roadmap
- [ ] Add built-in AI providers (OpenAI, Anthropic, Ollama)
- [ ] Support fan-out + fan-in parallel execution
- [ ] More combiner strategies (consensus, majority vote, etc.)
- [ ] Graph visualization tools
- [ ] First-class agent examples and a drop-in agent primitive

---

🔨 **Status:** Early work-in-progress. Contributions, ideas, and feedback welcome!
