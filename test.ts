import { runGraph, type Graph, type State } from "."

function node1(state: State) {
  return {
    response: state.input + " " + "node1"
  }
}

function node2(state: State) {
  return {
    next: node4,
    newState: {
      response: state.response + " node2"
    }
  }
}

function node3(state: State) {
  return {
    response: state.response + " node3"
  }
}

function node4(state: State) {
  return {
    response: state.response + " node4"
  }
}

function node5(state: State) {
  return {
    response: state.response + " node5"
  }
}

const graph: Graph = {
  "__start__": node1,
  node1: node2,
  node2: [node3, node4],
  node3: "__end__",
  node4: node5,
  node5: "__end__"
};

const state = await runGraph(graph, "I got a job!");
console.log(state);

