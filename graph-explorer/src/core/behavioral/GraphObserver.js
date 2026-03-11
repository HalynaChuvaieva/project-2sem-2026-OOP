export class GraphSubject {
  constructor() { this.observers = []; this.data = []; }
  subscribe(observer) { this.observers.push(observer); }
  notify() { this.observers.forEach(obs => obs.update(this.data)); }
  
  addData(newData) {
    this.data.push(newData);
    this.notify();
  }
}