/**
 * Standardizes a prompt text by transforming it to lower case, replacing
 * non-alphanumeric characters with hyphens, and trimming to a safe length for a filename.
 * @param {string} prompt - The generation prompt text.
 * @returns {string} The formatted filename slug.
 */
export function slugifyPrompt(prompt) {
  return prompt
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') // remove leading/trailing hyphens for cleaner names
    .slice(0, 50) || 'generated-image';
}

/**
 * Builds the URL for the Pollinations AI Image Synthesis API.
 * @param {string} prompt - The prompt to synthesize.
 * @param {number} seed - The random numerical seed.
 * @returns {string} The constructed API URL.
 */
export function getPollinationsUrl(prompt, seed) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=1024&height=1024&nologo=true`;
}

/**
 * Applies or toggles a style preset on an active prompt.
 * Removes any other style presets in the process.
 * @param {string} prompt - Current prompt.
 * @param {string} currentSelectedPreset - The currently active preset name.
 * @param {object} preset - The preset object to apply or toggle.
 * @param {object[]} allPresets - List of all presets.
 * @returns {object} The updated prompt and selectedPreset.
 */
export function applyPreset(prompt, currentSelectedPreset, preset, allPresets) {
  if (currentSelectedPreset === preset.name) {
    // Toggle off
    let newPrompt = prompt;
    newPrompt = newPrompt.replace(preset.style, '');
    newPrompt = newPrompt.replace(preset.style.replace(/^,\s*/, ''), '');
    newPrompt = newPrompt.trim().replace(/^,\s*/, '').replace(/,\s*$/, '');
    return {
      prompt: newPrompt,
      selectedPreset: ''
    };
  } else {
    // Clean previous presets first
    let cleanPrompt = prompt;
    allPresets.forEach(p => {
      cleanPrompt = cleanPrompt.replace(p.style, '');
      cleanPrompt = cleanPrompt.replace(p.style.replace(/^,\s*/, ''), '');
    });
    cleanPrompt = cleanPrompt.trim().replace(/^,\s*/, '').replace(/,\s*$/, '');

    // Append new style
    let newPrompt;
    if (cleanPrompt) {
      newPrompt = cleanPrompt + preset.style;
    } else {
      newPrompt = preset.style.replace(/^,\s*/, '');
    }

    return {
      prompt: newPrompt,
      selectedPreset: preset.name
    };
  }
}
