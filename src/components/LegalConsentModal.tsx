import { useState } from 'react';
import { CheckCircle, Warning, ShieldCheck, Certificate, FileText } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LegalConsentModalProps {
  userType: 'contractor' | 'homeowner' | 'territory_owner';
  onAccept: (consents: LegalConsents) => void;
  onDecline: () => void;
}

interface LegalConsents {
  termsOfService: boolean;
  privacyPolicy: boolean;
  contractorAgreement?: boolean;
  independentContractorStatus?: boolean;
  territoryOwnerAgreement?: boolean;
  territoryRiskDisclosure?: boolean;
  dataProcessing: boolean;
  tcpaConsent: boolean;
  disputeResolution: boolean;
}

export function LegalConsentModal({ userType, onAccept, onDecline }: LegalConsentModalProps) {
  const [consents, setConsents] = useState<LegalConsents>({
    termsOfService: false,
    privacyPolicy: false,
    contractorAgreement: userType === 'contractor' ? false : undefined,
    independentContractorStatus: userType === 'contractor' ? false : undefined,
    territoryOwnerAgreement: userType === 'territory_owner' ? false : undefined,
    territoryRiskDisclosure: userType === 'territory_owner' ? false : undefined,
    dataProcessing: false,
    tcpaConsent: false,
    disputeResolution: false
  });

  const updateConsent = (key: keyof LegalConsents, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }));
  };

  const allRequiredAccepted = () => {
    if (userType === 'contractor') {
      return consents.termsOfService && 
             consents.privacyPolicy && 
             consents.contractorAgreement && 
             consents.independentContractorStatus &&
             consents.dataProcessing && 
             consents.tcpaConsent &&
             consents.disputeResolution;
    }
    
    if (userType === 'territory_owner') {
      return consents.termsOfService && 
             consents.privacyPolicy && 
             consents.territoryOwnerAgreement && 
             consents.territoryRiskDisclosure &&
             consents.dataProcessing && 
             consents.tcpaConsent &&
             consents.disputeResolution;
    }

    return consents.termsOfService && 
           consents.privacyPolicy && 
           consents.dataProcessing && 
           consents.tcpaConsent &&
           consents.disputeResolution;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-primary" weight="duotone" />
            <h2 className="text-2xl font-bold">Legal Agreements & Disclosures</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Please review and accept the following agreements to continue
          </p>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <Alert className="border-primary/30 bg-primary/5">
              <FileText className="w-5 h-5 text-primary" />
              <AlertTitle>Important Legal Information</AlertTitle>
              <AlertDescription>
                These agreements establish your legal relationship with the platform. Please read them carefully.
                You can access these documents at any time from your account settings.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <Checkbox 
                  id="terms" 
                  checked={consents.termsOfService}
                  onCheckedChange={(checked) => updateConsent('termsOfService', checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="terms" className="text-base font-semibold cursor-pointer">
                    Terms of Service
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    General platform usage terms, account responsibilities, and service limitations.
                  </p>
                  <Button variant="link" className="h-auto p-0 mt-2 text-primary" size="sm">
                    Read Full Document →
                  </Button>
                </div>
                <Badge variant="outline" className="bg-destructive/10 border-destructive/30 text-destructive">
                  Required
                </Badge>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <Checkbox 
                  id="privacy" 
                  checked={consents.privacyPolicy}
                  onCheckedChange={(checked) => updateConsent('privacyPolicy', checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="privacy" className="text-base font-semibold cursor-pointer">
                    Privacy Policy
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    How we collect, use, store, and protect your personal data. GDPR & CCPA compliant.
                  </p>
                  <Button variant="link" className="h-auto p-0 mt-2 text-primary" size="sm">
                    Read Full Document →
                  </Button>
                </div>
                <Badge variant="outline" className="bg-destructive/10 border-destructive/30 text-destructive">
                  Required
                </Badge>
              </div>

              {userType === 'contractor' && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <Checkbox 
                      id="contractor-agreement" 
                      checked={consents.contractorAgreement}
                      onCheckedChange={(checked) => updateConsent('contractorAgreement', checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="contractor-agreement" className="text-base font-semibold cursor-pointer">
                        Contractor Service Agreement
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Payment terms, service expectations, quality standards, and dispute resolution procedures.
                      </p>
                      <Button variant="link" className="h-auto p-0 mt-2 text-primary" size="sm">
                        Read Full Document →
                      </Button>
                    </div>
                    <Badge variant="outline" className="bg-destructive/10 border-destructive/30 text-destructive">
                      Required
                    </Badge>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-warning/30 bg-warning/5">
                    <Checkbox 
                      id="independent-contractor" 
                      checked={consents.independentContractorStatus}
                      onCheckedChange={(checked) => updateConsent('independentContractorStatus', checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="independent-contractor" className="text-base font-semibold cursor-pointer">
                        Independent Contractor Status
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        I acknowledge that I am an independent contractor (1099), not an employee (W-2). I control my pricing, schedule, and methods. I can work for competitors and am responsible for my own taxes, insurance, and licenses.
                      </p>
                      <Alert className="mt-3 border-warning/30">
                        <Warning className="w-4 h-4 text-warning" />
                        <AlertDescription className="text-sm">
                          <strong>Important:</strong> This classification affects your tax obligations, benefits eligibility, and legal protections. Consult a tax professional if you have questions.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <Badge variant="outline" className="bg-destructive/10 border-destructive/30 text-destructive">
                      Required
                    </Badge>
                  </div>
                </>
              )}

              {userType === 'territory_owner' && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <Checkbox 
                      id="territory-agreement" 
                      checked={consents.territoryOwnerAgreement}
                      onCheckedChange={(checked) => updateConsent('territoryOwnerAgreement', checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="territory-agreement" className="text-base font-semibold cursor-pointer">
                        Territory Owner Agreement
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Territory boundaries, revenue sharing terms, active participation requirements, and transfer restrictions.
                      </p>
                      <Button variant="link" className="h-auto p-0 mt-2 text-primary" size="sm">
                        Read Full Document →
                      </Button>
                    </div>
                    <Badge variant="outline" className="bg-destructive/10 border-destructive/30 text-destructive">
                      Required
                    </Badge>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-warning/30 bg-warning/5">
                    <Checkbox 
                      id="territory-risk" 
                      checked={consents.territoryRiskDisclosure}
                      onCheckedChange={(checked) => updateConsent('territoryRiskDisclosure', checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="territory-risk" className="text-base font-semibold cursor-pointer">
                        Risk Disclosure & No Guaranteed Returns
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        I understand that territory ownership involves financial risk. Returns are NOT guaranteed and depend on my active participation in recruiting contractors, vetting quality, and managing the territory. Past performance does not indicate future results.
                      </p>
                      <Alert className="mt-3 border-warning/30">
                        <Warning className="w-4 h-4 text-warning" />
                        <AlertDescription className="text-sm">
                          <strong>Investment Risk:</strong> You may lose your entire investment. This is not a passive investment or security. Active participation is required to generate returns.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <Badge variant="outline" className="bg-destructive/10 border-destructive/30 text-destructive">
                      Required
                    </Badge>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <Checkbox 
                  id="data-processing" 
                  checked={consents.dataProcessing}
                  onCheckedChange={(checked) => updateConsent('dataProcessing', checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="data-processing" className="text-base font-semibold cursor-pointer">
                    Data Processing Consent
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    I consent to the processing of my personal data for account management, service delivery, and platform improvements. You have the right to access, modify, or delete your data at any time.
                  </p>
                </div>
                <Badge variant="outline" className="bg-destructive/10 border-destructive/30 text-destructive">
                  Required
                </Badge>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <Checkbox 
                  id="tcpa" 
                  checked={consents.tcpaConsent}
                  onCheckedChange={(checked) => updateConsent('tcpaConsent', checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="tcpa" className="text-base font-semibold cursor-pointer">
                    Communication Consent (TCPA)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    I consent to receive transactional messages (job updates, payments, notifications) via SMS, email, and in-app notifications. You can opt out of marketing messages at any time.
                  </p>
                </div>
                <Badge variant="outline" className="bg-destructive/10 border-destructive/30 text-destructive">
                  Required
                </Badge>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <Checkbox 
                  id="dispute" 
                  checked={consents.disputeResolution}
                  onCheckedChange={(checked) => updateConsent('disputeResolution', checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="dispute" className="text-base font-semibold cursor-pointer">
                    Dispute Resolution & Arbitration
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Disputes will be resolved through binding arbitration. You waive the right to participate in class action lawsuits.
                  </p>
                </div>
                <Badge variant="outline" className="bg-destructive/10 border-destructive/30 text-destructive">
                  Required
                </Badge>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={onDecline} size="lg">
              Decline & Exit
            </Button>
            <Button 
              onClick={() => onAccept(consents)} 
              disabled={!allRequiredAccepted()}
              size="lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" weight="fill" />
              Accept All & Continue
            </Button>
          </div>
          {!allRequiredAccepted() && (
            <p className="text-sm text-muted-foreground text-center mt-3">
              Please accept all required agreements to continue
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
