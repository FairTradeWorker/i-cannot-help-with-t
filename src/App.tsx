import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  House, 
  User, 
  ChatCircle,
  Sparkle,
  BellRinging,
  Handshake,
  ChartBar,
  Gift,
  CreditCard,
  MapTrifold,
  CaretDown,
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
import { dataStore } from '@/lib/store';
import { initializeDemoData } from '@/lib/demo-data';
import type { User as UserType, Referral, Analytics } from '@/lib/types';

type MainTab = 'home' | 'territory' | 'messages' | 'profile';
type HomeownerSubTab = 'browse' | 'payment';
type PartnerSubTab = 'overview';
type AdminSubTab = 'analytics';
type ReferralSubTab = 'program';

function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLegalConsent, setShowLegalConsent] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [homeownerSubTab, setHomeownerSubTab] = useState<HomeownerSubTab>('browse');
  const [showPayment, setShowPayment] = useState(false);

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
        className="sticky top-0 z-50 glass border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkle className="w-6 h-6 text-white" weight="fill" />
              </div>
              <h1 className="text-xl font-bold">ServiceHub</h1>
            </motion.div>

            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('home')}
              >
                <House className="w-5 h-5 mr-2" weight={activeTab === 'home' ? 'fill' : 'regular'} />
                Home
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <User className="w-5 h-5 mr-2" weight="regular" />
                    Homeowner
                    <CaretDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    setActiveTab('home');
                    setHomeownerSubTab('browse');
                  }}>
                    Browse Services
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setActiveTab('home');
                    setHomeownerSubTab('payment');
                  }}>
                    Payment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant={activeTab === 'territory' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('territory')}
              >
                <MapTrifold className="w-5 h-5 mr-2" weight={activeTab === 'territory' ? 'fill' : 'regular'} />
                Territory
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <Handshake className="w-5 h-5 mr-2" weight="regular" />
                    Partner
                    <CaretDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Partner Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Finance
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <ChartBar className="w-5 h-5 mr-2" weight="regular" />
                    Admin
                    <CaretDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveTab('home')}>
                    <ChartBar className="w-4 h-4 mr-2" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    User Management
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <Gift className="w-5 h-5 mr-2" weight="regular" />
                    Referral
                    <CaretDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveTab('home')}>
                    Referral Program
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    My Referrals
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant={activeTab === 'messages' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('messages')}
              >
                <ChatCircle className="w-5 h-5 mr-2" weight={activeTab === 'messages' ? 'fill' : 'regular'} />
                Messages
              </Button>
            </nav>

            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="relative">
                  <BellRinging className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                </Button>
              </motion.div>

              <Button
                variant={activeTab === 'profile' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setActiveTab('profile')}
              >
                <User className="w-5 h-5" weight={activeTab === 'profile' ? 'fill' : 'regular'} />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'home' && homeownerSubTab === 'browse' && <MarketplaceBrowse />}
              {activeTab === 'home' && homeownerSubTab === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold">Payment Management</h2>
                  <p className="text-muted-foreground">Manage your payments and finance options</p>
                </div>
              )}
              {activeTab === 'territory' && <TerritoryBrowser />}
              {activeTab === 'messages' && <MessagesView userId={currentUser?.id || ''} />}
              {activeTab === 'profile' && <UserProfile user={currentUser} />}
            </motion.div>
          </AnimatePresence>

          {/* Demo sections that can be accessed via navigation */}
          <div className="mt-12 space-y-12">
            <div id="analytics-section">
              <AnalyticsDashboard analytics={mockAnalytics} />
            </div>

            <div id="referral-section" className="mt-12">
              <ReferralSystem userId={currentUser?.id || ''} referrals={mockReferrals} />
            </div>
          </div>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}

export default App;
