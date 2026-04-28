import { describe, it, expect } from 'vitest';
import { GraphFactory } from './GraphFactory';

describe('GraphFactory', () => {
  it('should create a standard graph object with correct properties', () => {
    const config = { formula: 'x + 2', color: '#ff0000' };
    const graph = GraphFactory.createGraph('standard', config);
    
    expect(graph.formula).toBe('x + 2');
    expect(graph.color).toBe('#ff0000');
    expect(graph.type).toBe('function');
  });

  it('should throw error for unknown graph types', () => {
    expect(() => {
      GraphFactory.createGraph('invalid_type', {});
    }).toThrow();
  });
});