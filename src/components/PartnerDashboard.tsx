import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Handshake,
  CurrencyDollar,
  TrendUp,
  Users,
  Briefcase,
  ChartLine,
  Bank,
  Percent,
  Package,
  Shield,
  Buildings,
  Envelope,
  Phone,
  CheckCircle,
  Calendar,
  ArrowRight,
  Brain,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useState } from 'react';
import { AILearningDashboard } from '@/components/AILearningDashboard';

interface PartnerDashboardProps {
  activeSubTab?: string | null;
}

export function PartnerDashboard({ activeSubTab }: PartnerDashboardProps) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your inquiry has been submitted! We\'ll contact you within 24 hours.');
    setContactForm({ name: '', email: '', phone: '', company: '', message: '' });
  };

  const stats = [
    {
      label: 'Partnership Revenue',
      value: '$248,500',
      icon: CurrencyDollar,
      trend: '+18.2%',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Active Partnerships',
      value: '24',
      icon: Handshake,
      trend: '+3',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Referral Commission',
      value: '$12,450',
      icon: Percent,
      trend: '+12.5%',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  const renderMaterialsVendors = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Package className="w-7 h-7 text-white" weight="duotone" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Materials Vendors</h2>
            <p className="text-muted-foreground">Partner with us to supply contractors</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Active Vendors', value: '42', icon: Users },
          { label: 'Monthly Orders', value: '1,284', icon: Package },
          { label: 'Total Volume', value: '$2.4M', icon: CurrencyDollar },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-8 h-8 text-primary" weight="duotone" />
                <TrendUp className="w-5 h-5 text-accent" weight="bold" />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">Featured Materials Partners</h3>
          <Separator className="mb-4" />
          <div className="space-y-4">
            {[
              { name: 'ProBuild Supply Co.', category: 'Lumber & Building Materials', volume: '$450K/mo', rating: 4.9 },
              { name: 'Elite Hardware Distributors', category: 'Tools & Equipment', volume: '$320K/mo', rating: 4.8 },
              { name: 'Premium Paint & Finishes', category: 'Paints & Coatings', volume: '$215K/mo', rating: 4.7 },
              { name: 'Roofing Materials Direct', category: 'Roofing Supplies', volume: '$380K/mo', rating: 4.9 },
            ].map((vendor, index) => (
              <motion.div
                key={vendor.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{vendor.name}</h4>
                        <Badge variant="secondary">{vendor.rating} ★</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{vendor.category}</p>
                      <p className="text-sm font-semibold text-accent">{vendor.volume}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">Partnership Benefits</h3>
          <Separator className="mb-4" />
          <div className="space-y-4">
            {[
              'Access to 3,500+ verified contractors',
              'Automated ordering and invoicing',
              'Real-time inventory management',
              'Bulk order discounts (15-30%)',
              'Dedicated account manager',
              'Marketing co-op opportunities',
            ].map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                <p className="text-sm">{benefit}</p>
              </motion.div>
            ))}
            <Button className="w-full mt-4" size="lg">
              <Package className="w-5 h-5 mr-2" weight="duotone" />
              Become a Vendor Partner
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-accent">
            <Shield className="w-7 h-7 text-white" weight="duotone" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Insurance Partners</h2>
            <p className="text-muted-foreground">Provide coverage to our contractor network</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Active Policies', value: '2,845', icon: Shield },
          { label: 'Total Premium', value: '$8.2M', icon: CurrencyDollar },
          { label: 'Claims Processed', value: '142', icon: CheckCircle },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-8 h-8 text-secondary" weight="duotone" />
                <TrendUp className="w-5 h-5 text-accent" weight="bold" />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">Insurance Coverage Types</h3>
          <Separator className="mb-4" />
          <div className="space-y-3">
            {[
              { type: 'General Liability', contractors: '3,542', premium: '$1M-$2M' },
              { type: 'Workers Compensation', contractors: '2,890', premium: 'State Minimum+' },
              { type: 'Professional Liability', contractors: '1,245', premium: '$500K-$1M' },
              { type: 'Commercial Auto', contractors: '2,156', premium: '$500K-$1M' },
              { type: 'Tool & Equipment', contractors: '1,876', premium: '$50K-$200K' },
            ].map((coverage, index) => (
              <motion.div
                key={coverage.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{coverage.type}</h4>
                      <p className="text-sm text-muted-foreground">{coverage.contractors} contractors</p>
                    </div>
                    <Badge variant="secondary">{coverage.premium}</Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">Partnership Benefits</h3>
          <Separator className="mb-4" />
          <div className="space-y-4">
            {[
              'Direct access to pre-vetted contractors',
              'Automated policy enrollment & renewals',
              'Real-time claims processing platform',
              'Risk assessment data & analytics',
              '8-12% commission on premiums',
              'Co-branded marketing materials',
            ].map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                <p className="text-sm">{benefit}</p>
              </motion.div>
            ))}
            <Button className="w-full mt-4" size="lg">
              <Shield className="w-5 h-5 mr-2" weight="duotone" />
              Become an Insurance Partner
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderPrivateEquity = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent">
            <Bank className="w-7 h-7 text-white" weight="duotone" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Private Equity & Investment</h2>
            <p className="text-muted-foreground">Explore investment opportunities with FairTradeWorker</p>
          </div>
        </div>
      </motion.div>

      <Card className="glass-card p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2">
        <div className="text-center space-y-6">
          <div className="inline-block p-4 rounded-full bg-primary/10">
            <Bank className="w-16 h-16 text-primary" weight="duotone" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Investment Opportunities</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              FairTradeWorker is revolutionizing the home services industry. Learn about partnership opportunities, 
              territory acquisition programs, and investment options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { 
                label: 'Platform GMV', 
                value: '$124.5M', 
                sublabel: 'Annual Run Rate',
                icon: ChartLine 
              },
              { 
                label: 'Growth Rate', 
                value: '240%', 
                sublabel: 'Year over Year',
                icon: TrendUp 
              },
              { 
                label: 'Territories', 
                value: '850+', 
                sublabel: 'Nationwide',
                icon: Users 
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" weight="duotone" />
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="space-y-4">
            <h4 className="text-xl font-bold">Schedule a Confidential Discussion</h4>
            <p className="text-sm text-muted-foreground">
              Our investment relations team will contact you within 24-48 hours to discuss opportunities.
            </p>
            <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pe-name">Name *</Label>
                  <Input
                    id="pe-name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="glass-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pe-company">Company/Fund *</Label>
                  <Input
                    id="pe-company"
                    value={contactForm.company}
                    onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                    required
                    className="glass-card"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pe-email">Email *</Label>
                  <Input
                    id="pe-email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="glass-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pe-phone">Phone</Label>
                  <Input
                    id="pe-phone"
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="glass-card"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pe-message">Message</Label>
                <Textarea
                  id="pe-message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us about your investment interests..."
                  className="glass-card"
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                <Envelope className="w-5 h-5 mr-2" weight="duotone" />
                Request Information
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderRealEstate = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-secondary">
            <Buildings className="w-7 h-7 text-white" weight="duotone" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Real Estate Partners</h2>
            <p className="text-muted-foreground">Connect your clients with trusted contractors</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Partner Agents', value: '684', icon: Users },
          { label: 'Transactions', value: '3,240', icon: Buildings },
          { label: 'Commission Earned', value: '$184K', icon: CurrencyDollar },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-8 h-8 text-accent" weight="duotone" />
                <TrendUp className="w-5 h-5 text-accent" weight="bold" />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">Partnership Benefits</h3>
          <Separator className="mb-4" />
          <div className="space-y-4">
            {[
              'Pre-listing home inspection services',
              'Fast-track contractor connections',
              'Closing repair coordination',
              'Buyer move-in concierge service',
              'Commission on contractor referrals',
              'Co-marketing opportunities',
              'Dedicated real estate team',
            ].map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                <p className="text-sm">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">Use Cases</h3>
          <Separator className="mb-4" />
          <div className="space-y-3">
            {[
              { title: 'Pre-Sale Staging', desc: 'Quick cosmetic updates before listing', commission: '3-5%' },
              { title: 'Inspection Repairs', desc: 'Address buyer inspection items fast', commission: '5-7%' },
              { title: 'Buyer Move-In', desc: 'New homeowner renovation projects', commission: '5-10%' },
              { title: 'Investment Properties', desc: 'Renovation project management', commission: '7-12%' },
            ].map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{useCase.title}</h4>
                      <p className="text-sm text-muted-foreground">{useCase.desc}</p>
                    </div>
                    <Badge variant="secondary">{useCase.commission}</Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <Button className="w-full mt-4" size="lg">
            <Buildings className="w-5 h-5 mr-2" weight="duotone" />
            Become a Real Estate Partner
          </Button>
        </Card>
      </div>
    </div>
  );

  const renderContactForm = () => (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
          <Envelope className="w-12 h-12 text-primary" weight="duotone" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Don't See Your Business?</h2>
        <p className="text-muted-foreground">
          We're always looking to expand our partner network. Tell us about your business and how we can work together.
        </p>
      </motion.div>

      <Card className="glass-card p-8">
        <form onSubmit={handleContactSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Full Name *</Label>
              <Input
                id="contact-name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
                className="glass-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-company">Company Name *</Label>
              <Input
                id="contact-company"
                value={contactForm.company}
                onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                required
                className="glass-card"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email Address *</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
                className="glass-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone Number</Label>
              <Input
                id="contact-phone"
                type="tel"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                className="glass-card"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">Tell us about your business and partnership interests *</Label>
            <Textarea
              id="contact-message"
              rows={6}
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              required
              placeholder="What type of business do you operate? How do you envision partnering with FairTradeWorker? What value can you provide to our contractor and homeowner network?"
              className="glass-card"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            <Envelope className="w-5 h-5 mr-2" weight="duotone" />
            Send Inquiry
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            We review all partnership inquiries and typically respond within 2-3 business days.
          </p>
        </form>
      </Card>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Handshake className="w-6 h-6 text-primary" weight="duotone" />
          <h2 className="text-3xl font-bold">Partner Dashboard</h2>
        </div>
        <p className="text-muted-foreground">
          Manage partnerships and track commission earnings
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} weight="duotone" />
                    </div>
                    <Badge variant="secondary">{stat.trend}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Package, label: 'Materials Vendors', count: '42', color: 'from-primary to-secondary' },
          { icon: Shield, label: 'Insurance Partners', count: '18', color: 'from-secondary to-accent' },
          { icon: Buildings, label: 'Real Estate Agents', count: '684', color: 'from-accent to-primary' },
          { icon: Bank, label: 'Financial Partners', count: '12', color: 'from-primary via-secondary to-accent' },
        ].map((category, index) => (
          <motion.div
            key={category.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} mb-4 inline-block`}>
                <category.icon className="w-7 h-7 text-white" weight="duotone" />
              </div>
              <p className="text-sm text-muted-foreground">{category.label}</p>
              <p className="text-2xl font-bold">{category.count}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChartLine className="w-5 h-5 text-primary" weight="duotone" />
              <h3 className="text-xl font-bold">Commission Breakdown</h3>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Contractor Referrals</span>
                <span className="font-semibold">$8,200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Premium Partnerships</span>
                <span className="font-semibold">$3,150</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Standard Partnerships</span>
                <span className="font-semibold">$1,100</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Commission</span>
                <span className="text-xl font-bold text-accent">$12,450</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bank className="w-5 h-5 text-secondary" weight="duotone" />
              <h3 className="text-xl font-bold">Finance Options</h3>
            </div>
            <Separator />
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start glass-hover">
                <CurrencyDollar className="w-5 h-5 mr-2" weight="duotone" />
                Request Payout
              </Button>
              <Button variant="outline" className="w-full justify-start glass-hover">
                <ChartLine className="w-5 h-5 mr-2" weight="duotone" />
                View Payment History
              </Button>
              <Button variant="outline" className="w-full justify-start glass-hover">
                <Percent className="w-5 h-5 mr-2" weight="duotone" />
                Commission Settings
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!activeSubTab && renderOverview()}
      {activeSubTab === 'materials' && renderMaterialsVendors()}
      {activeSubTab === 'insurance' && renderInsurance()}
      {activeSubTab === 'private_equity' && renderPrivateEquity()}
      {activeSubTab === 'real_estate' && renderRealEstate()}
      {activeSubTab === 'contact' && renderContactForm()}
      {activeSubTab === 'ai' && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Brain className="w-7 h-7 text-white" weight="duotone" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Technology Partners</h2>
                <p className="text-muted-foreground">Platform intelligence and learning systems</p>
              </div>
            </div>
          </motion.div>
          <AILearningDashboard />
        </div>
      )}
    </motion.div>
  );
}
