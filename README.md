# Studio Nib — Animation Portfolio

A cinematic portfolio site for [Studio Nib](https://www.youtube.com/@StudioNibAnime),
an independent animation studio. Videos live on YouTube; this site embeds and
presents them with a clean, studio-style design.

**Live site:** https://studionib.studio-nib.workers.dev <!-- update once Cloudflare gives you the real URL -->
**YouTube:** https://www.youtube.com/@StudioNibAnime

Built as a plain static site — HTML, CSS, and vanilla JavaScript. No build step,
no framework, no backend.

## Deployment

Hosted on **Cloudflare Pages**, connected to this repository. Every push to
`main` triggers a new deployment. Security headers are set in `_headers`; the
Content-Security-Policy lives in the `<meta>` tag of `index.html`.
