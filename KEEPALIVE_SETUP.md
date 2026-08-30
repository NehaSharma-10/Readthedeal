# Appwrite Keepalive Setup

Your Appwrite project **deactivates after 7 days of inactivity**. This guide sets up automated keepalive checks every 5 days to keep your project active.

## Two Setup Options

### Option 1: External Cron Service (Recommended for Vercel)

Use a free external cron service to ping your keepalive endpoint.

**Steps:**

1. **Go to one of these services:**
   - [cron-job.org](https://cron-job.org/) (free, no signup required)
   - [EasyCron](https://www.easycron.com/) (free tier available)
   - [Vercel Cron Functions](https://vercel.com/docs/cron-jobs) (if deployed on Vercel)

2. **Create a new cron job with:**
   - **URL**: `https://yourapp.com/api/keepalive`
   - **Method**: POST
   - **Schedule**: Every 5 days (120 hours)
   - **Headers** (optional, if using KEEPALIVE_SECRET_KEY):
     ```
     Authorization: Bearer your_secret_key
     ```

3. **Add to `.env.local` (optional but recommended):**
   ```env
   KEEPALIVE_SECRET_KEY=your_secure_random_key
   ```

4. **Test it:**
   ```bash
   curl -X POST https://yourapp.com/api/keepalive
   ```

---

### Option 2: Internal Scheduler (Self-Hosted/Local)

For self-hosted or local deployments, use the built-in Node.js scheduler.

**Steps:**

1. **Install dependencies:**
   ```bash
   npm install
   # This installs node-cron (already added to package.json)
   ```

2. **Initialize scheduler in your app layout:**

   Edit [app/layout.tsx](app/layout.tsx) and add this at the top (server component):
   
   ```typescript
   import { initializeKeepaliveScheduler } from '@/lib/keepalive-scheduler';
   
   // Initialize keepalive scheduler on server startup
   initializeKeepaliveScheduler();
   ```

3. **Verify it's running:**
   - Check server console logs for: `✅ Keepalive scheduler initialized`
   - Next run will be in 5 days at 2:00 AM

4. **Test manually (optional):**
   ```bash
   curl -X POST http://localhost:3000/api/keepalive
   ```

---

## How It Works

- **Endpoint**: `/api/keepalive` (POST)
- **Payload**: Sends a minimal test contract (0 cost)
- **Logging**: Logs to Appwrite via `logDocument()` - this keeps the project active
- **Frequency**: Every 5 days (before the 7-day inactivity limit)
- **Monitoring**: Check Appwrite admin console → Documents collection to verify

---

## Verification

Check if keepalive is working:

1. **In Appwrite Console:**
   - Go to your project → Collections → Documents
   - Filter by type: `contract`
   - Look for entries with "KEEPALIVE TEST CONTRACT"
   - Should appear every ~5 days

2. **In Server Logs (Option 2):**
   ```
   ✅ Keepalive task completed successfully
   📅 Next scheduled run: 2026-09-04T02:00:00.000Z
   ```

3. **Via API:**
   ```bash
   curl https://yourapp.com/api/keepalive
   # Returns:
   # { "success": true, "timestamp": "...", "nextCheck": "..." }
   ```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cron job not triggering | Verify URL is public/accessible. Test with `curl` |
| "Unauthorized" error | Check `KEEPALIVE_SECRET_KEY` matches if configured |
| Appwrite still inactive | Ensure `logDocument()` has valid Appwrite credentials |
| Scheduler not starting | Check `node-cron` is installed: `npm install` |
| Wrong schedule time | Edit cron format in `keepalive-scheduler.ts` line 18 |

---

## Disabling Keepalive

If you want to disable the scheduler:

**Option 1 (External):**
- Delete/pause the cron job in cron-job.org or EasyCron

**Option 2 (Internal):**
- Remove `initializeKeepaliveScheduler()` from `app/layout.tsx`
- Or call `stopKeepaliveScheduler()` to stop runtime

---

## Cost

- **Appwrite**: Free (keepalive logs don't count against quota)
- **External Cron**: Free (cron-job.org, EasyCron)
- **API Calls**: Uses ~1-10 tokens (minimal impact on daily quota)
