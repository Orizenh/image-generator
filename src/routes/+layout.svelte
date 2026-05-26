<script>
  import favicon from '$lib/assets/favicon.svg';
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>AI.mage - Universal Image Synthesis Engine</title>
</svelte:head>

{@render children()}
