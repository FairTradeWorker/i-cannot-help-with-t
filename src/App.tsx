import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  House, 
  ChatCircle,
  BellRinging,
  Handshake,
  Gift,
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
  Hammer,
  HardHat,
  CreditCard,
  UserGear,
  SignOut,
  MapTrifold,
  Lightning,
  Brain,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LegalConsentModal } from '@/components/LegalConsentModal';
import { LegalFooter } from '@/components/LegalFooter';
import { MarketplaceBrowse } from '@/components/MarketplaceBrowse';
import { UserProfile } from '@/components/UserProfile';
import { MessagesView } from '@/components/MessagesView';
import { TerritoryMapPage } from '@/components/TerritoryMapPage';
import { ReferralSystem } from '@/components/ReferralSystem';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { PaymentManagement } from '@/components/PaymentManagement';
import { PartnerDashboard } from '@/components/PartnerDashboard';
import { JobBrowser } from '@/components/JobBrowser';
import { ContractorDashboard } from '@/components/ContractorDashboard';
import { QuickJobPost } from '@/components/QuickJobPost';
import { VideoJobCreator } from '@/components/VideoJobCreator';
import { APIMarketplaceSection } from '@/components/APIMarketplaceSection';
import { IntelligenceAPIManager } from '@/components/IntelligenceAPI/IntelligenceAPIManager';
import { AdminLearningDashboard } from '@/components/AdminDashboard/AdminLearningDashboard';
import { dataStore } from '@/lib/store';
import { initializeDemoData } from '@/lib/demo-data';
import { toast } from 'sonner';
import type { User as UserType, Referral, Analytics } from '@/lib/types';

type MainTab = 'home' | 'territories' | 'contractor' | 'subcontractor' | 'messages' | 'partners' | 'referral' | 'intelligence';
type SubTab = 'browse' | 'payment' | 'materials' | 'insurance' | 'ai' | 'private_equity' | 'real_estate' | 'contact' | 'analytics' | 'program' | 'my_referrals' | 'dashboard' | 'jobs' | 'route' | 'earnings';

function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLegalConsent, setShowLegalConsent] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [activeSubTab, setActiveSubTab] = useState<SubTab | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showVideoCreator, setShowVideoCreator] = useState(false);

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
    totalOperators: 156,
    totalJobs: 28934,
    completedJobs: 24127,
    totalRevenue: 12450000,
    averageJobValue: 2850,
    aiAccuracy: 94.5,
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
    aiLearningMetrics: {
      totalPredictions: 10523,
      averageAccuracy: 94.5,
      improvementRate: 12.3,
    },
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
    setShowVideoCreator(false);
  };

  const handleCreateJob = (type: 'video' | 'photo' | 'text') => {
    if (type === 'video') {
      setShowVideoCreator(true);
    } else {
      toast.info(`${type.charAt(0).toUpperCase() + type.slice(1)} job creation coming soon!`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLegalConsent(true);
    setActiveTab('home');
    setActiveSubTab(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.133, ease: [0.4, 0, 0.2, 1] }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading ServiceHub...</p>
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
        transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
        className="sticky top-0 z-50 glass-card border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center gap-2 flex-1">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('home')}
                className="glass-hover"
              >
                <House className="w-5 h-5 mr-2" weight={activeTab === 'home' ? 'fill' : 'regular'} />
                Home
              </Button>

              <Button
                variant={activeTab === 'territories' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('territories')}
                className="glass-hover"
              >
                <MapTrifold className="w-5 h-5 mr-2" weight={activeTab === 'territories' ? 'fill' : 'regular'} />
                Territories
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={activeTab === 'contractor' ? 'default' : 'ghost'} className="glass-hover">
                    <Hammer className="w-5 h-5 mr-2" weight="regular" />
                    Contractor
                    <CaretDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="glass-card border-border/50">
                  <DropdownMenuItem onClick={() => handleNavClick('contractor', 'dashboard')}>
                    <ChartBar className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('contractor', 'jobs')}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('contractor', 'earnings')}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Earnings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={activeTab === 'subcontractor' ? 'default' : 'ghost'} className="glass-hover">
                    <HardHat className="w-5 h-5 mr-2" weight="regular" />
                    Subcontractor
                    <CaretDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="glass-card border-border/50">
                  <DropdownMenuItem onClick={() => handleNavClick('subcontractor', 'dashboard')}>
                    <ChartBar className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('subcontractor', 'jobs')}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('subcontractor', 'earnings')}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Earnings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
                  <DropdownMenuItem onClick={() => handleNavClick('partners', 'ai')}>
                    <ChartBar className="w-4 h-4 mr-2" />
                    Technology
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('partners', 'private_equity')}>
                    <Bank className="w-4 h-4 mr-2" />
                    Private Equity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('partners', 'real_estate')}>
                    <Buildings className="w-4 h-4 mr-2" />
                    Real Estate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavClick('partners', 'contact')}>
                    <Question className="w-4 h-4 mr-2" />
                    Partner With Us
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
                    <UserCircle className="w-4 h-4 mr-2" />
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

              <Button
                variant={activeTab === 'intelligence' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('intelligence')}
                className="glass-hover"
              >
                <Lightning className="w-5 h-5 mr-2" weight={activeTab === 'intelligence' ? 'fill' : 'regular'} />
                Intelligence API
              </Button>
            </nav>

            <div className="flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.088, ease: [0.4, 0, 0.2, 1] }}
              >
                <Button variant="ghost" size="icon" className="relative glass-hover">
                  <BellRinging className="w-5 h-5" />
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.133, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"
                  />
                </Button>
              </motion.div>

              {currentUser?.role === 'admin' && (
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.088, ease: [0.4, 0, 0.2, 1] }}
                >
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

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavClick('home', 'payment')}
                className="glass-hover"
              >
                <CreditCard className="w-5 h-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.088, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Button
                      variant="ghost"
                      className="glass-hover flex items-center gap-2 px-2"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={currentUser?.avatar} />
                        <AvatarFallback>
                          {currentUser?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline text-sm font-medium">
                        {currentUser?.name || 'User'}
                      </span>
                      <CaretDown className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-border/50 w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{currentUser?.name || 'User'}</span>
                      <span className="text-xs text-muted-foreground">{currentUser?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    setShowProfile(true);
                    setShowAdminPanel(false);
                  }}>
                    <UserGear className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('home', 'payment')}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Methods
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <SignOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              transition={{ duration: 0.177, ease: [0.4, 0, 0.2, 1] }}
            >
              {showProfile && <UserProfile user={currentUser} />}
              {showVideoCreator && (
                <VideoJobCreator 
                  onJobCreated={(jobData) => {
                    toast.success('Job created successfully!');
                    setShowVideoCreator(false);
                  }}
                  onCancel={() => setShowVideoCreator(false)}
                />
              )}
              {!showProfile && !showVideoCreator && (
                <>
                  {activeTab === 'home' && (
                    <div className="space-y-8">
                      <QuickJobPost onCreateJob={handleCreateJob} />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.088, duration: 0.177, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <JobBrowser />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.177, duration: 0.177, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <APIMarketplaceSection />
                      </motion.div>
                    </div>
                  )}
                  {activeTab === 'territories' && <TerritoryMapPage />}
                  {activeTab === 'contractor' && <ContractorDashboard user={currentUser || undefined} subTab={activeSubTab} />}
                  {activeTab === 'subcontractor' && <ContractorDashboard user={currentUser || undefined} subTab={activeSubTab} isSubcontractor />}
                  {activeTab === 'messages' && <MessagesView userId={currentUser?.id || ''} />}
                  {activeTab === 'intelligence' && <IntelligenceAPIManager userId={currentUser?.id || ''} />}
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
          transition={{ duration: 0.177, ease: [0.4, 0, 0.2, 1] }}
          className="border-t-2 border-primary/20 bg-gradient-to-b from-background to-muted/20"
        >
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                  <Brain className="w-6 h-6 text-white" weight="fill" />
                </div>
                <h2 className="text-2xl font-bold">Admin Dashboard - Intelligence & Learning</h2>
              </div>
              <p className="text-muted-foreground">Platform analytics, learning metrics, and AI performance</p>
            </div>
            
            <div className="space-y-8">
              <AdminLearningDashboard />
              <AnalyticsDashboard analytics={mockAnalytics} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
