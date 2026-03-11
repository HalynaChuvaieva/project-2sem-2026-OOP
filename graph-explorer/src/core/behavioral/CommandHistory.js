export class AddGraphCommand {
  constructor(graphList, graph) {
    this.graphList = graphList;
    this.graph = graph;
  }
  execute() { this.graphList.push(this.graph); }
  undo() { this.graphList.pop(); }
}

export class CommandInvoker {
  constructor() { this.history = []; }
  executeCommand(command) {
    command.execute();
    this.history.push(command);
  }
  undoLast() {
    if (this.history.length > 0) this.history.pop().undo();
  }
}