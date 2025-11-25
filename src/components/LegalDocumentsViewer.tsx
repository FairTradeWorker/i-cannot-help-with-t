import { FileText, Download } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function LegalDocumentsViewer() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" weight="duotone" />
          <div>
            <h1 className="text-3xl font-bold">Legal Documents</h1>
            <p className="text-sm text-muted-foreground">Platform terms, policies, and agreements</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download All (PDF)
        </Button>
      </div>

      <Tabs defaultValue="terms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="contractor">Contractor</TabsTrigger>
          <TabsTrigger value="homeowner">Homeowner</TabsTrigger>
          <TabsTrigger value="territory">Territory</TabsTrigger>
          <TabsTrigger value="dispute">Dispute</TabsTrigger>
        </TabsList>

        <TabsContent value="terms">
          <LegalDocument
            title="Terms of Service"
            lastUpdated="January 15, 2024"
            content={TERMS_OF_SERVICE}
          />
        </TabsContent>

        <TabsContent value="privacy">
          <LegalDocument
            title="Privacy Policy"
            lastUpdated="January 15, 2024"
            content={PRIVACY_POLICY}
          />
        </TabsContent>

        <TabsContent value="contractor">
          <LegalDocument
            title="Contractor Service Agreement"
            lastUpdated="January 15, 2024"
            content={CONTRACTOR_AGREEMENT}
          />
        </TabsContent>

        <TabsContent value="homeowner">
          <LegalDocument
            title="Homeowner Service Agreement"
            lastUpdated="January 15, 2024"
            content={HOMEOWNER_AGREEMENT}
          />
        </TabsContent>

        <TabsContent value="territory">
          <LegalDocument
            title="Territory Owner Agreement"
            lastUpdated="January 15, 2024"
            content={TERRITORY_AGREEMENT}
          />
        </TabsContent>

        <TabsContent value="dispute">
          <LegalDocument
            title="Dispute Resolution & Arbitration"
            lastUpdated="January 15, 2024"
            content={DISPUTE_RESOLUTION}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LegalDocument({ title, lastUpdated, content }: { title: string; lastUpdated: string; content: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Last Updated: {lastUpdated}</p>
      <Separator className="mb-6" />
      <ScrollArea className="h-[600px] pr-4">
        <div className="prose prose-sm max-w-none space-y-4 text-sm">
          {content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

const TERMS_OF_SERVICE = `TERMS OF SERVICE

1. ACCEPTANCE OF TERMS
By accessing or using this platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.

2. SERVICE DESCRIPTION
This platform connects homeowners with independent contractors for home improvement services. We are a marketplace facilitator only and do not perform contracting work.

3. USER ACCOUNTS
You must provide accurate information and maintain the security of your account. You are responsible for all activities under your account.

4. INDEPENDENT CONTRACTOR RELATIONSHIP
Contractors are independent businesses, not employees of the platform. The platform does not:
• Supervise work methods or require specific tools
• Control contractor schedules or pricing
• Guarantee income or job availability
• Provide employee benefits, insurance, or tax withholding
• Require mandatory training or uniforms

5. LICENSING AND INSURANCE
Contractors must maintain appropriate licenses and insurance as required by state law. The platform verifies credentials but users should independently verify qualifications.

6. PAYMENTS AND FEES
• Payments are processed by licensed third-party processors
• Platform fees are disclosed before transactions
• Contractors are responsible for their own taxes
• Escrow services protect both parties

7. PROHIBITED CONDUCT
Users may not:
• Provide false information
• Circumvent the platform to avoid fees
• Engage in fraud or harassment
• Violate any laws or regulations

8. DISPUTE RESOLUTION
Disputes between users are resolved through the platform's dispute resolution process. Disputes with the platform are subject to binding arbitration.

9. LIMITATION OF LIABILITY
The platform is not liable for:
• Quality of contractor work
• Injuries or property damage
• Disputes between users
• Failure of third-party services

10. MODIFICATIONS
We may modify these Terms at any time. Continued use constitutes acceptance of modified Terms.

11. TERMINATION
We may suspend or terminate accounts for Terms violations at our discretion.

12. GOVERNING LAW
These Terms are governed by the laws of [State], excluding conflict of law provisions.`;

const PRIVACY_POLICY = `PRIVACY POLICY

1. INFORMATION WE COLLECT
We collect information you provide directly:
• Account information (name, email, phone)
• Profile information (skills, licenses, insurance)
• Job information (project details, photos, videos)
• Payment information (processed by third parties)
• Communications between users

We automatically collect:
• Device information and IP addresses
• Usage data and analytics
• Location data (with permission)
• Cookies and tracking technologies

2. HOW WE USE YOUR INFORMATION
• Provide and improve the Service
• Match contractors with homeowners
• Process payments and transactions
• Communicate about jobs and updates
• Verify licenses and credentials
• Comply with legal obligations
• Prevent fraud and abuse

3. INFORMATION SHARING
We share information with:
• Other users (as necessary for transactions)
• Service providers (payment processors, cloud hosting)
• Legal authorities (when required by law)
• Business transfers (in case of merger or acquisition)

We do not sell your personal information.

4. DATA SECURITY
We use industry-standard security measures including:
• Encryption of sensitive data
• Secure payment processing
• Regular security audits
• Access controls and authentication

5. YOUR RIGHTS (GDPR/CCPA)
You have the right to:
• Access your personal data
• Correct inaccurate data
• Delete your data (with exceptions)
• Opt out of marketing communications
• Port your data to another service

To exercise these rights, contact privacy@platform.com

6. COOKIES AND TRACKING
We use cookies for:
• Authentication and security
• Preferences and settings
• Analytics and performance
• Advertising (with consent)

You can control cookies in your browser settings.

7. DATA RETENTION
We retain data as long as your account is active or as needed for legal purposes. You can request deletion at any time.

8. CHILDREN'S PRIVACY
The Service is not intended for users under 18. We do not knowingly collect data from minors.

9. INTERNATIONAL TRANSFERS
Data may be transferred to and processed in countries outside your residence. We ensure adequate protections through standard contractual clauses.

10. CHANGES TO THIS POLICY
We may update this Privacy Policy periodically. We will notify you of material changes.

Contact: privacy@platform.com`;

const CONTRACTOR_AGREEMENT = `CONTRACTOR SERVICE AGREEMENT

1. INDEPENDENT CONTRACTOR STATUS
You acknowledge and agree that:
• You are an independent contractor, not an employee
• You will receive IRS Form 1099-MISC for tax purposes
• You are responsible for all federal, state, and local taxes
• You control your pricing, schedule, and work methods
• You can work for competing platforms and customers
• You provide your own tools, equipment, and insurance
• The platform does not supervise your work methods
• You are not entitled to employee benefits

2. CLASSIFICATION FACTORS
To maintain independent contractor status:
• You set your own prices and bid amounts
• You choose which jobs to accept or decline
• You determine your work schedule and hours
• You use your own methods and expertise
• You are free to work for competitors
• No mandatory training or certifications (beyond legal requirements)
• No required uniforms or branded materials
• No direct supervision of work performance

3. LICENSING AND CREDENTIALS
You represent and warrant that:
• You hold all required licenses for services offered
• Your licenses are current and valid
• You carry appropriate insurance (minimum $1M general liability)
• You comply with all applicable regulations
• You will immediately notify us of any license suspension or revocation

4. PAYMENT TERMS
• Payment is released upon job completion and approval
• Platform may charge service fees (disclosed in advance)
• Instant payouts available for 1.5% fee
• Standard payouts processed within 2-5 business days
• You are responsible for tax withholding and reporting

5. QUALITY AND PERFORMANCE
• You agree to perform services professionally
• You will communicate promptly with homeowners
• You will complete work according to agreed timeline
• You will address defects or issues promptly
• Poor performance may result in account suspension

6. LIABILITY AND INSURANCE
• You maintain adequate insurance coverage
• You are responsible for injuries or property damage
• The platform is not liable for your work
• You agree to indemnify the platform against claims

7. DISPUTE RESOLUTION
• Disputes with homeowners handled through platform process
• Disputes with platform subject to binding arbitration
• You waive participation in class action lawsuits

8. TERMINATION
Either party may terminate this agreement at any time. Outstanding obligations survive termination.`;

const HOMEOWNER_AGREEMENT = `HOMEOWNER SERVICE AGREEMENT

1. SERVICE DESCRIPTION
This platform connects you with independent contractors for home improvement services. We facilitate connections but do not perform contracting work.

2. CONTRACTOR SELECTION
• Contractors are independent businesses
• We verify licenses and insurance but recommend independent verification
• You are responsible for selecting contractors
• Review contractor profiles, ratings, and qualifications carefully

3. JOB POSTING AND BIDDING
• Provide accurate project descriptions
• AI estimates are approximations, not guarantees
• Review all bids carefully before accepting
• Once accepted, bid becomes a binding agreement

4. PAYMENT AND ESCROW
• Funds are held in escrow until job completion
• Payment released upon your approval
• Disputes handled through platform process
• Platform charges may apply

5. PROJECT MANAGEMENT
• Communicate clearly with contractors
• Respond to messages and requests promptly
• Inspect work before final approval
• Report issues immediately

6. PERMITS AND COMPLIANCE
• Verify permit requirements with local authorities
• Ensure contractor obtains necessary permits
• You may be responsible for permit violations

7. WARRANTIES AND GUARANTEES
• The platform provides no warranties on contractor work
• Contractors may offer individual warranties
• Workmanship issues are between you and contractor
• Platform facilitates dispute resolution

8. LIABILITY
• Contractors are responsible for injuries or damage
• Platform is not liable for contractor work
• Verify contractor insurance coverage
• Consider additional homeowner's insurance

9. RATINGS AND REVIEWS
• Provide honest, accurate reviews
• Reviews must not be defamatory or false
• Reviews help maintain platform quality

10. DISPUTE RESOLUTION
• Use platform process for disputes with contractors
• Disputes with platform subject to binding arbitration
• You waive class action participation`;

const TERRITORY_AGREEMENT = `TERRITORY OWNER AGREEMENT

1. TERRITORY OWNERSHIP MODEL
This agreement grants you exclusive rights to recruit and manage contractors in a defined geographic territory.

2. ACTIVE PARTICIPATION REQUIRED
This is NOT a passive investment. You must:
• Actively recruit qualified contractors
• Vet contractor credentials and quality
• Manage territory performance and reputation
• Respond to platform communications
• Participate in territory management activities

Failure to actively participate may result in territory forfeiture.

3. NO GUARANTEED RETURNS
You acknowledge that:
• Returns are NOT guaranteed
• Income depends entirely on territory performance
• You may lose your entire investment
• Past performance does not indicate future results
• This is a business opportunity, not a security

4. REVENUE SHARING
• You receive [X]% of platform fees from territory contractors
• Revenue calculated monthly and paid within 30 days
• Platform reserves the right to adjust fee structure with notice
• Taxes are your responsibility

5. TERRITORY BOUNDARIES
• Territory defined by zip codes listed in Exhibit A
• Boundaries may be adjusted based on performance
• No territorial overlap between owners

6. CONTRACTOR RECRUITMENT
• You are responsible for finding contractors
• All contractors must meet platform standards
• Platform retains final approval rights
• You may not misrepresent earnings potential

7. QUALITY STANDARDS
• Maintain minimum contractor ratings
• Address quality issues promptly
• Poor performance may result in territory reduction or removal

8. INVESTMENT RISK
You acknowledge understanding of:
• Financial risk and potential total loss
• No guaranteed income or returns
• Dependence on your active efforts
• Market conditions beyond your control
• Platform business risk

9. NOT A SECURITY
This agreement is structured to avoid securities classification:
• Active participation is mandatory
• Returns depend on your efforts, not platform's
• No passive investment characteristics
• You control key territory decisions

10. TRANSFER RESTRICTIONS
• Territory rights may not be transferred without approval
• No sublicensing or delegation of responsibilities
• Platform has right of first refusal on any sale

11. TERMINATION
Platform may terminate for:
• Failure to actively participate
• Quality standards violations
• Terms violations
• Material breach of agreement`;

const DISPUTE_RESOLUTION = `DISPUTE RESOLUTION AND ARBITRATION

1. INFORMAL RESOLUTION
Before formal proceedings, parties agree to:
• Attempt good faith negotiation
• Use platform's dispute resolution process
• Provide 30 days for informal resolution

2. BINDING ARBITRATION
Any disputes not resolved informally will be resolved through binding arbitration:
• Administered by American Arbitration Association (AAA)
• Governed by AAA Commercial Arbitration Rules
• One arbitrator selected per AAA procedures
• Arbitration conducted in [City, State]
• Decision is final and binding

3. CLASS ACTION WAIVER
You agree to:
• Resolve disputes individually, not as class actions
• Waive participation in class, consolidated, or representative proceedings
• This waiver is enforceable even if arbitration provision is found unenforceable

4. EXCEPTIONS TO ARBITRATION
Either party may seek relief in small claims court for disputes within jurisdiction.

5. ARBITRATION COSTS
• Each party pays their own attorneys' fees
• Arbitration fees split per AAA rules
• Prevailing party may recover costs at arbitrator's discretion

6. GOVERNING LAW
Disputes governed by laws of [State], excluding conflict of laws provisions.

7. DISPUTE CATEGORIES

Contractor-Homeowner Disputes:
• Quality of work issues
• Payment disputes
• Timeline disagreements
• Communication problems

User-Platform Disputes:
• Account suspension or termination
• Payment processing issues
• Fee disputes
• Terms interpretation

8. PLATFORM MEDIATION PROCESS
Before arbitration, platform offers mediation:
• Neutral platform mediator reviews dispute
• Both parties submit evidence
• Non-binding recommendation issued
• Parties may accept or proceed to arbitration

9. EMERGENCY RELIEF
Platform may seek emergency court relief for:
• Intellectual property infringement
• Fraud or safety issues
• Irreparable harm situations

10. ENFORCEMENT
Arbitration awards may be entered as judgment in any court of competent jurisdiction.`;
