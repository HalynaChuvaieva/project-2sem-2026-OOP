import { describe, it, expect } from 'vitest';
import { CommandInvoker, AddGraphCommand } from './CommandHistory';

describe('Command Pattern: CommandInvoker та AddGraphCommand', () => {
  it('Має додавати графік до списку та в історію', () => {
    const invoker = new CommandInvoker();
    const graphs = [];
    const newGraph = { formula: 'x^2', color: 'red' };
    
    const command = new AddGraphCommand(graphs, newGraph);
    invoker.executeCommand(command);
    
    expect(graphs.length).toBe(1);
    expect(graphs[0].formula).toBe('x^2');
    expect(invoker.history.length).toBe(1);
  });

  it('Має правильно скасовувати останню дію (Undo)', () => {
    const invoker = new CommandInvoker();
    const graphs = [];
    const command = new AddGraphCommand(graphs, { formula: 'sin(x)' });
    
    invoker.executeCommand(command);
    invoker.undoLast(); 
    
    expect(graphs.length).toBe(0); 
    expect(invoker.history.length).toBe(0); 
  });

  it('Не повинен ламатися при спробі скасувати, коли історія порожня', () => {
    const invoker = new CommandInvoker();
    expect(() => invoker.undoLast()).not.toThrow();
  });
});