# Read the Deal

A free, fast contract and message analyzer that helps you understand agreements before you sign.

## 🚀 Features

- **Contract Analysis**: Upload any contract, lease, or agreement to get a plain-English breakdown
- **Scam Detection**: Analyze suspicious messages and emails for phishing and scam indicators
- **Hidden Fees Finder**: Spot cancellation traps, deadlines, and unfavorable terms
- **No Signup Required**: Try it free instantly without creating an account
- **Fast & Secure**: Results in seconds, documents never stored

## 📊 Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **AI**: Claude & Gemini APIs

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/gotchaa.git
cd gotchaa

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Add your API keys to .env.local
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Build & Deploy

```bash
npm run build
npm run start
```

## 📋 Project Structure

```
gotchaa/
├── app/
│   ├── api/
│   │   └── analyze-contract/    # API endpoints
│   ├── layout.tsx               # Root layout with SEO
│   ├── globals.css              # Global styles
│   └── page.tsx                 # Homepage
├── components/                  # React components
│   ├── Hero.tsx                 # Hero section
│   ├── Playground.tsx           # Analysis interface
│   ├── FAQ.tsx                  # FAQ section
│   └── ...                      # Other sections
├── public/
│   ├── sitemap.xml              # SEO sitemap
│   ├── robots.txt               # Crawler directives
│   └── images/                  # Images
└── next.config.ts               # Next.js configuration
```

## 🔧 Configuration

### Environment Variables

```env
# API Keys
NEXT_PUBLIC_CLAUDE_API_KEY=your_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here

# Site
NEXT_PUBLIC_SITE_URL=https://readthedeal.com
```

### Customization

- **Colors**: Update `app/globals.css` color variables
- **Content**: Edit component files in `components/`
- **Metadata**: Update `app/layout.tsx` metadata
- **Images**: Add images to `public/` folder

## 📈 Performance

- **Lighthouse Score**: 90+
- **Core Web Vitals**: All green ✅
- **Mobile**: Fully responsive
- **SEO**: Optimized for search engines

## 📚 Documentation

- `README.md` - This file
- `OPTIMIZATION_README.md` - SEO & Performance guide
- `DEPLOYMENT_READY.md` - Deployment guide
- `RESPONSIVENESS_AUDIT.md` - Mobile compatibility

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Deploy on Vercel
# 1. Go to https://vercel.com
# 2. Import repository
# 3. Deploy (automatic)
```

### Troubleshooting

**Issue**: Slow performance?
→ Check Lighthouse audit in DevTools

**Issue**: Not indexed in Google?
→ Submit sitemap to Google Search Console

**Issue**: Environment variables not working?
→ Verify variables in Vercel Project Settings

## 🔒 Security

- ✅ HTTPS enforced
- ✅ Security headers configured
- ✅ No secrets in code
- ✅ API keys in environment variables
- ✅ Rate limiting on API endpoints

## 📞 Support

- **Issues**: GitHub Issues
- **Questions**: Email support
- **Docs**: See documentation files

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🎯 Roadmap

- [ ] User accounts & history
- [ ] Batch document processing
- [ ] Mobile app
- [ ] Browser extension
- [ ] API for developers
- [ ] Premium tier

## ✅ Status

**Production Ready** ✅
- SEO optimized
- Performance optimized
- Mobile responsive
- Security hardened

---

**Made with ❤️ | June 2026**
