import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  site: 'https://weldonweb.co.uk',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
    rehypePlugins: [
      [rehypeMermaid, { strategy: 'img-svg' }],
    ],
  },
});