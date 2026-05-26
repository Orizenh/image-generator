<script>
  let { onGenerate } = $props();

  let prompt = $state('');
  let isGenerating = $state(false);
  let currentImage = $state(null);
  let selectedPreset = $state('');

  const presets = [
    { name: '🌌 Cyberpunk', style: ', cyberpunk style, highly detailed neon, retro-futuristic, 8k resolution' },
    { name: '🎨 Oil Painting', style: ', classical oil painting style, visible textured brushstrokes, fine art, rich color palette' },
    { name: '👾 Pixel Art', style: ', retro 16-bit pixel art style, detailed pixel landscape, nostalgic video game graphic' },
    { name: '⚡ Anime', style: ', modern anime illustration style, highly detailed, vibrant aesthetics, sharp lighting' },
    { name: '🔮 3D Render', style: ', stunning futuristic 3D octane render, photorealistic, intricate depth, raytracing' },
    { name: '🍄 Surrealism', style: ', abstract dreamlike surrealism style, Dali-esque fantasy landscape, highly imaginative' }
  ];

  function applyPreset(preset) {
    if (selectedPreset === preset.name) {
      // Toggle off
      prompt = prompt.replace(preset.style, '');
      selectedPreset = '';
    } else {
      // Clean previous presets first
      let cleanPrompt = prompt;
      presets.forEach(p => {
        cleanPrompt = cleanPrompt.replace(p.style, '');
      });
      prompt = cleanPrompt + preset.style;
      selectedPreset = preset.name;
    }
  }

  function handleGenerate() {
    if (!prompt.trim()) return;

    isGenerating = true;
    currentImage = null;

    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=1024&height=1024&nologo=true`;

    currentImage = imageUrl;
  }

  function handleLoad() {
    isGenerating = false;
    onGenerate({ url: currentImage, prompt });
  }

  function handleError() {
    isGenerating = false;
    currentImage = null;
    alert('Failed to load image. The API might be busy or blocked.');
  }

  async function downloadImage() {
    if (!currentImage) return;
    try {
      const response = await fetch(currentImage);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      // Convert prompt to a safe filename slug
      const safeName = prompt.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50) || 'generated-image';
      link.download = `${safeName}.jpg`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed, falling back to open in new tab:', error);
      window.open(currentImage, '_blank');
    }
  }
</script>

<div class="glass-panel">
  <div class="input-section">
    <input
      type="text"
      placeholder="Describe your imagination... (e.g. A cyberpunk city at sunset)"
      bind:value={prompt}
      onkeydown={(e) => e.key === 'Enter' && handleGenerate()}
      disabled={isGenerating}
    />
    <button onclick={handleGenerate} disabled={isGenerating || !prompt.trim()}>
      {isGenerating ? 'Generating...' : 'Generate ✨'}
    </button>
  </div>

  <div class="presets-container">
    {#each presets as preset}
      <button 
        class="preset-badge {selectedPreset === preset.name ? 'active' : ''}" 
        onclick={() => applyPreset(preset)}
        disabled={isGenerating}
      >
        {preset.name}
      </button>
    {/each}
  </div>

  <div class="generator-container {isGenerating ? 'loading' : ''}">
    {#if isGenerating}
      <div class="loader"></div>
    {/if}
    {#if currentImage}
      <div class="image-wrapper" style="display: {isGenerating ? 'none' : 'block'};">
        <!-- svelte-ignore a11y_missing_attribute -->
        <img
          src={currentImage}
          alt={prompt}
          class="generated-image"
          referrerpolicy="no-referrer"
          onload={handleLoad}
          onerror={handleError}
        />
        {#if !isGenerating}
          <div class="image-controls">
            <button onclick={downloadImage} class="control-btn" title="Download Image">
              📥 Download
            </button>
            <a href={currentImage} target="_blank" rel="noreferrer" class="control-btn link-btn" title="Open in New Tab">
              ↗ Open Fullsize
            </a>
          </div>
        {/if}
      </div>
    {/if}
    {#if !isGenerating && !currentImage}
      <div class="empty-state">
        <p>Your creation will appear here</p>
      </div>
    {/if}
  </div>
</div>
