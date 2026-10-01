# Mabel Portfolio deployment

The production site is a static export. Run:

```bash
npm ci
npm run build:static
```

Upload the contents of `out/` to any static host, or build the included Docker image:

```bash
docker build -t mabel-portfolio .
docker run -d --restart unless-stopped -p 80:80 --name mabel-portfolio mabel-portfolio
```

For a Tencent Cloud Lighthouse instance in Hong Kong, allow TCP 80 and 443 in the firewall. Point the domain's A record to the public IP. Add HTTPS at the instance or load-balancer layer after DNS resolves.

For a Mainland China instance or Mainland CDN acceleration, complete ICP filing before making the site public.
