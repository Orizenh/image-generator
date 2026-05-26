<script>
  let { history = [] } = $props();

  async function downloadImage(url, prompt) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const safeName = prompt.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50) || 'generated-image';
      link.download = `${safeName}.jpg`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed, falling back to open in new tab:', error);
      window.open(url, '_blank');
    }
  }
</script>

{#if history && history.length > 0}
  <div class="glass-panel">
    <h2>Your Gallery</h2>
    <div class="history-grid">
      {#each history as item (item.url)}
        <div class="history-card">
          <img src={item.url} alt={item.prompt} loading="lazy" />
          <div class="prompt-overlay">
            {item.prompt}
          </div>
          <div class="history-controls">
            <button onclick={() => downloadImage(item.url, item.prompt)} class="control-btn mini-btn" title="Download Image">
              📥
            </button>
            <a href={item.url} target="_blank" rel="noreferrer" class="control-btn mini-btn link-btn" title="Open in New Tab">
              ↗
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
