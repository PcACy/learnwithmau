import { describe, expect, it } from 'vitest';
import { isInteractiveElement } from './useKeyDown';

describe('useKeyDown – isInteractiveElement', () => {
  it('identifies text input elements as interactive', () => {
    const input = { tagName: 'INPUT', isContentEditable: false } as HTMLElement;
    const textarea = { tagName: 'TEXTAREA', isContentEditable: false } as HTMLElement;
    const select = { tagName: 'SELECT', isContentEditable: false } as HTMLElement;
    const editableDiv = { tagName: 'DIV', isContentEditable: true } as HTMLElement;

    expect(isInteractiveElement(input)).toBe(true);
    expect(isInteractiveElement(textarea)).toBe(true);
    expect(isInteractiveElement(select)).toBe(true);
    expect(isInteractiveElement(editableDiv)).toBe(true);
  });

  it('identifies non-input elements as non-interactive', () => {
    const div = { tagName: 'DIV', isContentEditable: false } as HTMLElement;
    const button = { tagName: 'BUTTON', isContentEditable: false } as HTMLElement;
    const span = { tagName: 'SPAN', isContentEditable: false } as HTMLElement;

    expect(isInteractiveElement(div)).toBe(false);
    expect(isInteractiveElement(button)).toBe(false);
    expect(isInteractiveElement(span)).toBe(false);
    expect(isInteractiveElement(null)).toBe(false);
  });
});
