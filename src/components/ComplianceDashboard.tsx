import { CheckCircle, Warning, ShieldCheck, Certificate, FileText, Scales, Info } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { evaluateContractorClassification } from '@/lib/compliance';
import type { User } from '@/lib/types';

interface ComplianceDashboardProps {
  user: User;
}

export function ComplianceDashboard({ user }: ComplianceDashboardProps) {
  const classification = evaluateContractorClassification(user.contractorProfile);
  const isContractor = user.role === 'contractor';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Scales className="w-8 h-8 text-primary" weight="duotone" />
        <div>
          <h2 className="text-2xl font-bold">Compliance Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Legal status, verification, and regulatory compliance
          </p>
        </div>
      </div>

      {isContractor && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-accent" weight="duotone" />
              <h3 className="text-lg font-semibold">Independent Contractor Status</h3>
            </div>
            <Badge 
              variant="outline" 
              className={classification.classificationScore >= 0.8 ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-warning/10 border-warning/30 text-warning'}
            >
              {classification.isPlatformEmployer ? 'Employee Risk' : 'Independent Contractor'}
            </Badge>
          </div>

          <Alert className={classification.classificationScore >= 0.8 ? 'border-accent/30 bg-accent/5 mb-4' : 'border-warning/30 bg-warning/5 mb-4'}>
            <Info className="w-5 h-5" />
            <AlertTitle>Classification Score: {(classification.classificationScore * 100).toFixed(0)}%</AlertTitle>
            <AlertDescription>
              {classification.classificationScore >= 0.8 
                ? 'Your account meets all independent contractor criteria. You are properly classified as 1099.'
                : 'Some criteria are not met. This could indicate employee misclassification risk.'
              }
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Compliance</span>
                <span className="text-sm text-muted-foreground">{(classification.classificationScore * 100).toFixed(0)}%</span>
              </div>
              <Progress value={classification.classificationScore * 100} className="h-2" />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ComplianceItem
                label="Set Own Prices"
                status={classification.canSetOwnPrices}
                description="You control your pricing and bid amounts"
              />
              <ComplianceItem
                label="Set Own Schedule"
                status={classification.canSetOwnSchedule}
                description="You choose when and how much to work"
              />
              <ComplianceItem
                label="Work for Competitors"
                status={classification.canWorkForCompetitors}
                description="You can work on other platforms"
              />
              <ComplianceItem
                label="No Mandatory Training"
                status={!classification.requiresMandatoryTraining}
                description="Platform doesn't require training"
              />
              <ComplianceItem
                label="No Required Uniform"
                status={!classification.requiresUniform}
                description="You choose your work attire"
              />
              <ComplianceItem
                label="No Direct Supervision"
                status={!classification.hasPlatformSupervision}
                description="Platform doesn't supervise your work methods"
              />
            </div>
          </div>

          <Alert className="mt-6 border-primary/30 bg-primary/5">
            <FileText className="w-5 h-5 text-primary" />
            <AlertDescription>
              <strong>Tax Responsibilities:</strong> As an independent contractor, you're responsible for:
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Filing quarterly estimated taxes (1099-MISC form)</li>
                <li>• Self-employment tax (Social Security & Medicare)</li>
                <li>• Your own health insurance and retirement</li>
                <li>• Business licenses and permits</li>
              </ul>
            </AlertDescription>
          </Alert>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Certificate className="w-6 h-6 text-primary" weight="duotone" />
          <h3 className="text-lg font-semibold">Verification Status</h3>
        </div>

        <div className="space-y-4">
          {isContractor && user.contractorProfile && (
            <>
              <VerificationItem
                icon={<Certificate className="w-5 h-5" />}
                label="Professional Licenses"
                status={user.contractorProfile.licenses?.length > 0}
                verified={user.contractorProfile.licenses?.some(l => l.verified)}
                detail={`${user.contractorProfile.licenses?.length || 0} license(s) on file`}
              />
              <VerificationItem
                icon={<ShieldCheck className="w-5 h-5" />}
                label="General Liability Insurance"
                status={!!user.contractorProfile.insurance}
                verified={user.contractorProfile.insurance?.verified}
                detail={user.contractorProfile.insurance 
                  ? `$${(user.contractorProfile.insurance.coverageAmount / 1_000_000).toFixed(1)}M coverage`
                  : 'Not provided'
                }
              />
              <VerificationItem
                icon={<CheckCircle className="w-5 h-5" />}
                label="Identity Verification"
                status={user.contractorProfile.verified}
                verified={user.contractorProfile.verified}
                detail="Government-issued ID"
              />
            </>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-primary" weight="duotone" />
          <h3 className="text-lg font-semibold">Legal Documents</h3>
        </div>

        <div className="space-y-3">
          <DocumentItem
            title="Terms of Service"
            status="Accepted"
            date={user.createdAt}
          />
          <DocumentItem
            title="Privacy Policy"
            status="Accepted"
            date={user.createdAt}
          />
          {isContractor && (
            <>
              <DocumentItem
                title="Contractor Service Agreement"
                status="Accepted"
                date={user.createdAt}
              />
              <DocumentItem
                title="Independent Contractor Acknowledgment"
                status="Accepted"
                date={user.createdAt}
              />
            </>
          )}
        </div>
      </Card>

      <Card className="p-6 border-warning/30 bg-warning/5">
        <div className="flex items-start gap-3">
          <Warning className="w-6 h-6 text-warning flex-shrink-0 mt-1" weight="duotone" />
          <div>
            <h4 className="font-semibold mb-2">Important Legal Information</h4>
            <p className="text-sm text-muted-foreground mb-3">
              This platform facilitates connections between contractors and homeowners. We do not:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Employ contractors (you are independent)</li>
              <li>• Supervise work methods or require specific tools</li>
              <li>• Guarantee income or job availability</li>
              <li>• Provide benefits, insurance, or tax withholding</li>
              <li>• Act as a licensed contractor in your state</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Consult a legal or tax professional if you have questions about your classification or obligations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ComplianceItem({ label, status, description }: { label: string; status: boolean; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
        status ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'
      }`}>
        {status ? (
          <CheckCircle className="w-4 h-4" weight="fill" />
        ) : (
          <Warning className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function VerificationItem({ 
  icon, 
  label, 
  status, 
  verified, 
  detail 
}: { 
  icon: React.ReactNode; 
  label: string; 
  status: boolean; 
  verified?: boolean; 
  detail: string; 
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{detail}</p>
        </div>
      </div>
      <Badge 
        variant="outline" 
        className={
          verified 
            ? 'bg-accent/10 border-accent/30 text-accent' 
            : status 
            ? 'bg-warning/10 border-warning/30 text-warning'
            : 'bg-muted border-border text-muted-foreground'
        }
      >
        {verified ? 'Verified' : status ? 'Pending' : 'Not Started'}
      </Badge>
    </div>
  );
}

function DocumentItem({ title, status, date }: { title: string; status: string; date: Date }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-3">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">
            {status} on {new Date(date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent">
        <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
        {status}
      </Badge>
    </div>
  );
}
