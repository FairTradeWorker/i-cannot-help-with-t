import { useState } from 'react';
import { Certificate, ShieldCheck, Warning, CheckCircle, Upload, X } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { STATE_REQUIREMENTS, INSURANCE_MINIMUMS, validateLicenseForJobAmount, validateTradeLicense } from '@/lib/compliance';
import type { License, Insurance } from '@/lib/types';

interface ContractorVerificationProps {
  onVerificationComplete: (licenses: License[], insurance: Insurance) => void;
  existingLicenses?: License[];
  existingInsurance?: Insurance;
}

export function ContractorVerification({ 
  onVerificationComplete, 
  existingLicenses = [], 
  existingInsurance 
}: ContractorVerificationProps) {
  const [licenses, setLicenses] = useState<Partial<License>[]>(
    existingLicenses.length > 0 ? existingLicenses : [{}]
  );
  const [insurance, setInsurance] = useState<Partial<Insurance>>(
    existingInsurance || {
      provider: '',
      policyNumber: '',
      expiryDate: undefined,
      coverageAmount: INSURANCE_MINIMUMS.generalLiability,
      verified: false
    }
  );

  const addLicense = () => {
    setLicenses([...licenses, {}]);
  };

  const removeLicense = (index: number) => {
    setLicenses(licenses.filter((_, i) => i !== index));
  };

  const updateLicense = (index: number, field: keyof License, value: any) => {
    const updated = [...licenses];
    updated[index] = { ...updated[index], [field]: value };
    setLicenses(updated);
  };

  const updateInsurance = (field: keyof Insurance, value: any) => {
    setInsurance({ ...insurance, [field]: value });
  };

  const validateAndSubmit = () => {
    const issues: string[] = [];

    if (licenses.length === 0) {
      issues.push('At least one license is required');
    }

    licenses.forEach((license, idx) => {
      if (!license.type || !license.number || !license.state) {
        issues.push(`License ${idx + 1} is incomplete`);
      }
    });

    if (!insurance.provider || !insurance.policyNumber || !insurance.coverageAmount) {
      issues.push('Insurance information is incomplete');
    }

    if (insurance.coverageAmount && insurance.coverageAmount < INSURANCE_MINIMUMS.generalLiability) {
      issues.push(`General liability insurance must be at least $${INSURANCE_MINIMUMS.generalLiability.toLocaleString()}`);
    }

    if (issues.length > 0) {
      alert(issues.join('\n'));
      return;
    }

    onVerificationComplete(
      licenses as License[],
      insurance as Insurance
    );
  };

  const states = Object.keys(STATE_REQUIREMENTS);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Certificate className="w-8 h-8 text-primary" weight="duotone" />
          <div>
            <h2 className="text-2xl font-bold">Contractor Verification</h2>
            <p className="text-sm text-muted-foreground">
              Required for compliance with state licensing laws
            </p>
          </div>
        </div>

        <Alert className="border-warning/30 bg-warning/5 mb-6">
          <Warning className="w-5 h-5 text-warning" />
          <AlertTitle>Licensing Requirements</AlertTitle>
          <AlertDescription>
            Most states require contractor licenses for jobs over $500-$1,000. Trade-specific licenses (electrical, plumbing, HVAC) are required regardless of job size. We verify all licenses with state agencies.
          </AlertDescription>
        </Alert>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Professional Licenses</h3>
          <Button variant="outline" size="sm" onClick={addLicense}>
            <Certificate className="w-4 h-4 mr-2" />
            Add License
          </Button>
        </div>

        <div className="space-y-6">
          {licenses.map((license, index) => (
            <Card key={index} className="p-4 border-border/50">
              <div className="flex items-start justify-between mb-4">
                <Badge variant="outline">License {index + 1}</Badge>
                {licenses.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLicense(index)}
                    className="h-auto p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`license-type-${index}`}>License Type *</Label>
                  <Select
                    value={license.type}
                    onValueChange={(value) => updateLicense(index, 'type', value)}
                  >
                    <SelectTrigger id={`license-type-${index}`}>
                      <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general_contractor">General Contractor</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="roofing">Roofing</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="flooring">Flooring</SelectItem>
                      <SelectItem value="landscaping">Landscaping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`license-state-${index}`}>State *</Label>
                  <Select
                    value={license.state}
                    onValueChange={(value) => updateLicense(index, 'state', value)}
                  >
                    <SelectTrigger id={`license-state-${index}`}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>
                          {STATE_REQUIREMENTS[state].state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`license-number-${index}`}>License Number *</Label>
                  <Input
                    id={`license-number-${index}`}
                    value={license.number || ''}
                    onChange={(e) => updateLicense(index, 'number', e.target.value)}
                    placeholder="e.g., 12345678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`license-expiry-${index}`}>Expiration Date *</Label>
                  <Input
                    id={`license-expiry-${index}`}
                    type="date"
                    value={license.expiryDate ? new Date(license.expiryDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => updateLicense(index, 'expiryDate', new Date(e.target.value))}
                  />
                </div>
              </div>

              {license.state && license.type && (
                <Alert className="mt-4 border-primary/30 bg-primary/5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <AlertDescription className="text-sm">
                    {STATE_REQUIREMENTS[license.state]?.state || 'State'} requirements:{' '}
                    {validateTradeLicense(license.type, license.state).required 
                      ? 'License required for this trade'
                      : 'No specific requirements for this trade'
                    }
                  </AlertDescription>
                </Alert>
              )}
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-6 h-6 text-accent" weight="duotone" />
          <h3 className="text-lg font-semibold">General Liability Insurance</h3>
        </div>

        <Alert className="mb-6 border-warning/30 bg-warning/5">
          <Warning className="w-5 h-5 text-warning" />
          <AlertDescription>
            Minimum required coverage: ${INSURANCE_MINIMUMS.generalLiability.toLocaleString()}. 
            We verify insurance certificates with providers.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insurance-provider">Insurance Provider *</Label>
            <Input
              id="insurance-provider"
              value={insurance.provider || ''}
              onChange={(e) => updateInsurance('provider', e.target.value)}
              placeholder="e.g., State Farm, Allstate"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurance-policy">Policy Number *</Label>
            <Input
              id="insurance-policy"
              value={insurance.policyNumber || ''}
              onChange={(e) => updateInsurance('policyNumber', e.target.value)}
              placeholder="e.g., POL-123456789"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurance-coverage">Coverage Amount *</Label>
            <Input
              id="insurance-coverage"
              type="number"
              value={insurance.coverageAmount || ''}
              onChange={(e) => updateInsurance('coverageAmount', parseInt(e.target.value))}
              placeholder="e.g., 1000000"
            />
            <p className="text-xs text-muted-foreground">
              Minimum: ${INSURANCE_MINIMUMS.generalLiability.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurance-expiry">Expiration Date *</Label>
            <Input
              id="insurance-expiry"
              type="date"
              value={insurance.expiryDate ? new Date(insurance.expiryDate).toISOString().split('T')[0] : ''}
              onChange={(e) => updateInsurance('expiryDate', new Date(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-6 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
          <div className="text-center">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Upload Insurance Certificate</p>
            <p className="text-xs text-muted-foreground">PDF or image up to 10MB</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-primary/30 bg-primary/5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" weight="duotone" />
          <div>
            <h4 className="font-semibold mb-2">Verification Process</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Licenses verified with state agencies (2-5 business days)</li>
              <li>• Insurance certificates verified with providers (1-3 business days)</li>
              <li>• You'll receive notifications when verification is complete</li>
              <li>• You can start bidding immediately; some jobs may require verified status</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" size="lg">
          Save Draft
        </Button>
        <Button size="lg" onClick={validateAndSubmit}>
          <CheckCircle className="w-5 h-5 mr-2" weight="fill" />
          Submit for Verification
        </Button>
      </div>
    </div>
  );
}
