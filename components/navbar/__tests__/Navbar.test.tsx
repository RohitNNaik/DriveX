import { describe, it, expect } from 'vitest';
import { Navbar } from '../Navbar';

describe('Navbar', () => {
  it('should return a result when called with valid arguments',     () => {
      const result = Navbar();
      expect(result).toBeDefined();
    });
});
