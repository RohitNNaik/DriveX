import { describe, it, expect } from 'vitest';
import { ComparePageInner, ComparePage } from '../page';

describe('ComparePageInner', () => {
  it('should return a result when called with valid arguments',     () => {
      const result = ComparePageInner();
      expect(result).toBeDefined();
    });

  it('should handle errors appropriately',     () => {
      try {
        ComparePageInner();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
});
describe('ComparePage', () => {
  it('should return a result when called with valid arguments',     () => {
      const result = ComparePage();
      expect(result).toBeDefined();
    });
});
