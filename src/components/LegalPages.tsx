import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Shield,
  Cookie,
  Download,
  Printer,
  Calendar,
  CheckCircle,
} from '@phosphor-icons/react';

// ============================================================================
// Terms of Service Component
// ============================================================================

export function TermsOfService() {
  const lastUpdated = 'November 27, 2025';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-xl bg-primary">
          <FileText className="w-8 h-8 text-white" weight="fill" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardContent className="p-8">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-8 text-sm">
              <section>
                <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using FairTradeWorker ("Platform"), you agree to be bound by these 
                  Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  FairTradeWorker is a home services marketplace platform that connects homeowners with 
                  contractors. The Platform provides tools for job posting, bidding, messaging, payments, 
                  and AI-powered job scope analysis.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">3. User Accounts</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>3.1. You must provide accurate and complete registration information.</p>
                  <p>3.2. You are responsible for maintaining the security of your account.</p>
                  <p>3.3. You must be at least 18 years old to use the Platform.</p>
                  <p>3.4. One account per individual or business entity is permitted.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">4. Fees and Payments</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>4.1. <strong>Homeowners:</strong> $20 platform fee per job posted.</p>
                  <p>4.2. <strong>Contractors:</strong> Zero platform fees. Keep 100% of earnings.</p>
                  <p>4.3. <strong>Territory Operators:</strong> First 10 territories FREE. Subsequent territories: $500+.</p>
                  <p>4.4. All payments are processed securely through our payment provider.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">5. Contractor Obligations</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>5.1. Contractors must maintain valid licenses as required by state law.</p>
                  <p>5.2. Contractors must maintain minimum $1M liability insurance.</p>
                  <p>5.3. Contractors acknowledge independent contractor status.</p>
                  <p>5.4. Quality of work is the sole responsibility of the contractor.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">6. Territory Operations</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>6.1. ONE license per Individual/LLC/Corporation.</p>
                  <p>6.2. Territory operators pay $0 ongoing fees.</p>
                  <p>6.3. Territories are non-refundable after claiming.</p>
                  <p>6.4. Operators must comply with all local regulations.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">7. Prohibited Conduct</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>7.1. Providing false or misleading information.</p>
                  <p>7.2. Circumventing the Platform's payment system.</p>
                  <p>7.3. Harassing other users or platform staff.</p>
                  <p>7.4. Using the Platform for illegal purposes.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">8. Dispute Resolution</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Any disputes arising from use of the Platform shall be resolved through binding 
                  arbitration in accordance with the rules of the American Arbitration Association.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">9. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  FairTradeWorker's liability is limited to the amount of fees paid by you in the 
                  12 months preceding the claim. We are not liable for any indirect, incidental, 
                  or consequential damages.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">10. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may modify these Terms at any time. Continued use of the Platform after 
                  changes constitutes acceptance of the modified Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">11. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms, contact us at legal@fairtradeworker.com.
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex gap-4 mt-6">
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Privacy Policy Component
// ============================================================================

export function PrivacyPolicy() {
  const lastUpdated = 'November 27, 2025';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-xl bg-secondary">
          <Shield className="w-8 h-8 text-white" weight="fill" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardContent className="p-8">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-8 text-sm">
              <section>
                <h2 className="text-xl font-bold mb-4">1. Information We Collect</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p><strong>Personal Information:</strong> Name, email, phone, address when you register.</p>
                  <p><strong>Payment Information:</strong> Credit card details (processed by Stripe).</p>
                  <p><strong>Usage Data:</strong> How you interact with our Platform.</p>
                  <p><strong>Device Information:</strong> Browser type, IP address, device identifiers.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">2. How We Use Your Information</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>• To provide and improve our services</p>
                  <p>• To process payments and transactions</p>
                  <p>• To communicate with you about your account</p>
                  <p>• To send marketing communications (with consent)</p>
                  <p>• To train and improve our AI systems</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">3. Information Sharing</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We share information with:</p>
                  <p>• Service providers who assist our operations</p>
                  <p>• Payment processors (Stripe)</p>
                  <p>• Law enforcement when legally required</p>
                  <p>• Other users as necessary for transactions</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures including encryption, 
                  secure socket layer (SSL) technology, and regular security audits to 
                  protect your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">5. Your Rights (GDPR/CCPA)</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>You have the right to:</p>
                  <p>• Access your personal data</p>
                  <p>• Request correction of inaccurate data</p>
                  <p>• Request deletion of your data</p>
                  <p>• Opt-out of marketing communications</p>
                  <p>• Export your data in a portable format</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">6. Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to improve your experience, 
                  analyze usage, and deliver personalized content. You can manage 
                  cookie preferences in your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">7. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your information for as long as your account is active or 
                  as needed to provide services. We may retain certain information for 
                  legal or business purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our Platform is not intended for children under 18. We do not 
                  knowingly collect information from children under 18.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">9. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For privacy-related inquiries: privacy@fairtradeworker.com
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// Cookie Consent Banner Component
// ============================================================================

interface CookieConsentProps {
  onAccept: (preferences: CookiePreferences) => void;
  onDecline: () => void;
}

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export function CookieConsentBanner({ onAccept, onDecline }: CookieConsentProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: true,
    marketing: false,
    personalization: true,
  });

  const handleAcceptAll = () => {
    onAccept({
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    });
  };

  const handleAcceptSelected = () => {
    onAccept(preferences);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Cookie className="w-6 h-6 text-primary" weight="fill" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold mb-1">Cookie Preferences</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies to enhance your experience, analyze traffic, and personalize content. 
              By clicking "Accept All", you consent to our use of cookies.
            </p>
            
            {showDetails && (
              <div className="space-y-3 mb-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Necessary</p>
                    <p className="text-xs text-muted-foreground">Required for the site to function</p>
                  </div>
                  <Badge variant="secondary">Always On</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analytics</p>
                    <p className="text-xs text-muted-foreground">Help us improve our services</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing</p>
                    <p className="text-xs text-muted-foreground">Personalized advertisements</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences(p => ({ ...p, marketing: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Personalization</p>
                    <p className="text-xs text-muted-foreground">Remember your preferences</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.personalization}
                    onChange={(e) => setPreferences(p => ({ ...p, personalization: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button onClick={handleAcceptAll}>Accept All</Button>
            <Button variant="outline" onClick={showDetails ? handleAcceptSelected : () => setShowDetails(true)}>
              {showDetails ? 'Accept Selected' : 'Customize'}
            </Button>
            <Button variant="ghost" size="sm" onClick={onDecline}>
              Decline
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Cookie Consent Hook
// ============================================================================

const COOKIE_CONSENT_KEY = 'ftw_cookie_consent';

export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setHasConsent(true);
      setPreferences(parsed);
    } else {
      setHasConsent(false);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setHasConsent(true);
    setPreferences(prefs);
  };

  const declineConsent = () => {
    const minimal: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(minimal));
    setHasConsent(true);
    setPreferences(minimal);
  };

  return {
    hasConsent,
    preferences,
    saveConsent,
    declineConsent,
  };
}

// ============================================================================
// Legal Pages Container
// ============================================================================

export function LegalPages() {
  return (
    <div className="min-h-screen bg-background py-8">
      <Tabs defaultValue="terms" className="max-w-5xl mx-auto px-4">
        <TabsList className="mb-8">
          <TabsTrigger value="terms" className="gap-2">
            <FileText className="w-4 h-4" />
            Terms of Service
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="w-4 h-4" />
            Privacy Policy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="terms">
          <TermsOfService />
        </TabsContent>
        
        <TabsContent value="privacy">
          <PrivacyPolicy />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LegalPages;
