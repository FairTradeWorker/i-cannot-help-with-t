import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  House, 
  User, 
  ChatCircle,
  Sparkle,
  BellRinging,
  Handshake,
  Gift,
  MapTrifold,
  CaretDown,
  UserCircle,
  ShoppingBag,
  Package,
  Shield,
  Bank,
  Buildings,
  Question,
  ChartBar,
  Briefcase,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LegalConsentModal } from '@/components/LegalConsentModal';
import { LegalFooter } from '@/components/LegalFooter';
import { MarketplaceBrowse } from '@/components/MarketplaceBrowse';
import { UserProfile } from '@/components/UserProfile';
import { MessagesView } from '@/components/MessagesView';
import { TerritoryBrowser } from '@/components/TerritoryBrowser';
import { ReferralSystem } from '@/components/ReferralSystem';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { AILearningDashboard } from '@/components/AILearningDashboard';
import { PaymentManagement } from '@/components/PaymentManagement';
import { PartnerDashboard } from '@/components/PartnerDashboard';
import { JobBrowser } from '@/components/JobBrowser';
import { dataStore } from '@/lib/store';
import { initializeDemoData } from '@/lib/demo-data';
import type { User as UserType, Referral, Analytics } from '@/lib/types';

type MainTab = 'home' | 'jobs' | 'territory' | 'messages' | 'partners' | 'referral';
type SubTab = 'browse' | 'payment' | 'materials' | 'insurance' | 'private_equity' | 'real_estate' | 'contact' | 'analytics' | 'program' | 'my_referrals';

function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLegalConsent, setShowLegalConsent] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [activeSubTab, setActiveSubTab] = useState<SubTab | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const mockReferrals: Referral[] = [
    {
      id: 'ref-1',
      referrerId: currentUser?.id || '',
      refereeId: 'user-123',
      status: 'rewarded',
      reward: 50,
      createdAt: new Date('2024-01-15'),
      completedAt: new Date('2024-01-20'),
    },
    {
      id: 'ref-2',
      referrerId: currentUser?.id || '',
      refereeId: 'user-456',
      status: 'completed',
      reward: 50,
      createdAt: new Date('2024-02-01'),
    },
  ];

  const mockAnalytics: Analytics = {
    totalUsers: 15420,
    totalContractors: 3542,
    totalHomeowners: 11878,
    totalJobs: 28934,
    completedJobs: 24127,
    totalRevenue: 12450000,
    averageJobValue: 2850,
    topStates: [
      { state: 'California', jobs: 5234 },
      { state: 'Texas', jobs: 4123 },
      { state: 'Florida', jobs: 3892 },
      { state: 'New York', jobs: 3456 },
      { state: 'Illinois', jobs: 2934 },
    ],
    topServices: [
      { service: 'Roofing', count: 6234 },
      { service: 'HVAC', count: 5123 },
      { service: 'Plumbing', count: 4892 },
      { service: 'Electrical', count: 4234 },
      { service: 'Landscaping', count: 3823 },
    ],
    revenueByMonth: [
      { month: 'Jan', revenue: 980000 },
      { month: 'Feb', revenue: 1050000 },
      { month: 'Mar', revenue: 1120000 },
      { month: 'Apr', revenue: 1080000 },
      { month: 'May', revenue: 1150000 },
      { month: 'Jun', revenue: 1200000 },
    ],
  };

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    await initializeDemoData();
    const user = await dataStore.getCurrentUser();
    
    if (!user) {
      setShowLegalConsent(true);
    } else {
      setCurrentUser(user);
    }
    
    setLoading(false);
  };

  const handleLegalAccept = async (consents: any) => {
    const newUser: UserType = {
      id: 'user-' + Date.now(),
      role: 'homeowner',
      email: 'user@example.com',
      name: 'Guest User',
      createdAt: new Date(),
      legalConsents: {
        ...consents,
        acceptedAt: new Date(),
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
      },
    };
    
    await dataStore.saveUser(newUser);
    setCurrentUser(newUser);
    setShowLegalConsent(false);
  };

  const handleLegalDecline = () => {
    setShowLegalConsent(false);
  };

  const handleNavClick = (tab: MainTab, subTab?: SubTab) => {
    setActiveTab(tab);
    setActiveSubTab(subTab || null);
    setShowAdminPanel(false);
    setShowProfile(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading marketplace...</p>
        </motion.div>
      </div>
    );
  }

  if (showLegalConsent) {
    return (
      <LegalConsentModal
        userType="homeowner"
        onAccept={handleLegalAccept}
        onDecline={handleLegalDecline}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="sticky top-0 z-50 glass-card border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleNavClick('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Sparkle className="w-6 h-6 text-white" weight="fill" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ServiceHub
              </h1>
            </motion.div>

            <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('home')}
                className="glass-hover"
              >
                <House className="w-5 h-5 mr-2" weight={activeTab === 'home' ? 'fill' : 'regular'} />
                Home
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={activeTab === 'home' && activeSubTab === 'browse' ? 'default' : 'ghost'} className="glass-hover">
                    <ShoppingBag className="w-5 h-5 mr-2" weight="regular" />
                    Homeowner
                    <CaretDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="glass-card border-border/50">
                  <DropdownMenuItem onClick={() => handleNavClick('home', 'browse')}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Browse Services
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('home', 'payment')}>
                    <Package className="w-4 h-4 mr-2" />
                    Payment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant={activeTab === 'jobs' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('jobs')}
                className="glass-hover"
              >
                <Briefcase className="w-5 h-5 mr-2" weight={activeTab === 'jobs' ? 'fill' : 'regular'} />
                Jobs
              </Button>

              <Button
                variant={activeTab === 'territory' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('territory')}
                className="glass-hover"
              >
                <MapTrifold className="w-5 h-5 mr-2" weight={activeTab === 'territory' ? 'fill' : 'regular'} />
                Territory
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={activeTab === 'partners' ? 'default' : 'ghost'} className="glass-hover">
                    <Handshake className="w-5 h-5 mr-2" weight="regular" />
                    Partners
                    <CaretDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="glass-card border-border/50">
                  <DropdownMenuItem onClick={() => handleNavClick('partners', 'materials')}>
                    <Package className="w-4 h-4 mr-2" />
                    Materials Vendors
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('partners', 'insurance')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Insurance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('partners', 'private_equity')}>
                    <Bank className="w-4 h-4 mr-2" />
                    Private Equity (Contact Us)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('partners', 'real_estate')}>
                    <Buildings className="w-4 h-4 mr-2" />
                    Real Estate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavClick('partners', 'contact')}>
                    <Question className="w-4 h-4 mr-2" />
                    Don't see your business? Contact us
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={activeTab === 'referral' ? 'default' : 'ghost'} className="glass-hover">
                    <Gift className="w-5 h-5 mr-2" weight="regular" />
                    Referral
                    <CaretDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="glass-card border-border/50">
                  <DropdownMenuItem onClick={() => handleNavClick('referral', 'program')}>
                    <Gift className="w-4 h-4 mr-2" />
                    Referral Program
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('referral', 'my_referrals')}>
                    <User className="w-4 h-4 mr-2" />
                    My Referrals
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant={activeTab === 'messages' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('messages')}
                className="glass-hover"
              >
                <ChatCircle className="w-5 h-5 mr-2" weight={activeTab === 'messages' ? 'fill' : 'regular'} />
                Messages
              </Button>
            </nav>

            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="relative glass-hover">
                  <BellRinging className="w-5 h-5" />
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"
                  />
                </Button>
              </motion.div>

              {currentUser?.role === 'admin' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={showAdminPanel ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => {
                      setShowAdminPanel(!showAdminPanel);
                      setShowProfile(false);
                    }}
                    className="glass-hover"
                  >
                    <ChartBar className="w-5 h-5" weight={showAdminPanel ? 'fill' : 'regular'} />
                  </Button>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={showProfile ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => {
                    setShowProfile(!showProfile);
                    setShowAdminPanel(false);
                  }}
                  className="glass-hover"
                >
                  <UserCircle className="w-5 h-5" weight={showProfile ? 'fill' : 'regular'} />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activeSubTab}-${showAdminPanel}-${showProfile}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {showProfile && <UserProfile user={currentUser} />}
              {!showProfile && (
                <>
                  {activeTab === 'home' && !activeSubTab && (
                    <div className="space-y-8">
                      <MarketplaceBrowse />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <TerritoryBrowser />
                      </motion.div>
                    </div>
                  )}
                  {activeTab === 'home' && activeSubTab === 'browse' && <MarketplaceBrowse />}
                  {activeTab === 'home' && activeSubTab === 'payment' && <PaymentManagement />}
                  {activeTab === 'jobs' && <JobBrowser />}
                  {activeTab === 'territory' && <TerritoryBrowser />}
                  {activeTab === 'messages' && <MessagesView userId={currentUser?.id || ''} />}
                  {activeTab === 'partners' && <PartnerDashboard activeSubTab={activeSubTab} />}
                  {activeTab === 'referral' && (
                    <ReferralSystem 
                      userId={currentUser?.id || ''} 
                      referrals={mockReferrals}
                      activeView={activeSubTab === 'my_referrals' ? 'referrals' : 'program'}
                    />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <LegalFooter />

      {showAdminPanel && currentUser?.role === 'admin' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="border-t-2 border-primary/20 bg-gradient-to-b from-background to-muted/20"
        >
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <ChartBar className="w-6 h-6 text-white" weight="fill" />
                </div>
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              </div>
              <p className="text-muted-foreground">Platform analytics and AI learning metrics</p>
            </div>
            
            <div className="space-y-8">
              <AnalyticsDashboard analytics={mockAnalytics} />
              <AILearningDashboard />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
