# ShareFuze Website

Static landing page for [sharefuze.com](https://sharefuze.com), hosted on GitHub Pages.

## Local Preview

```bash
# Any simple HTTP server works
python3 -m http.server 8000
# Then open http://localhost:8000
```

## Deploy

Push to the `main` branch of the `sharefuze.github.io` repo (or enable GitHub Pages on any repo pointing to the root of `main`).

## Custom Domain

The `CNAME` file points to `sharefuze.com`. DNS records must point to GitHub Pages — see the deploy guide below.
