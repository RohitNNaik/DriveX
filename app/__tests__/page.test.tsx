import { describe, it, expect } from 'vitest';
import { HomePage } from '../page';

describe('HomePage', () => {
  it('should return a result when called with valid arguments',     () => {
      const result = HomePage();
      expect(result).toBeDefined();
    });
});
