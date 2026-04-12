import { describe, it, expect, vi } from 'vitest';
import { MathCompilerProxy } from './MathCompilerProxy';
import { MathAdapter } from './MathAdapter';

describe('MathCompilerProxy', () => {
  it('should return correct calculation result', () => {
    const proxy = new MathCompilerProxy();
    const result = proxy.calculatePoint('x^2', 4);
    expect(result).toBe(16);
  });

  it('should cache repeated calculations', () => {
    const proxy = new MathCompilerProxy();
    const spy = vi.spyOn(MathAdapter, 'evaluate');
    
    proxy.calculatePoint('sin(x)', 1);
    proxy.calculatePoint('sin(x)', 1); // Second call
    
    expect(spy).toHaveBeenCalledTimes(1); // Should only call adapter once due to cache
  });
});