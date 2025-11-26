# Reddit Launch Posts

## r/SideProject

**Title:** After 15 years as a roofer, I built an AI API platform where workers pay $0 fees

**Body:**

Hey r/SideProject!

Long-time lurker, first-time poster. I finally shipped something I've been building for 3 years and wanted to share.

**The Problem**

I was a roofing contractor for 15 years. Platforms like Thumbtack and HomeAdvisor took 15-30% of every job. Good contractors were leaving because after fees, there was nothing left.

**The Solution**

FairTradeWorker - an Intelligence API platform for home services where:
- Workers pay $0 in platform fees (keep 92%)
- 50+ AI endpoints that learn and improve
- Photo → Quote in 60 seconds (97% accurate)

**Tech Stack**
- Frontend: React, TypeScript, Tailwind
- Backend: Python, FastAPI
- ML: Custom models (XGBoost + fine-tuned vision)
- Infra: AWS, Supabase, Stripe

**Business Model**

Instead of charging workers, we monetize API subscriptions:
- Free: 100 calls/mo
- Pro: $97/mo (10K calls)
- Enterprise: $497/mo (unlimited)

This aligns our incentives with worker success, not transaction volume.

**Current Stats**
- 500+ customers
- 2M+ predictions
- 97% quote accuracy
- Revenue positive (not burning VC cash)

**What I Learned**

1. Building for an industry you know deeply is a superpower
2. API-first lets you validate with developers before consumers
3. Fair economics can be a competitive advantage, not just marketing
4. 3 years is a long time—persistence matters more than speed

Happy to answer questions about the tech, the business, or what it's like going from contractor to coder.

🔗 fairtradeworker.com

---

## r/entrepreneur

**Title:** Launched my first real business after 15 years in construction - here's what I learned

**Body:**

After 15 years climbing roofs, I sold my contracting business and spent 3 years building a software company. Just launched publicly.

**The Business: FairTradeWorker**

Intelligence APIs for home services. We help contractors get instant quotes, match with customers, and optimize routes—without paying platform fees.

**Revenue Model**

- Workers pay $0 (this is the differentiation)
- API subscriptions: $97-497/mo
- Currently 500+ paying customers
- Cash flow positive from month 6

**The Numbers**

- Development cost: ~$200K (mostly my time)
- First revenue: Month 4 (beta customers)
- Break-even: Month 6
- Current MRR: Not sharing exact, but 5-figures

**What Worked**

1. **Solving my own problem** - I knew exactly what contractors needed because I was one
2. **B2B before B2C** - API customers are more forgiving and give better feedback
3. **Fair economics as positioning** - "Zero fees" is a clear differentiator
4. **Starting small** - 4 APIs → 50 APIs over time

**What Didn't Work**

1. **First version was too ambitious** - Tried to build everything at once
2. **Consumer marketing** - Expensive, low conversion. B2B was way easier
3. **Underpricing** - Started at $29/mo, should have been $97 from day one
4. **Solo building** - Found a co-founder at month 8, everything accelerated

**Advice for Other Entrepreneurs**

Build for an industry you deeply understand. The domain knowledge I gained from 15 years of actual work is worth more than any MBA.

Don't compete on features. Compete on economics. Workers remember who takes money from them.

Charge more than you think. If customers aren't complaining, you're too cheap.

Happy to answer questions!

---

## r/Startup_Ideas

**Title:** [Idea Validation] Zero-fee home services platform using AI for instant quotes

**Body:**

I've been working on this for a while and wanted to get feedback from this community.

**The Idea**

An Intelligence API platform for home services (contractors, plumbers, roofers, etc.) that:

1. Generates instant quotes from photos/videos using AI
2. Matches contractors with jobs based on skills/location
3. Processes payments with escrow protection
4. Charges workers ZERO platform fees

**The Economics**

Instead of taking 15-30% from workers (like Thumbtack/HomeAdvisor), we:
- Let workers keep 92%
- 8% goes to local territory operators
- Revenue comes from API subscriptions ($97-497/mo)

**Why This Works**

Contractors hate existing platforms because fees destroy their margins. By removing fees, we attract the best contractors. Better contractors = better service = more customers.

**Current Traction**

- 500+ paying API customers
- 97% quote accuracy
- 2M+ predictions processed

**Questions for You**

1. Does the "zero fees for workers" positioning resonate?
2. Would you use an API that generates instant home service quotes?
3. What would stop you from trying this?

Not trying to sell anything here—genuinely looking for feedback before we scale marketing.

Thanks!

---

## r/webdev / r/programming (Cross-post)

**Title:** Built a ML-powered API platform that generates home service quotes from photos in 60 seconds - technical breakdown

**Body:**

Hey all! Just launched something technical I've been building and wanted to share the architecture for those interested in applied ML.

**What It Does**

FairTradeWorker is an API platform that analyzes photos/videos of home projects and generates accurate quotes. Think: upload a photo of roof damage → get an itemized $12,450 quote in 60 seconds.

**The Stack**

```
Frontend: React, TypeScript, TailwindCSS, Vite
Backend: Python 3.11, FastAPI
ML: PyTorch, XGBoost, custom vision models
Data: Supabase (Postgres), Redis
Infra: AWS (ECS, S3, Lambda), Vercel
Payments: Stripe
```

**The Interesting Part: Self-Learning Loop**

Every API prediction is stored. When the actual job completes, we capture the outcome. This creates a feedback loop:

1. Prediction made (quote, timeline, materials)
2. Job completed
3. Actual cost/duration captured
4. Error calculated
5. Model weights updated
6. Next prediction is more accurate

We started at 82% accuracy 18 months ago. Now at 97.3%.

**Photo Analysis Pipeline**

1. **Segmentation**: Separate object of interest (roof, wall, etc.) from background
2. **Classification**: Identify material type, damage patterns
3. **Measurement**: Estimate dimensions using reference objects
4. **Scope generation**: Convert visual analysis to work items
5. **Pricing**: Apply local rates from our pricing database

Total latency: <2 seconds for the ML portion.

**API Design**

RESTful with OpenAPI 3.1 spec. Key endpoints:

```
POST /v1/jobs/analyze - Photo/video analysis
POST /v1/quotes/generate - Instant quote
POST /v1/contractors/match - Find contractors
GET /v1/territories/{id}/heatmap - Demand data
```

SDKs available for JavaScript, Python, Ruby.

**Lessons Learned**

1. Real-world ML is 80% data pipeline, 20% models
2. Feedback loops > larger models
3. Domain expertise (I was a contractor for 15 years) made training data curation possible
4. Start simple (XGBoost), get fancy (neural) only when needed

Happy to answer technical questions!

🔗 API docs: docs.fairtradeworker.com
🔗 GitHub (SDK): github.com/fairtradeworker
