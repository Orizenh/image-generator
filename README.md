# 🌌 AI.mage - Universal Image Synthesis Engine

AI.mage is a premium, high-fidelity AI image generator application built on Svelte 5 and SvelteKit. It leverages public GPU clusters via **Pollinations AI** to dynamically synthesize high-resolution imagery from text prompts with zero authentication barriers.

The interface features stunning glassmorphism, drifting ambient HSL glow backdrops, a revolving custom animated SVG brand logo, interactive click-to-apply style presets, and fluid hover-activated controls for direct offline downloads.

---

## ✨ Features

- **⚡ Modern SvelteKit Scaffold**: Rebuilt from the ground up using Svelte's official `npx sv create` CLI and configured with standard static routing.
- **🔮 Native Svelte 5 Runes**: Employs Svelte 5's cutting-edge reactive state system (`let history = $state([])` and `$props()`) for lightning-fast performance and clean reactivity.
- **🎨 Interactive Style Presets**: Clickable, color-shifting aesthetic badges below the search bar (`🌌 Cyberpunk`, `🎨 Oil Painting`, `👾 Pixel Art`, `⚡ Anime`, `🔮 3D Render`, `🍄 Surrealism`) that instantly append style descriptive directives to your prompt.
- **📥 CORS-Safe Dynamic Downloading**: Dynamically fetches image binaries as native browser Blobs and downloads them directly, converting prompts into clean safe filename slugs (e.g. `glowing-crystal-tree.jpg`).
- **↗️ Hover Control Overlays**: Dynamic glassmorphic overlay bars that hover smoothly on top of active generation canvases and gallery cards alike, offering rapid "Download" and "Open Fullsize in New Tab" controls.
- **💾 Local Storage Persistence**: Generation history is synced to the browser's `localStorage` on completion to ensure generated art remains accessible across tab reloads.

---

## 🛠️ Tech Stack

- **Core**: [SvelteKit](https://svelte.dev/docs/kit) + Svelte 5 (Runes)
- **Bundler**: [Vite](https://vite.dev)
- **Styling**: Premium custom HSL Vanilla CSS (featuring glassmorphic filters, CSS `@keyframes` orbit animations, and glowing backdrop mesh nodes)
- **API**: [Pollinations AI Image Generator API](https://image.pollinations.ai) (Cloudflare Referrer bypass logic integrated)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone git@github.com:Orizenh/image-generator.git
cd image-generator

# Install npm packages
npm install
```

### 2. Start the Development Server

Start a hot-reloaded development server:

```bash
npm run dev
```

The application will spin up at **`http://localhost:5173`** (or the next available local port).

### 3. Build & Preview Production Bundle

Compile the highly optimized production build:

```bash
# Compile client/server production files
npm run build

# Preview build locally
npm run preview
```

---

## 📸 Interface Preview

Symmetrical search-engine-inspired prompt container:

- A spinning outer orbit ring and pulsing core star custom branding.
- Centered layout for maximum premium feel.
- Sliding action buttons layered on top-right of your history cards on hover.
