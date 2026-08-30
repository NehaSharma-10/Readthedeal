# AI Provider Setup Guide

## Quick Start

The app uses **Gemini 2.0 Flash** as the primary AI provider for document analysis, with **Groq** as an optional fallback.

### 1. Get Your API Keys

#### Google Gemini (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key" 
3. Copy the key

#### Groq (Optional - Used as Fallback)
1. Go to [Groq Console](https://console.groq.com/keys)
2. Create or copy your API key
3. This is optional but recommended for reliability

### 2. Setup Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:

```env
GOOGLE_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
```

### 3. Test the Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 and try analyzing a document
```

## Provider Behavior

- **Gemini-3.6-Flash (Primary)**: Latest Google model with improved reasoning and speed
  - Used first for all analysis modes
  - Free tier: 15K prompt + 60K output tokens/day
  - Requires `GOOGLE_API_KEY` from [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
  
- **Llama-3.1-70B via Groq (Fallback)**: Automatically used if Gemini fails
  - Excellent reasoning for complex document analysis
  - Strong instruction-following capabilities
  - Multilingual support
  - Free tier: ~1M tokens/month
  - Requires `GROQ_API_KEY` from [https://console.groq.com/keys](https://console.groq.com/keys)
  
- **Both Fail**: Returns user-friendly error message

## Troubleshooting

### "GOOGLE_API_KEY is not set"
- Ensure `.env.local` file exists in project root
- Check that `GOOGLE_API_KEY=` is set with a valid key
- Restart dev server after adding keys

### "All AI providers unavailable"
- Check your API keys are valid
- Verify rate limits aren't exceeded
- Check internet connection
- If Gemini is down, Groq fallback will be used

### Rate Limiting
- Gemini: Free tier has quota limits
- Groq: Free tier has higher limits
- Consider using both for better reliability

## API Key Safety

- Never commit `.env.local` to version control
- `.env.local` is in `.gitignore`
- Use separate keys for development/production
- Rotate keys regularly if exposed
