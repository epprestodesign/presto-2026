# Unsplash imagery

Two integration points — they're different and complementary.

## 1) MCP server (assistant-side, for curating imagery)
Lets the AI assistant search Unsplash during design sessions and drop real,
attributed image URLs into stories/components. **Does not run in the browser.**

- Server: https://github.com/cevatkerim/unsplash-mcp (Python / FastMCP)
- Cloned to: `~/mcp/unsplash-mcp` (outside this repo)
- Registered with Claude Code (local scope):
  ```bash
  claude mcp add unsplash -- uv run --directory ~/mcp/unsplash-mcp fastmcp run server.py
  ```
- **Add your key** (kept in the server's own gitignored `.env`):
  ```bash
  echo "UNSPLASH_ACCESS_KEY=your_key" > ~/mcp/unsplash-mcp/.env
  ```
  Then reconnect the MCP server (restart Claude Code) so it loads the key.
- Tools: `search_photos`, `get_random_photos`, `track_download` — responses
  include `attribution_text` / `attribution_html`.

## 2) Runtime (app-side, for live/dynamic imagery)
The app calls the Unsplash REST API itself. Used by `DsUnsplashImage.vue` via
`src/lib/unsplash.js`.

- Configure: `cp .env.example .env` then set `VITE_UNSPLASH_ACCESS_KEY=your_key`
- Use:
  ```vue
  <DsUnsplashImage query="hotel pool" orientation="landscape" :ratio="16/9" />
  ```
- See it: **Foundations → Imagery** in Storybook.

### Guardrails
- The runtime key is **exposed in the client bundle** (demo key, 50 req/hr). Use
  it only for local dev / prototypes.
- **Do NOT set `VITE_UNSPLASH_ACCESS_KEY` in CI** — the public GitHub Pages build
  would embed it. `DsUnsplashImage` falls back to a placeholder when no key is
  present, which is the intended public-build behavior.
- Attribution is required and rendered automatically; a download event is
  registered when an image is used (Unsplash API Guidelines).

### Which to use when
- **Component library / Storybook docs** → curate stable, attributed shots via
  the **MCP** server (deterministic, no client key).
- **Prototypes** → `DsUnsplashImage` for live, dynamic imagery.
