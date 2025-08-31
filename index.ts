import { z, ZodType } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const START = "__start__"
const END = "__end__"

export type State = {
  input?: string,
  response?: string
};

export type Node = string | NodeFn | NodeFn[];

export type RouterNodeReturnType = { next: NodeFn, newState: State };

export type NodeFn = (state: State) => Promise<State | RouterNodeReturnType> | State | RouterNodeReturnType;

export type Graph = Record<string, Node>;

export type ToolReturnType<F> = {
  call: F;
  describe: string;
}

function isNodeString(x: Node | undefined): x is string {
  if (!x) return false;
  return typeof x === "string";
}

function isNodeFn(x: Node | undefined): x is NodeFn {
  if (!x) return false;
  return typeof x === "function";
}

export async function runGraph(graph: Graph, input: string) {
  let currentNode = graph[START];
  let state: State = { input };

  while (currentNode) {
    if (isNodeString(currentNode)) {
      if (currentNode === END) {
        break;
      }
    }

    if (!isNodeFn(currentNode)) return; // this is just to keep ts happy, this is never false

    let adjacentNode = graph[currentNode.name];
    if (!adjacentNode) return;

    if (Array.isArray(adjacentNode)) {
      if (!currentNode) return;
      const { next, newState } = (await currentNode(state)) as RouterNodeReturnType;
      if (!adjacentNode.map(x => x.name).includes(next.name)) {
        throw Error(`${currentNode.name} attempted to go to ${next.name}, but valid options are: [${adjacentNode.map(x => x.name)}]`);
      }
      state = newState;
      currentNode = next;
    } else {
      state = (await currentNode(state)) as State;
      currentNode = graph[currentNode.name];
    }
  }
  return state;
}

export function tool<
  F extends (arg: z.infer<S>) => ReturnType<F> extends Promise<string> ? Promise<string> : string,
  S extends ZodType<unknown>
>(fn: F,
  description: {
    name: string,
    description: string,
    schema: S
  }): ToolReturnType<F> {
  return {
    call: fn,
    describe: JSON.stringify({
      name: description.name,
      description: description.description,
      params: zodToJsonSchema(description.schema, description.name).definitions![description.name]
    }, null, 2),
  }
}

const weather = tool(({ city }) => {
  return "its 35 degree C";
}, {
  name: "weather",
  description: "gives you current weather",
  schema: z.object({
    city: z.string().describe("name of the city you want weather for")
  })
});

console.log(weather.describe);
