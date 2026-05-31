import { describe, it, expect } from 'vitest';
import { slugifyPrompt, getPollinationsUrl, applyPreset } from './utils.js';

describe('slugifyPrompt', () => {
  it('should slugify prompt correctly with standard characters', () => {
    expect(slugifyPrompt('A glowing crystal tree')).toBe('a-glowing-crystal-tree');
  });

  it('should trim and lowercase prompt correctly', () => {
    expect(slugifyPrompt('  Cyberpunk City AT Sunset  ')).toBe('cyberpunk-city-at-sunset');
  });

  it('should handle non-alphanumeric characters', () => {
    expect(slugifyPrompt('Spooky house! @night-time; #art')).toBe('spooky-house-night-time-art');
  });

  it('should slice to maximum of 50 characters', () => {
    const longPrompt = 'a very long prompt that goes on and on and exceeds fifty characters easily';
    expect(slugifyPrompt(longPrompt).length).toBeLessThanOrEqual(50);
    expect(slugifyPrompt(longPrompt)).toBe('a-very-long-prompt-that-goes-on-and-on-and-exceeds');
  });

  it('should fall back to default when prompt is empty or just special chars', () => {
    expect(slugifyPrompt('   ')).toBe('generated-image');
    expect(slugifyPrompt('!!! @@@ ###')).toBe('generated-image');
  });
});

describe('getPollinationsUrl', () => {
  it('should construct correct API url with encoded prompt and seed parameter', () => {
    const prompt = 'A beautiful blue butterfly';
    const seed = 12345;
    const url = getPollinationsUrl(prompt, seed);
    expect(url).toContain('https://image.pollinations.ai/prompt/');
    expect(url).toContain(encodeURIComponent(prompt));
    expect(url).toContain('seed=12345');
    expect(url).toContain('width=1024');
    expect(url).toContain('height=1024');
    expect(url).toContain('nologo=true');
  });
});

describe('applyPreset', () => {
  const mockPresets = [
    { name: '🌌 Cyberpunk', style: ', cyberpunk style, highly detailed neon, retro-futuristic, 8k resolution' },
    { name: '🎨 Oil Painting', style: ', classical oil painting style, visible textured brushstrokes, fine art, rich color palette' }
  ];

  it('should append a preset correctly if none is selected', () => {
    const prompt = 'A futuristic car';
    const result = applyPreset(prompt, '', mockPresets[0], mockPresets);
    expect(result.prompt).toBe('A futuristic car, cyberpunk style, highly detailed neon, retro-futuristic, 8k resolution');
    expect(result.selectedPreset).toBe('🌌 Cyberpunk');
  });

  it('should toggle off the active preset if selected again', () => {
    const prompt = 'A futuristic car, cyberpunk style, highly detailed neon, retro-futuristic, 8k resolution';
    const result = applyPreset(prompt, '🌌 Cyberpunk', mockPresets[0], mockPresets);
    expect(result.prompt).toBe('A futuristic car');
    expect(result.selectedPreset).toBe('');
  });

  it('should switch presets and clean previous ones', () => {
    const prompt = 'A futuristic car, cyberpunk style, highly detailed neon, retro-futuristic, 8k resolution';
    const result = applyPreset(prompt, '🌌 Cyberpunk', mockPresets[1], mockPresets);
    expect(result.prompt).toBe('A futuristic car, classical oil painting style, visible textured brushstrokes, fine art, rich color palette');
    expect(result.selectedPreset).toBe('🎨 Oil Painting');
  });

  it('should append a preset cleanly without a leading comma if the prompt is empty', () => {
    const prompt = '';
    const result = applyPreset(prompt, '', mockPresets[0], mockPresets);
    expect(result.prompt).toBe('cyberpunk style, highly detailed neon, retro-futuristic, 8k resolution');
    expect(result.selectedPreset).toBe('🌌 Cyberpunk');
  });

  it('should toggle off a preset cleanly leaving an empty string if it was applied on an empty prompt', () => {
    const prompt = 'cyberpunk style, highly detailed neon, retro-futuristic, 8k resolution';
    const result = applyPreset(prompt, '🌌 Cyberpunk', mockPresets[0], mockPresets);
    expect(result.prompt).toBe('');
    expect(result.selectedPreset).toBe('');
  });

  it('should switch presets cleanly without a leading comma if the prompt was initially empty', () => {
    const prompt = 'cyberpunk style, highly detailed neon, retro-futuristic, 8k resolution';
    const result = applyPreset(prompt, '🌌 Cyberpunk', mockPresets[1], mockPresets);
    expect(result.prompt).toBe('classical oil painting style, visible textured brushstrokes, fine art, rich color palette');
    expect(result.selectedPreset).toBe('🎨 Oil Painting');
  });
});
