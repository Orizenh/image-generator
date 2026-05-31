<script>
  import {
    applyPreset as applyPresetUtil,
    getPollinationsUrl,
    slugifyPrompt,
  } from "./utils.js";

  let { onGenerate } = $props();

  let prompt = $state("");
  let isGenerating = $state(false);
  let currentImage = $state(null);
  let selectedPreset = $state("");
  let errorMessage = $state("");

  const presets = [
    {
      name: "🌌 Cyberpunk",
      style:
        "Cyberpunk style, highly detailed neon, retro-futuristic, 8k resolution",
    },
    {
      name: "🎨 Oil Painting",
      style:
        "Classical oil painting style, visible textured brushstrokes, fine art, rich color palette",
    },
    {
      name: "👾 Pixel Art",
      style:
        "Retro 16-bit pixel art style, detailed pixel landscape, nostalgic video game graphic",
    },
    {
      name: "⚡ Anime",
      style:
        "Modern anime illustration style, highly detailed, vibrant aesthetics, sharp lighting",
    },
    {
      name: "🔮 3D Render",
      style:
        "Stunning futuristic 3D octane render, photorealistic, intricate depth, raytracing",
    },
    {
      name: "🍄 Surrealism",
      style:
        "Abstract dreamlike surrealism style, Dali-esque fantasy landscape, highly imaginative",
    },
  ];

  function applyPreset(preset) {
    const updated = applyPresetUtil(prompt, selectedPreset, preset, presets);
    prompt = updated.prompt;
    selectedPreset = updated.selectedPreset;
  }

  function handleGenerate() {
    if (!prompt.trim()) return;

    isGenerating = true;
    currentImage = null;
    errorMessage = "";

    const seed = Math.floor(Math.random() * 1000000);
    currentImage = getPollinationsUrl(prompt, seed);
  }

  function handleLoad() {
    isGenerating = false;
    onGenerate({ url: currentImage, prompt });
  }

  function handleError() {
    isGenerating = false;
    currentImage = null;
    errorMessage = "Failed to load image. The public GPU cluster might be overloaded or temporarily blocked. Please try retrying in a moment.";
  }

  async function downloadImage() {
    if (!currentImage) return;
    try {
      const response = await fetch(currentImage);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      const safeName = slugifyPrompt(prompt);
      link.download = `${safeName}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed, falling back to open in new tab:", error);
      window.open(currentImage, "_blank");
    }
  }
</script>

<div class="glass-panel">
  <div class="input-section">
    <input
      type="text"
      placeholder="Describe your imagination... (e.g. A cyberpunk city at sunset)"
      bind:value={prompt}
      onkeydown={(e) => e.key === "Enter" && handleGenerate()}
      disabled={isGenerating}
    />
    <button
      class="primary-btn"
      onclick={handleGenerate}
      disabled={isGenerating || !prompt.trim()}
    >
      {isGenerating ? "Generating..." : "Generate ✨"}
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
      <div
        class="image-wrapper"
        style="display: {isGenerating ? 'none' : 'flex'};"
      >
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
            <button
              onclick={downloadImage}
              class="control-btn"
              title="Download Image"
            >
              📥 Download
            </button>
            <a
              href={currentImage}
              target="_blank"
              rel="noreferrer"
              class="control-btn link-btn"
              title="Open in New Tab"
            >
              ↗ Open Fullsize
            </a>
          </div>
        {/if}
      </div>
    {/if}
    {#if !isGenerating && !currentImage}
      {#if errorMessage}
        <div class="error-banner">
          <p class="error-text">⚠️ {errorMessage}</p>
          <button class="primary-btn retry-btn" onclick={handleGenerate}>
            Retry 🔄
          </button>
        </div>
      {:else}
        <div class="empty-state">
          <p>Your creation will appear here</p>
        </div>
      {/if}
    {/if}
  </div>
</div>
