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
  CurrencyDollar,
  MapPin,
  Users,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Plus,
} from '@phosphor-icons/react';
import { 
  SectionReveal, 
  StaggeredContainer, 
  HeadlineReveal, 
  CTAReveal,
  SlideInFromLeft,
  SlideInFromRight,
  AnimatedCard
} from '@/components/AnimatedWrappers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LegalFooter } from '@/components/LegalFooter';
import { LoginModal } from '@/components/LoginModal';
import { MarketplaceBrowse } from '@/components/MarketplaceBrowse';
import { UserProfile } from '@/components/UserProfile';
import { MessagesView } from '@/components/MessagesView';
import { HomeownerDashboard } from '@/components/HomeownerDashboard';
import { TerritoryMapPage } from '@/components/TerritoryMapPage';
import { TerritoriesOverview } from '@/components/TerritoriesOverview';
import { ReferralSystem } from '@/components/ReferralSystem';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { PaymentManagement } from '@/components/PaymentManagement';
import { PartnerDashboard } from '@/components/PartnerDashboard';
import { JobBrowser } from '@/components/JobBrowser';
import { ContractorDashboard } from '@/components/ContractorDashboard';
import { ContractorBrowser } from '@/components/ContractorBrowser';
import { AdminLearningDashboard } from '@/components/AdminDashboard/AdminLearningDashboard';
import { TerritoryTeaser } from '@/components/TerritoryTeaser';
import { PaymentModal } from '@/components/PaymentModal';
import { PaymentScreen } from '@/components/PaymentScreen';
import { IntelligenceAPIManager } from '@/components/IntelligenceAPI/IntelligenceAPIManager';
import { WarrantySection } from '@/components/WarrantySection';
import { FileAClaim } from '@/components/FileAClaim';
import { UnifiedJobPost } from '@/components/UnifiedJobPost';
import { NotificationsPage } from '@/components/NotificationsPage';
import { dataStore } from '@/lib/store';
import { initializeDemoData } from '@/lib/demo-data';
import { toast } from 'sonner';
import type { User as UserType, Referral, Analytics } from '@/lib/types';

type MainTab = 'home' | 'territories' | 'jobs' | 'contractors-browse' | 'homeowner' | 'contractor' | 'subcontractor' | 'api' | 'warranty' | 'partners' | 'messages' | 'payment' | 'notifications';
type SubTab = 'overview' | 'file-claim' | 'materials' | 'insurance' | 'my-jobs' | 'post-job' | 'profile' | 'dashboard' | 'route';

function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [activeSubTab, setActiveSubTab] = useState<SubTab | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showJobPost, setShowJobPost] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentJobData, setPaymentJobData] = useState<{ title: string; amount: number } | null>(null);

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
    platformAccuracy: 94.5,
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
    learningMetrics: {
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
      setShowLogin(true);
    } else {
      setCurrentUser(user);
    }
    
    setLoading(false);
  };

  const handleLogin = async (email: string, password: string, role: 'homeowner' | 'contractor' | 'subcontractor') => {
    const newUser: UserType = {
      id: 'user-' + Date.now(),
      role: role,
      email: email,
      name: email.split('@')[0],
      createdAt: new Date(),
    };
    
    await dataStore.saveUser(newUser);
    setCurrentUser(newUser);
    setShowLogin(false);
  };

  const handleSignUp = async (email: string, password: string, role: 'homeowner' | 'contractor' | 'subcontractor') => {
    const newUser: UserType = {
      id: 'user-' + Date.now(),
      role: role,
      email: email,
      name: email.split('@')[0],
      createdAt: new Date(),
    };
    
    await dataStore.saveUser(newUser);
    setCurrentUser(newUser);
    setShowLogin(false);
  };

  const handleNavClick = (tab: MainTab, subTab?: SubTab) => {
    setActiveTab(tab);
    setActiveSubTab(subTab || null);
    setShowAdminPanel(false);
    setShowProfile(false);
    setShowJobPost(false);
  };

  const handleCreateJob = () => {
    setShowJobPost(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLogin(true);
    setActiveTab('home');
    setActiveSubTab(null);
    setShowJobPost(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="text-center w-full max-w-xs"
        >
          <div className="mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full mx-auto"
            />
          </div>
          <div className="loading-bar mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Loading FairTradeWorker...</p>
        </motion.div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <LoginModal
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
        className="sticky top-0 z-50 glass-card border-b border-border/50"
      >
        <div className="w-full px-6">
          <div className="flex items-center h-16 py-2 max-w-[1800px] mx-auto gap-4">
            <nav className="flex items-center gap-1.5">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('home')}
                className="button-interactive"
                size="sm"
              >
                Home
              </Button>

              <Button
                variant={activeTab === 'territories' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('territories', 'overview')}
                className="button-interactive"
                size="sm"
              >
                Territories
              </Button>

              <Button
                variant={activeTab === 'jobs' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('jobs')}
                className="button-interactive"
                size="sm"
              >
                Jobs
              </Button>

              <Button
                variant={activeTab === 'contractors-browse' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('contractors-browse')}
                className="button-interactive"
                size="sm"
              >
                Contractors
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={activeTab === 'homeowner' ? 'default' : 'ghost'}
                    className="button-interactive"
                    size="sm"
                  >
                    Homeowner
                    <CaretDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-2 border-black">
                  <DropdownMenuItem onClick={() => handleNavClick('homeowner', 'profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('homeowner', 'my-jobs')}>
                    My Jobs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={activeTab === 'contractor' ? 'default' : 'ghost'}
                    className="button-interactive"
                    size="sm"
                  >
                    Contractor
                    <CaretDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-2 border-black">
                  <DropdownMenuItem onClick={() => handleNavClick('contractor', 'dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('contractor', 'my-jobs')}>
                    My Estimates
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('contractor', 'route')}>
                    Route Planner
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={activeTab === 'subcontractor' ? 'default' : 'ghost'}
                    className="button-interactive"
                    size="sm"
                  >
                    Subcontractor
                    <CaretDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-2 border-black">
                  <DropdownMenuItem onClick={() => handleNavClick('subcontractor', 'dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('subcontractor', 'my-jobs')}>
                    My Estimates
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('subcontractor', 'route')}>
                    Route Planner
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            <Button
              size="lg"
              onClick={handleCreateJob}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-md has-[>svg]:px-4 hover:bg-white/90 shadow-lg font-black uppercase px-6 h-12 border-2 ml-4 text-slate-50 bg-blue-800 border-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" weight="bold" />
              Post a Job
            </Button>

            <div className="flex-1" />

            <nav className="flex items-center gap-1.5 mr-4">
              <Button
                variant={activeTab === 'api' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('api')}
                className="button-interactive"
                size="sm"
              >
                API
              </Button>

              <Button
                variant={activeTab === 'partners' ? 'default' : 'ghost'}
                onClick={() => handleNavClick('partners')}
                className="button-interactive"
                size="sm"
              >
                Partners
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={activeTab === 'warranty' ? 'default' : 'ghost'}
                    className="button-interactive"
                    size="sm"
                  >
                    Warranty
                    <CaretDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-2 border-black">
                  <DropdownMenuItem onClick={() => handleNavClick('warranty', undefined)}>
                    Coverage
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('warranty', 'file-claim')}>
                    File a Claim
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            <div className="flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Button
                  variant={activeTab === 'messages' ? 'default' : 'ghost'}
                  onClick={() => handleNavClick('messages')}
                  className="button-interactive relative"
                  size="sm"
                >
                  <ChatCircle className="w-4 h-4 mr-1.5" weight={activeTab === 'messages' ? 'fill' : 'regular'} />
                  Messages
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                </Button>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="button-interactive relative h-8 w-8"
                  onClick={() => handleNavClick('notifications')}
                >
                  <BellRinging className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                </Button>
              </motion.div>

              {currentUser?.role === 'admin' && (
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
                >
                  <Button
                    variant={showAdminPanel ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => {
                      setShowAdminPanel(!showAdminPanel);
                      setShowProfile(false);
                    }}
                    className="button-interactive h-8 w-8"
                  >
                    <ChartBar className="w-4 h-4" weight={showAdminPanel ? 'fill' : 'regular'} />
                  </Button>
                </motion.div>
              )}

              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setActiveTab('payment');
                    setActiveSubTab(null);
                    setShowAdminPanel(false);
                    setShowProfile(false);
                  }}
                  className="button-interactive h-8 w-8"
                  title="Make a Payment"
                >
                  <CreditCard className="w-4 h-4" />
                </Button>
              </motion.div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
                  >
                    <Button
                      variant="ghost"
                      className="button-interactive flex items-center gap-1.5 px-2 h-8"
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={currentUser?.avatar} />
                        <AvatarFallback className="text-xs">
                          {currentUser?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline text-sm font-medium">
                        {currentUser?.name || 'User'}
                      </span>
                      {(currentUser?.role === 'contractor' || currentUser?.role === 'subcontractor') && 
                        currentUser?.contractorProfile?.specialties && 
                        currentUser.contractorProfile.specialties.length > 0 && (
                        <span className="hidden lg:inline text-xs text-muted-foreground ml-1">
                          ({currentUser.contractorProfile.specialties[0]})
                        </span>
                      )}
                      <CaretDown className="w-3 h-3" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-border/50 w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{currentUser?.name || 'User'}</span>
                      {(currentUser?.role === 'contractor' || currentUser?.role === 'subcontractor') && 
                        currentUser?.contractorProfile?.specialties && 
                        currentUser.contractorProfile.specialties.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {currentUser.contractorProfile.specialties[0]}
                        </span>
                      )}
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
                  <DropdownMenuItem onClick={() => {
                    setActiveTab('payment');
                    setActiveSubTab(null);
                    setShowProfile(false);
                    setShowAdminPanel(false);
                  }}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing & Payments
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
              key={`${activeTab}-${activeSubTab}-${showAdminPanel}-${showProfile}-${showJobPost}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {showProfile && <UserProfile user={currentUser} />}
              {showJobPost && (
                <UnifiedJobPost 
                  onJobCreated={(jobData) => {
                    toast.success('Job created successfully!');
                    setShowJobPost(false);
                    setActiveTab('homeowner');
                    setActiveSubTab('my-jobs');
                  }}
                  onCancel={() => setShowJobPost(false)}
                />
              )}
              {!showProfile && !showJobPost && (
                <>
                  {activeTab === 'payment' && <PaymentScreen onPaymentComplete={() => {
                    setActiveTab('home');
                    toast.success('Payment completed successfully!');
                  }} />}
                  {activeTab === 'notifications' && <NotificationsPage />}
                  {activeTab === 'home' && (
                    <div className="space-y-8">
                      <SectionReveal direction="up">
                        <Card className="glass-card p-6 cursor-pointer border-2 border-primary/20 hover:border-primary transition-all" onClick={handleCreateJob}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-4 rounded-xl bg-primary">
                                <Plus className="w-8 h-8 text-white" weight="bold" />
                              </div>
                              <div>
                                <HeadlineReveal>
                                  <h3 className="text-xl font-bold mb-1">Post a New Job</h3>
                                </HeadlineReveal>
                                <p className="text-sm text-muted-foreground">Get estimates from qualified contractors in your area</p>
                              </div>
                            </div>
                            <CTAReveal delay={0.2}>
                              <Button size="lg">
                                Get Started
                              </Button>
                            </CTAReveal>
                          </div>
                        </Card>
                      </SectionReveal>
                      
                      <StaggeredContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="glass-card p-6 cursor-pointer h-full glass-hover" onClick={() => handleNavClick('territories', 'overview')}>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 rounded-xl bg-primary">
                              <MapTrifold className="w-7 h-7 text-white" weight="fill" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Available</p>
                              <p className="text-2xl font-bold">850+</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold mb-1">Territories</p>
                          <p className="text-xs text-muted-foreground mb-2">$45/month • Exclusive lead rights</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <Badge variant="outline" className="text-[10px]">CA</Badge>
                            <Badge variant="outline" className="text-[10px]">TX</Badge>
                            <Badge variant="outline" className="text-[10px]">FL</Badge>
                            <Badge variant="outline" className="text-[10px]">+47 states</Badge>
                          </div>
                        </Card>

                        <Card className="glass-card p-6 cursor-pointer h-full glass-hover" onClick={() => handleNavClick('jobs')}>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 rounded-xl bg-accent">
                              <Briefcase className="w-7 h-7 text-white" weight="fill" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Active</p>
                              <p className="text-2xl font-bold">2.8K+</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold mb-1">Jobs Available</p>
                          <p className="text-xs text-muted-foreground mb-2">Browse and bid on opportunities</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-[10px]">Roofing</Badge>
                            <Badge variant="secondary" className="text-[10px]">HVAC</Badge>
                            <Badge variant="secondary" className="text-[10px]">+12</Badge>
                          </div>
                        </Card>

                        <Card className="glass-card p-6 cursor-pointer h-full glass-hover" onClick={() => handleNavClick('contractors-browse')}>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 rounded-xl bg-secondary">
                              <Hammer className="w-7 h-7 text-white" weight="fill" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Network</p>
                              <p className="text-2xl font-bold">3.5K+</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold mb-1">Verified Contractors</p>
                          <p className="text-xs text-muted-foreground mb-2">Browse professional profiles</p>
                          <div className="flex items-center gap-1 mt-2 text-xs">
                            <CheckCircle className="w-3 h-3 text-secondary" weight="fill" />
                            <span className="text-muted-foreground">View ratings & reviews</span>
                          </div>
                        </Card>

                        <Card className="glass-card p-6 cursor-pointer h-full glass-hover" onClick={() => handleNavClick('api')}>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 rounded-xl bg-primary">
                              <CurrencyDollar className="w-7 h-7 text-white" weight="fill" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Starting at</p>
                              <p className="text-2xl font-bold">$99</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold mb-1">API Access</p>
                          <p className="text-xs text-muted-foreground mb-2">Intelligence & pricing endpoints</p>
                          <div className="flex items-center gap-1 mt-2 text-xs">
                            <Lightning className="w-3 h-3 text-primary" weight="fill" />
                            <span className="text-muted-foreground">Real-time data</span>
                          </div>
                        </Card>
                      </StaggeredContainer>

                      <SectionReveal delay={0.1}>
                        <TerritoryTeaser onExplore={() => handleNavClick('territories', 'overview')} />
                      </SectionReveal>
                      
                      <SectionReveal delay={0.15}>
                        <Card className="glass-card p-8 border-2 border-primary/20">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <SlideInFromLeft>
                              <div>
                                <HeadlineReveal>
                                  <h3 className="text-2xl font-bold mb-2">Zero Fees for Contractors</h3>
                                </HeadlineReveal>
                                <Badge variant="secondary" className="mb-4">100% Earnings Guarantee</Badge>
                                <p className="text-muted-foreground mb-6">
                                  Unlike other platforms that charge 15-30% fees, FairTradeWorker contractors keep 100% of their job earnings. Territory operators pay $45/month for exclusive lead rights in their area to fund the platform. Homeowners pay a one-time $20 platform fee per job.
                                </p>
                                <StaggeredContainer staggerDelay={0.1} className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" weight="fill" />
                                    <div>
                                      <p className="text-sm font-semibold">No platform fees for contractors</p>
                                      <p className="text-xs text-muted-foreground">Never lose a percentage of your earnings</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" weight="fill" />
                                    <div>
                                      <p className="text-sm font-semibold">Keep 100% of job payments</p>
                                      <p className="text-xs text-muted-foreground">Full payment released upon completion</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" weight="fill" />
                                    <div>
                                      <p className="text-sm font-semibold">Instant payouts available</p>
                                      <p className="text-xs text-muted-foreground">Get paid immediately after job approval</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" weight="fill" />
                                    <div>
                                      <p className="text-sm font-semibold">Secure escrow protection</p>
                                      <p className="text-xs text-muted-foreground">Funds guaranteed before starting work</p>
                                    </div>
                                  </div>
                                </StaggeredContainer>
                                <CTAReveal delay={0.4}>
                                  <Button size="lg" className="mt-6" onClick={() => handleNavClick('contractor', 'dashboard')}>
                                    Join as Contractor
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                  </Button>
                                </CTAReveal>
                              </div>
                            </SlideInFromLeft>
                            <SlideInFromRight delay={0.2}>
                              <div className="bg-white rounded-2xl p-6 shadow-2xl border-2 border-muted">
                                <h4 className="font-bold mb-2 text-center">$10,000 Job Payment Example</h4>
                                <p className="text-xs text-muted-foreground text-center mb-4">How the money flows</p>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div>
                                      <span className="text-sm font-semibold">Job Payment</span>
                                      <p className="text-xs text-muted-foreground">From homeowner</p>
                                    </div>
                                    <span className="font-bold">$10,000</span>
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div>
                                      <span className="text-sm font-semibold">Platform Fee</span>
                                      <p className="text-xs text-muted-foreground">One-time charge</p>
                                    </div>
                                    <span className="font-bold text-blue-600">$20</span>
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border-2 border-secondary/30">
                                    <div>
                                      <span className="text-sm font-semibold">Contractor Receives</span>
                                      <p className="text-xs text-muted-foreground">100% of job amount</p>
                                    </div>
                                    <span className="font-bold text-secondary text-lg">$10,000</span>
                                  </div>
                                </div>
                                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                                  <p className="text-xs text-muted-foreground">
                                    <span className="font-semibold text-foreground">Territory operators</span> separately pay $45/month for exclusive lead rights in their area. This monthly fee funds platform operations.
                                  </p>
                                </div>
                              </div>
                            </SlideInFromRight>
                          </div>
                        </Card>
                      </SectionReveal>
                    </div>
                  )}
                  {activeTab === 'jobs' && <JobBrowser />}
                  {activeTab === 'contractors-browse' && <ContractorBrowser />}
                  {activeTab === 'homeowner' && currentUser && <HomeownerDashboard user={currentUser} activeSubTab={activeSubTab} />}
                  {activeTab === 'territories' && activeSubTab === 'overview' && (
                    <TerritoriesOverview 
                      onNavigateToDetail={(stateCode) => {
                        setActiveSubTab(null);
                      }}
                    />
                  )}
                  {activeTab === 'territories' && activeSubTab !== 'overview' && <TerritoryMapPage />}
                  {activeTab === 'contractor' && <ContractorDashboard user={currentUser || undefined} subTab={activeSubTab} />}
                  {activeTab === 'subcontractor' && <ContractorDashboard user={currentUser || undefined} subTab={activeSubTab} />}
                  {activeTab === 'messages' && <MessagesView userId={currentUser?.id || ''} />}
                  {activeTab === 'api' && <IntelligenceAPIManager userId={currentUser?.id || ''} />}
                  {activeTab === 'partners' && <PartnerDashboard activeSubTab={activeSubTab} />}
                  {activeTab === 'warranty' && activeSubTab === 'file-claim' && <FileAClaim />}
                  {activeTab === 'warranty' && activeSubTab !== 'file-claim' && (
                    <WarrantySection onFileClaimClick={() => handleNavClick('warranty', 'file-claim')} />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <LegalFooter />
      {paymentJobData && (
        <PaymentModal
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          amount={paymentJobData.amount}
          jobTitle={paymentJobData.title}
          onPaymentComplete={() => {
            setShowPaymentModal(false);
            setPaymentJobData(null);
          }}
        />
      )}
      {showAdminPanel && currentUser?.role === 'admin' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="border-t-2 border-primary/20 bg-muted/20"
        >
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary">
                  <ChartBar className="w-6 h-6 text-white" weight="fill" />
                </div>
                <h2 className="text-2xl font-bold">Admin Dashboard - Platform Analytics</h2>
              </div>
              <p className="text-muted-foreground">Platform analytics, learning metrics, and performance</p>
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
