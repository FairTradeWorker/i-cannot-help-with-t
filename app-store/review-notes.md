# Apple App Store Review Notes

## FairTradeWorker - App Review Information

### Demo Account Credentials
- **Username:** demo@fairtradeworker.com
- **Password:** AppReview2024!

*Note: This demo account has full access to both homeowner and contractor features.*

---

### App Purpose & Functionality

FairTradeWorker is a home services marketplace that connects homeowners with verified contractors. The app uses AI-powered analysis to generate instant job quotes from photos and videos.

**Primary Use Cases:**
1. Homeowners post home improvement jobs (roofing, plumbing, HVAC, etc.)
2. AI analyzes photos/videos to generate scope and quotes
3. Contractors receive job matches based on skills and location
4. Payments are processed securely through Stripe

---

### Features Requiring Special Permissions

**Camera (NSCameraUsageDescription):**
Used to capture photos and videos of job sites for AI-powered job analysis. Homeowners photograph areas needing work, and contractors document project progress.

**Photo Library (NSPhotoLibraryUsageDescription):**
Allows users to upload existing photos of their property for job posting and project documentation.

**Microphone (NSMicrophoneUsageDescription):**
Records audio during video capture for verbal job descriptions. Users can narrate project requirements while filming.

**Location (NSLocationWhenInUseUsageDescription):**
- Matches homeowners with nearby contractors
- Enables route optimization for contractors
- Shows job locations on maps
- Location is only accessed when the app is in use

**Background Location (NSLocationAlwaysAndWhenInUseUsageDescription):**
Optional feature for contractors to receive real-time job notifications and track active jobs. Users can opt out in settings.

---

### Payment Processing

- Payments are processed through **Stripe** (PCI DSS compliant)
- Users can pay with credit/debit cards or Apple Pay
- Contractors receive payouts to their connected bank accounts
- All financial data is encrypted and never stored on device

---

### Content & Age Rating

- **Age Rating:** 4+ (no objectionable content)
- **User-Generated Content:** Users can post photos/videos of home projects and write reviews
- **Moderation:** All content is moderated for inappropriate material
- **Reporting:** Users can report inappropriate content or behavior

---

### In-App Purchases

FairTradeWorker does not currently offer in-app purchases. The app is free for homeowners and contractors. Revenue is generated through:
- 8% territory operator fees (not charged to app users)
- Enterprise API subscriptions (B2B, not available in consumer app)

---

### Third-Party Services

The app integrates with:
- **Stripe:** Payment processing
- **Supabase:** Backend database and authentication
- **Google Maps:** Location and mapping features
- **Sentry:** Error tracking and performance monitoring
- **Firebase:** Push notifications

---

### Testing Notes

**To test as a homeowner:**
1. Log in with demo account
2. Tap "Post a Job"
3. Select job type (e.g., "Roof Repair")
4. Use the photo upload feature (sample images included in demo)
5. View the AI-generated quote
6. See matched contractors

**To test as a contractor:**
1. Log in with demo account
2. Switch to Contractor mode (profile > Switch to Contractor)
3. Browse available jobs
4. View job details and customer information
5. Accept a job
6. View route to job site

**Testing In-App Payments:**
Use Stripe test card: 4242 4242 4242 4242 (any future date, any CVC)

---

### Contact for Review Questions

**App Review Contact:** review@fairtradeworker.com
**Phone:** +1 (888) 555-0123
**Response Time:** Within 24 hours

---

### Known Limitations

1. Full contractor verification requires background check (demo account is pre-verified)
2. Real payments are disabled in demo mode
3. Location features work best with actual GPS (simulator may show limited results)

---

### Version History Context

**Current Version:** 1.0.0
**New App Submission**

This is our initial App Store submission. The app has been in beta testing with 500+ users for 6 months with positive feedback and no major issues.

---

### Compliance Certifications

- SOC 2 Type II Certified
- GDPR Compliant
- CCPA Compliant
- PCI DSS Compliant (via Stripe)

---

*Thank you for reviewing FairTradeWorker. We're happy to provide any additional information or demonstrations needed.*
