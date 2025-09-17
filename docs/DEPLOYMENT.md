# MindForge Deployment Guide

## Quick Start

MindForge is a static web application that can be deployed to any static hosting service. The `public/` directory contains all the files needed for deployment.

### Prerequisites
- Node.js 14+ (for development builds)
- Any static web hosting service
- HTTPS support (required for PWA features)

### Deploy to Netlify (Recommended)

1. **Connect Repository**
   ```bash
   # If using Git
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Netlify Configuration**
   Create `netlify.toml` in project root:
   ```toml
   [build]
     publish = "public"
     command = "npm run build"

   [build.environment]
     NODE_VERSION = "18"

   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
       Referrer-Policy = "strict-origin-when-cross-origin"

   [[headers]]
     for = "/sw.js"
     [headers.values]
       Cache-Control = "public, max-age=0"

   [[headers]]
     for = "/manifest.json"
     [headers.values]
       Cache-Control = "public, max-age=0"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Deploy Steps**
   - Connect your repository to Netlify
   - Build command: `npm run build`
   - Publish directory: `public`
   - Deploy!

### Deploy to Vercel

1. **Vercel Configuration**
   Create `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "public",
     "functions": {},
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ],
     "headers": [
       {
         "source": "/sw.js",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "public, max-age=0"
           }
         ]
       }
     ]
   }
   ```

2. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Deploy to GitHub Pages

1. **GitHub Actions Workflow**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v3

       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           cache: 'npm'

       - name: Install dependencies
         run: npm ci

       - name: Build
         run: npm run build

       - name: Deploy
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./public
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages

### Deploy to AWS S3 + CloudFront

1. **S3 Configuration**
   ```bash
   # Create S3 bucket
   aws s3 mb s3://your-mindforge-bucket

   # Configure for static website hosting
   aws s3 website s3://your-mindforge-bucket \
     --index-document index.html \
     --error-document index.html
   ```

2. **Upload Files**
   ```bash
   npm run build
   aws s3 sync public/ s3://your-mindforge-bucket --delete
   ```

3. **CloudFront Distribution**
   ```json
   {
     "Origins": [{
       "DomainName": "your-mindforge-bucket.s3.amazonaws.com",
       "Id": "S3-your-mindforge-bucket",
       "S3OriginConfig": {
         "OriginAccessIdentity": ""
       }
     }],
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-your-mindforge-bucket",
       "ViewerProtocolPolicy": "redirect-to-https",
       "CachePolicyId": "managed-caching-optimized"
     },
     "CustomErrorResponses": [{
       "ErrorCode": 404,
       "ResponseCode": 200,
       "ResponsePagePath": "/index.html"
     }]
   }
   ```

## Environment Configuration

### Production Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Verify build
npm run serve
```

### Environment Variables

Create `.env` file for configuration:
```env
# Analytics (optional)
ENABLE_ANALYTICS=true
ANALYTICS_ENDPOINT=https://your-analytics-endpoint.com

# Feature Flags
ENABLE_DAILY_CHALLENGES=true
ENABLE_MULTIPLAYER=false

# CDN Configuration
ASSET_CDN_URL=https://cdn.example.com
```

### Build Optimization

1. **CSS Optimization**
   ```bash
   # Minify CSS
   npm install -g cssnano-cli
   cssnano public/css/style.css public/css/style.min.css
   ```

2. **JavaScript Optimization**
   ```bash
   # Minify JavaScript
   npm install -g terser
   terser public/js/app.js -o public/js/app.min.js -c -m
   ```

3. **Image Optimization**
   ```bash
   # Install imagemin
   npm install -g imagemin-cli imagemin-webp

   # Convert images to WebP
   imagemin src/assets/images/*.png --out-dir=public/images --plugin=webp
   ```

## Performance Optimization

### Caching Strategy

```nginx
# Nginx configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /sw.js {
    expires 0;
    add_header Cache-Control "public, max-age=0";
}

location /manifest.json {
    expires 1d;
    add_header Cache-Control "public, max-age=86400";
}
```

### CDN Configuration

```javascript
// Update asset paths for CDN
const CDN_URL = 'https://cdn.example.com';

// In your build process
const assets = [
  'css/style.css',
  'js/app.js',
  'icons/icon-192x192.png'
];

assets.forEach(asset => {
  // Update references to use CDN
  content = content.replace(
    new RegExp(asset, 'g'),
    `${CDN_URL}/${asset}`
  );
});
```

### Compression

```bash
# Enable Gzip compression
gzip -9 public/js/app.js
gzip -9 public/css/style.css

# Enable Brotli compression (if supported)
brotli -q 11 public/js/app.js
brotli -q 11 public/css/style.css
```

## Security Configuration

### Content Security Policy

Add to HTML `<head>`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self';
  media-src 'self';
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
">
```

### HTTP Headers

```nginx
# Security headers
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### HTTPS Configuration

```nginx
# Force HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
}
```

## Monitoring and Analytics

### Error Monitoring

```javascript
// Add to your analytics configuration
window.addEventListener('error', (event) => {
  // Log client-side errors
  analytics.logEvent('javascript_error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

window.addEventListener('unhandledrejection', (event) => {
  // Log unhandled promise rejections
  analytics.logEvent('promise_rejection', {
    reason: event.reason?.toString(),
    stack: event.reason?.stack
  });
});
```

### Performance Monitoring

```javascript
// Core Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Uptime Monitoring

```yaml
# Example GitHub Actions workflow for uptime monitoring
name: Uptime Check
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes

jobs:
  uptime:
    runs-on: ubuntu-latest
    steps:
    - name: Check website
      run: |
        response=$(curl -s -o /dev/null -w "%{http_code}" https://your-domain.com)
        if [ $response != "200" ]; then
          echo "Website is down! Response code: $response"
          exit 1
        fi
```

## Backup and Recovery

### Database Backup
```bash
# Since this is a client-side app, backup user data patterns
# Users can export their data via the settings menu

# Backup analytics data (if using external service)
curl -X GET "https://api.analytics-service.com/export" \
  -H "Authorization: Bearer $API_KEY" \
  -o backup-$(date +%Y%m%d).json
```

### Code Backup
```bash
# Automated repository backup
git bundle create mindforge-backup-$(date +%Y%m%d).bundle --all
```

### Disaster Recovery Plan

1. **Repository Recovery**
   - Primary: GitHub repository
   - Backup: GitLab mirror
   - Local: Development machine clones

2. **Deployment Recovery**
   - Primary: Main hosting service (Netlify/Vercel)
   - Backup: Secondary service with automatic failover
   - CDN: Multiple CDN providers for asset delivery

3. **Data Recovery**
   - User data: Client-side storage (users responsible)
   - Analytics: Regular exports to backup storage
   - Configuration: Version controlled in repository

## Troubleshooting

### Common Issues

1. **Service Worker Not Updating**
   ```javascript
   // Force service worker update
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.getRegistrations().then(registrations => {
       registrations.forEach(registration => {
         registration.update();
       });
     });
   }
   ```

2. **HTTPS Required for PWA**
   ```bash
   # Local HTTPS for testing
   npx http-server public -S -C cert.pem -K key.pem
   ```

3. **Caching Issues**
   ```javascript
   // Clear all caches
   caches.keys().then(names => {
     names.forEach(name => {
       caches.delete(name);
     });
   });
   ```

### Performance Issues

1. **Slow Initial Load**
   - Check bundle size: `npm run analyze`
   - Implement code splitting
   - Optimize images and assets

2. **Memory Leaks**
   - Check for event listener cleanup
   - Monitor memory usage in DevTools
   - Implement proper component cleanup

3. **Poor Mobile Performance**
   - Test on actual devices
   - Reduce animation complexity
   - Optimize touch interactions

## Maintenance

### Regular Tasks

1. **Weekly**
   - Check uptime and performance metrics
   - Review error logs and fix critical issues
   - Update dependencies with security patches

2. **Monthly**
   - Review analytics and user feedback
   - Performance optimization review
   - Security audit and updates

3. **Quarterly**
   - Major dependency updates
   - Feature usage analysis
   - Infrastructure cost optimization

### Update Process

```bash
# Update dependencies
npm update

# Run tests
npm test

# Build and test
npm run build
npm run serve

# Deploy to staging
# Test thoroughly
# Deploy to production
```

## Support and Documentation

### User Support
- GitHub Issues for bug reports
- Documentation wiki for user guides
- Email support for critical issues

### Developer Resources
- API documentation
- Contributing guidelines
- Code style guide
- Testing procedures

### Community
- Discord server for real-time support
- Reddit community for discussions
- YouTube channel for tutorials
- Blog for updates and insights