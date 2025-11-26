# Hacker News Show HN Post

## Post Title
Show HN: FairTradeWorker – Self-learning APIs for home services (workers pay $0 fees)

## Post URL
https://fairtradeworker.com

## Post Text (for self-post if needed)

After 15 years as a roofing contractor and 3 years of coding nights and weekends, I'm launching FairTradeWorker—a platform where workers pay zero fees and AI gets smarter with every API call.

**The Problem**

The home services industry extracts massive fees from workers:
- Thumbtack: $20-60 per lead
- HomeAdvisor: 15-25% per job
- Angi: 3-7% commission + lead fees

The best contractors leave these platforms because fees destroy their margins. Homeowners pay more because contractors bake fees into quotes.

**Our Solution**

FairTradeWorker flips the model:
- Workers keep 92% of every job
- 8% goes to local territory operators (not us)
- We monetize through API subscriptions ($97-497/mo)

**The Tech**

50+ Intelligence APIs that learn from outcomes:
- Job Scope API: Analyze photos/videos, generate detailed scope
- Instant Quote API: Predict costs with 97% accuracy
- Contractor Match API: Find the right person for the job
- Territory Heatmap: Demand forecasting by location

Every prediction is compared against actual outcomes. This feedback loop improved our quote accuracy from 82% → 97% over 18 months.

**Stack**
- Frontend: React, TypeScript, Tailwind
- Backend: Python, FastAPI
- ML: Custom models trained on 2M+ historical jobs
- Infra: AWS, Supabase, Stripe

**Business Model**

Unlike VC-subsidized land-grabs, we're profitable from day one:
- Free tier: 100 API calls/month
- Professional: $97/mo (10K calls)
- Enterprise: $497/mo (unlimited)

We focus on B2B (contractors, platforms, PE firms) rather than burning cash on consumer acquisition.

**Why Now**

AI accuracy has crossed the threshold where automated quotes are reliable enough for production. Combined with LLM-powered photo/video analysis, we can extract job details that would take a human estimator 2 hours in under 60 seconds.

**Feedback Wanted**

1. Would you use an API that generates instant home service quotes?
2. Does the Fair Trade model (zero worker fees) resonate?
3. What endpoints would you want that we haven't built?

Live demo: https://fairtradeworker.com/demo
API docs: https://docs.fairtradeworker.com
GitHub (SDK): https://github.com/fairtradeworker

Happy to answer any technical questions. I spent 15 years in the field—ask me anything about the industry too.

---

## Prepared Responses for Common HN Questions

### "How is this different from [competitor]?"

Thumbtack, HomeAdvisor, and Angi are marketplaces that monetize by charging workers. They're incentivized to maximize transactions, not quality.

We're an API-first platform that monetizes developers and businesses, not workers. This aligns our incentives with contractor success—when they make more, our ecosystem grows.

### "How do you train the ML models?"

We started with 2M+ historical job records from partner contractors (anonymized). Each record includes: job type, location, scope, materials, labor hours, final cost.

The feedback loop works like this:
1. User requests a quote
2. Model predicts cost, timeline, materials
3. Job gets completed
4. Actual outcomes are captured
5. Prediction errors update model weights
6. Next prediction is more accurate

We use a combination of gradient boosting (XGBoost) for structured predictions and fine-tuned vision models for photo/video analysis.

### "How do you handle the cold start problem?"

New regions start with our base model trained on national data. Predictions begin at ~82% accuracy. As local data accumulates, we fine-tune regional models that account for:
- Local labor rates
- Material cost variations
- Permit requirements
- Seasonal patterns

Most regions reach 95%+ accuracy within 1,000 predictions.

### "Why should contractors trust you?"

1. Zero fees, forever—it's in our company charter
2. Transparent model: 92% to workers, 8% to territory operators
3. No lock-in: contractors own their customer relationships
4. Open API: they can build on top of us or leave anytime

Trust is earned. We're starting with contractors who've been burned by other platforms.

### "How do you make money if workers don't pay?"

B2B API subscriptions:
- Contractors use free tier, upgrade for more calls
- Platforms integrate our APIs (think ServiceTitan, Jobber)
- PE firms use Capital Intelligence APIs for market analysis
- Insurance companies use risk assessment APIs

The consumer marketplace subsidizes itself through territory operator fees.

### "This seems like it could be scammy"

Fair concern. We've built trust through:
- SOC 2 Type II certification
- Background checks for all contractors
- Escrow protection for homeowners
- Full transparency on pricing model
- No hidden fees, ever

We're not trying to extract maximum value—we're trying to build a sustainable ecosystem.
