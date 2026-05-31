<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import favicon from '$lib/assets/favicon.svg';
  import '../app.css';

  let { children } = $props();

  onMount(() => {
    if (browser && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js', { type: 'module' })
        .then((reg) => console.log('Service Worker registered:', reg.scope))
        .catch((err) => console.error('Service Worker registration failed:', err));
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="manifest" href="/manifest.webmanifest" />
  <title>Nova.mage - Universal Image Synthesis Engine</title>
</svelte:head>

{@render children()}
