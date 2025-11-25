import { FileText, ShieldCheck, Scales } from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';

export function LegalFooter() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/legal/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/legal/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/legal/cookie-policy" className="hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="/legal/dispute-resolution" className="hover:text-primary transition-colors">
                  Dispute Resolution
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Agreements
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/legal/contractor-agreement" className="hover:text-primary transition-colors">
                  Contractor Agreement
                </a>
              </li>
              <li>
                <a href="/legal/homeowner-agreement" className="hover:text-primary transition-colors">
                  Homeowner Agreement
                </a>
              </li>
              <li>
                <a href="/legal/territory-owner-agreement" className="hover:text-primary transition-colors">
                  Territory Owner Agreement
                </a>
              </li>
              <li>
                <a href="/legal/insurance-requirements" className="hover:text-primary transition-colors">
                  Insurance Requirements
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Scales className="w-4 h-4" />
              Compliance
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/compliance/independent-contractor" className="hover:text-primary transition-colors">
                  Independent Contractor Status
                </a>
              </li>
              <li>
                <a href="/compliance/licensing" className="hover:text-primary transition-colors">
                  Licensing Requirements
                </a>
              </li>
              <li>
                <a href="/compliance/data-privacy" className="hover:text-primary transition-colors">
                  Data Privacy (GDPR/CCPA)
                </a>
              </li>
              <li>
                <a href="/compliance/state-requirements" className="hover:text-primary transition-colors">
                  State-Specific Requirements
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="space-y-4 text-xs text-muted-foreground">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <p>© 2024 Home Services Platform. All rights reserved.</p>
            <Separator orientation="vertical" className="hidden md:block h-4" />
            <div className="flex flex-wrap gap-4">
              <a href="/legal/ccpa" className="hover:text-primary transition-colors">
                Your Privacy Rights (CCPA)
              </a>
              <a href="/legal/gdpr" className="hover:text-primary transition-colors">
                EU Data Rights (GDPR)
              </a>
              <a href="/legal/accessibility" className="hover:text-primary transition-colors">
                Accessibility
              </a>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="font-semibold mb-2">Important Disclosures:</p>
            <ul className="space-y-1">
              <li>
                • <strong>Independent Contractors:</strong> Contractors on this platform are independent businesses, not employees. 
                The platform does not supervise work methods, require specific tools, or guarantee income.
              </li>
              <li>
                • <strong>Not a Licensed Contractor:</strong> This platform facilitates connections but does not perform contracting work. 
                Verify contractor licenses with your state agency.
              </li>
              <li>
                • <strong>Territory Ownership:</strong> Territory investments involve risk. Returns are not guaranteed and depend on active participation. 
                This is not a passive investment or security.
              </li>
              <li>
                • <strong>AI Estimates:</strong> Automated scope and cost estimates are approximations based on video analysis. 
                Final pricing may vary. Always obtain written quotes.
              </li>
              <li>
                • <strong>Payment Processing:</strong> Payments are processed by licensed third-party payment processors. 
                The platform does not hold funds directly.
              </li>
            </ul>
          </div>

          <p className="text-center pt-4">
            Questions about compliance or legal terms? Contact legal@platform.com
          </p>
        </div>
      </div>
    </footer>
  );
}
