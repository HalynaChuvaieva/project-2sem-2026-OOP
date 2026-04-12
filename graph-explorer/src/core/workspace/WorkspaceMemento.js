export class Memento {
  constructor(state) { this.state = JSON.stringify(state); }
  getState() { return JSON.parse(this.state); }
}

export class WorkspaceOriginator {
  constructor() { this.equations = []; }
  setEquations(eqs) { this.equations = eqs; }
  save() { return new Memento(this.equations); }
  restore(memento) { this.equations = memento.getState(); }
}