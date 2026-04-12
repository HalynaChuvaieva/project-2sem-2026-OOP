import { describe, it, expect, beforeEach } from 'vitest';
import { CommandHistory } from './CommandHistory';
import { WorkspaceMemento } from './WorkspaceMemento';

describe('CommandHistory', () => {
  let history;

  beforeEach(() => {
    history = new CommandHistory();
  });

  it('should store mementos correctly', () => {
    const memento = new WorkspaceMemento([{ id: 1 }]);
    history.push(memento);
    expect(history.undoStack.length).toBe(1);
  });

  it('should undo to the previous state', () => {
    history.push(new WorkspaceMemento([{ id: 1 }]));
    history.push(new WorkspaceMemento([{ id: 1 }, { id: 2 }]));
    
    const undone = history.undo();]
    expect(undone.getState()).toEqual([{ id: 1 }]);
  });

  it('should handle redo operations', () => {
    history.push(new WorkspaceMemento([{ id: 1 }]));
    history.push(new WorkspaceMemento([{ id: 1 }, { id: 2 }]));
    
    history.undo();
    const redone = history.redo();
    expect(redone.getState()).toEqual([{ id: 1 }, { id: 2 }]);
  });
});