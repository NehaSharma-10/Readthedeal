# Read the Deal

A free, fast document analyzer that helps you understand contracts, prescriptions, government notices, warranties, return policies, meeting notes, and suspicious messages before you make decisions.

## 🚀 Features

- **7 Analysis Modes**: 
  - Contract Analysis - Spot hidden clauses and unfavorable terms
  - Message Detection - Identify phishing and scam indicators
  - Return Policy Breakdown - Understand conditions and timeframes
  - Prescription Translation - Plain-English dosage and warnings
  - Meeting Notes Extraction - Clear action items and decisions
  - Government Form Clarification - Deadlines and requirements explained
  - Warranty Coverage - Know what's actually covered
- **Auto-Detection**: Not sure what document it is? We'll figure it out
- **Plain English**: No jargon, no gotchas, just what matters
- **No Signup Required**: Try it free instantly without creating an account
- **Fast & Secure**: Results in seconds, documents never stored

## 📊 Tech Stack

- **Framework**: Next.js 16 (React 19, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Models**: Google Generative AI (Gemini 2.5 Flash)
- **Deployment**: Vercel-ready
- **Features**: Rate limiting, caching, quota management

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Generative AI API key

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/gotchaa.git
cd gotchaa

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Add your Google API key to .env.local
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
│   │   └── analyze-contract/           # API endpoints
│   │       ├── route.ts                # Main analysis endpoint
│   │       ├── cache.ts                # Result caching
│   │       ├── rate-limiter.ts         # Quota management
│   │       ├── message.ts              # Message analysis helper
│   │       ├── claude.ts               # Claude API integration
│   │       └── gemini.ts               # Gemini API integration
│   ├── layout.tsx                      # Root layout with SEO
│   ├── globals.css                     # Global styles & colors
│   └── page.tsx                        # Homepage
├── components/                         # React components
│   ├── Hero.tsx                        # Hero section
│   ├── Story.tsx                       # Problem narrative
│   ├── Playground.tsx                  # Analysis interface (7 modes)
│   ├── Examples.tsx                    # Use case examples
│   ├── HowItWorks.tsx                  # Process explanation
│   ├── WhenToUse.tsx                   # Scenarios per mode
│   ├── FAQ.tsx                         # FAQ section
│   └── ...                             # Other sections
├── lib/
│   ├── analyzers/                      # Analysis modules
│   │   ├── contract.ts                 # Contract analyzer
│   │   ├── message.ts                  # Message analyzer
│   │   ├── return-policy.ts            # Return policy analyzer
│   │   ├── prescription.ts             # Prescription analyzer
│   │   ├── meeting-notes.ts            # Meeting notes analyzer
│   │   ├── government-form.ts          # Government form analyzer
│   │   ├── warranty.ts                 # Warranty analyzer
│   │   ├── index.ts                    # Analyzer routing
│   │   └── gemini-utils.ts             # Shared Gemini utilities
│   └── icons.tsx                       # Icon components
├── public/
│   ├── sitemap.xml                     # SEO sitemap
│   ├── robots.txt                      # Crawler directives
│   └── images/                         # Hero & story images
└── next.config.ts                      # Next.js configuration
```

## 🔧 Configuration

### Environment Variables

```env
# Required - Google Generative AI API key
GOOGLE_API_KEY=your_key_here
```

### Customization

- **Colors**: Update `app/globals.css` color variables
- **Content**: Edit component files in `components/`
- **Metadata**: Update `app/layout.tsx` metadata
- **Analysis Prompts**: Modify `lib/analyzers/*.ts` files

## 📈 Features & Capabilities

### Analysis Modes

| Mode | What It Does | Best For |
|------|-------------|----------|
| **Contract** | Highlights obligations, costs, deadlines, risks | Leases, memberships, agreements |
| **Message** | Detects phishing, scams, credential requests | Emails, texts, suspicious alerts |
| **Return Policy** | Breaks down windows, fees, conditions | Online shopping, returns |
| **Prescription** | Explains dosage, interactions, warnings | Medical labels, medication info |
| **Meeting Notes** | Extracts decisions, action items, owners | Raw notes, transcripts |
| **Government** | Clarifies requirements, deadlines, consequences | Tax forms, notices, permits |
| **Warranty** | Shows coverage, exclusions, claim process | Product warranties, guarantees |

### Auto-Detection

When user selects "Not sure", the tool:
1. Classifies the document type automatically
2. Routes to appropriate analyzer
3. Displays "Detected as: [type]" above results

### Smart Caching

- Results cached per document (24-hour expiry)
- Reduces API calls and cost
- Instant results for duplicates

### Rate Limiting

- Free tier: 10 analyses per day per user
- Quota resets daily at UTC midnight
- User identifier via IP + User-Agent

## 🚀 Performance

- **Build Time**: ~8 seconds (Turbopack)
- **Page Load**: <2 seconds
- **API Response**: <5 seconds per analysis
- **Lighthouse**: 90+ score

## 🔒 Security

- ✅ HTTPS enforced
- ✅ Environment variables for secrets
- ✅ Rate limiting prevents abuse
- ✅ No document storage
- ✅ Cache cleared daily

## 📞 Support

- **Issues**: GitHub Issues
- **Questions**: Email support
- **Docs**: See README and project files

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🎯 Roadmap

- [ ] User accounts & history
- [ ] Batch processing
- [ ] Mobile app
- [ ] Browser extension
- [ ] API for developers
- [ ] Premium tier with higher limits

## ✅ Current Status

**Production Ready** ✅
- All 7 modes fully functional
- Auto-detection working
- Rate limiting implemented
- Caching optimized
- Mobile responsive
- SEO optimized

---

**Made with ❤️ | June 2026**
