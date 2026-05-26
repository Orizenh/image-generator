<script>
  import { onMount } from 'svelte';
  import ImageGenerator from '$lib/ImageGenerator.svelte';
  import HistoryGallery from '$lib/HistoryGallery.svelte';

  let history = $state([]);

  onMount(() => {
    const saved = localStorage.getItem('imageHistory');
    if (saved) {
      history = JSON.parse(saved);
    }
  });

  function handleNewGeneration(newItem) {
    history = [newItem, ...history];
    localStorage.setItem('imageHistory', JSON.stringify(history));
  }
</script>

<div class="app-container">
  <header>
    <div class="logo-container">
      <svg class="logo-icon" viewBox="0 0 100 100" width="65" height="65">
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a78bfa" />
            <stop offset="50%" stop-color="#f472b6" />
            <stop offset="100%" stop-color="#60a5fa" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Rotating ring -->
        <circle cx="50" cy="50" r="42" fill="none" stroke="url(#logo-grad)" stroke-width="2" stroke-dasharray="12 6" class="cosmic-ring" />
        <!-- Pulsing core star -->
        <path d="M50 15 C52 35 65 48 85 50 C65 52 52 65 50 85 C48 65 35 52 15 50 C35 48 48 35 50 15 Z" fill="url(#logo-grad)" filter="url(#glow)" class="star-core" />
        <circle cx="50" cy="50" r="5" fill="#ffffff" filter="url(#glow)" />
      </svg>
      <div class="logo-text">
        <h1>AI<span>.mage</span></h1>
        <p>Universal Image Synthesis Engine</p>
      </div>
    </div>
  </header>

  <main style="display: flex; flex-direction: column; gap: 2.5rem;">
    <ImageGenerator onGenerate={handleNewGeneration} />
    <HistoryGallery {history} />
  </main>
</div>
