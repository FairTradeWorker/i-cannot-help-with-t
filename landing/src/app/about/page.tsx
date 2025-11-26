import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Target, Heart, Zap, Award, Globe } from 'lucide-react';

export const metadata = {
  title: 'About Us - FairTradeWorker',
  description: 'Learn about FairTradeWorker\'s mission to revolutionize the home services industry with AI-powered APIs and fair trade economics.',
};

const values = [
  {
    icon: Heart,
    title: 'Fair Trade First',
    description: 'Workers pay zero fees. We believe in sustainable economics that benefit everyone in the ecosystem.'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Continuous improvement through self-learning AI that gets smarter with every API call.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building a network of contractors, homeowners, and developers who thrive together.'
  },
  {
    icon: Target,
    title: 'Accuracy',
    description: 'Obsessed with precision. Our APIs deliver 99%+ accuracy through relentless optimization.'
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'Enterprise-grade reliability with 99.99% uptime and SOC 2 Type II compliance.'
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'Democratizing AI for businesses of all sizes, from solo contractors to Fortune 500.'
  }
];

const team = [
  {
    name: 'Alex Rivera',
    role: 'CEO & Co-Founder',
    bio: 'Former contractor with 15 years in the field. Built and sold two home services companies before founding FairTradeWorker.',
  },
  {
    name: 'Dr. Lisa Park',
    role: 'CTO & Co-Founder',
    bio: 'PhD in Machine Learning from Stanford. Previously led AI research at Google. Architect of our self-learning intelligence platform.',
  },
  {
    name: 'Marcus Johnson',
    role: 'VP of Engineering',
    bio: '20 years in enterprise software. Former engineering director at Salesforce. Passionate about building reliable, scalable systems.',
  },
  {
    name: 'Jennifer Walsh',
    role: 'VP of Sales',
    bio: 'Built sales teams at three successful SaaS startups. Expert in API monetization and enterprise partnerships.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Building the Future of{' '}
              <span className="gradient-text">Home Services</span>
            </h1>
            <p className="text-xl text-gray-600">
              We're on a mission to revolutionize the home services industry with AI-powered 
              intelligence and fair trade economics that benefit everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              FairTradeWorker was born from a simple observation: the home services industry is broken. 
              Contractors lose 15-30% of their earnings to platform fees. Homeowners overpay for services 
              because pricing is opaque. And technology that could help everyone is locked behind 
              enterprise paywalls.
            </p>
            <p>
              Our founders—a contractor who spent 15 years in the field and an AI researcher from 
              Stanford—came together with a radical idea: what if we could build a platform where 
              workers pay zero fees, AI makes everyone smarter, and success compounds for all participants?
            </p>
            <p>
              Today, FairTradeWorker powers over 500 businesses with 50+ self-learning Intelligence APIs. 
              Our technology processes millions of predictions every month, getting smarter with each one. 
              And our Fair Trade model has put over $2M back in workers' pockets—money that would have 
              gone to platform fees elsewhere.
            </p>
            <p>
              We're just getting started. Our vision is a world where every contractor has access to 
              AI-powered tools that help them grow their business, every homeowner gets fair prices, 
              and technology serves the people who build our homes.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-3xl">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-accent font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-accent text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-1">500+</div>
              <div className="text-white/70">Active Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">50+</div>
              <div className="text-white/70">API Endpoints</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">$2M+</div>
              <div className="text-white/70">Saved for Workers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">99.2%</div>
              <div className="text-white/70">API Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
