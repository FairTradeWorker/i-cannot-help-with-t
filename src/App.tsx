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
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { TerritoryMapPage } from '@/components/TerritoryMapPage';
import { TerritoriesOverview } from '@/components/TerritoriesOverview';
import { ReferralSystem } from '@/components/ReferralSystem';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { PaymentManagement } from '@/components/PaymentManagement';
import { PartnerDashboard } from '@/components/PartnerDashboard';
import { JobBrowser } from '@/components/JobBrowser';
import { ContractorDashboard } from '@/components/ContractorDashboard';
import { QuickJobPost } from '@/components/QuickJobPost';
import { VideoJobCreator } from '@/components/VideoJobCreator';
import { AdminLearningDashboard } from '@/components/AdminDashboard/AdminLearningDashboard';
import { TerritoryTeaser } from '@/components/TerritoryTeaser';
import { TerritoryMiniMap } from '@/components/TerritoryMiniMap';
import { PaymentModal } from '@/components/PaymentModal';
import { PaymentScreen } from '@/components/PaymentScreen';
import { LocationJobBrowser } from '@/components/LocationJobBrowser';
import { IntelligenceAPIManager } from '@/components/IntelligenceAPI/IntelligenceAPIManager';
import { dataStore } from '@/lib/store';
import { initializeDemoData } from '@/lib/demo-data';
import { toast } from 'sonner';
import type { User as UserType, Referral, Analytics } from '@/lib/types';

type MainTab = 'home' | 'territories' | 'browse-jobs' | 'homeowner' | 'contractor' | 'subcontractor' | 'intelligence' | 'messages' | 'partners' | 'referral' | 'payment';
type SubTab = 'overview' | 'browse' | 'payment' | 'materials' | 'insurance' | 'ai' | 'private_equity' | 'real_estate' | 'contact' | 'analytics' | 'program' | 'my_referrals' | 'dashboard' | 'jobs' | 'route' | 'earnings' | 'my-jobs' | 'post-job';

function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [activeSubTab, setActiveSubTab] = useState<SubTab | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showVideoCreator, setShowVideoCreator] = useState(false);
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
    setShowVideoCreator(false);
  };

  const handleCreateJob = (type: 'video' | 'photo' | 'text') => {
    if (type === 'video') {
      setShowVideoCreator(true);
    } else {
      setPaymentJobData({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Job Post`,
        amount: 3500
      });
      setShowPaymentModal(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLogin(true);
    setActiveTab('home');
    setActiveSubTab(null);
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
          <p className="text-sm text-muted-foreground font-medium">Loading ServiceHub...</p>
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
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-16 py-2 max-w-[1920px] mx-auto">
            <nav className="flex items-center gap-2 flex-1 justify-center">
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Button
                  variant={activeTab === 'home' ? 'default' : 'ghost'}
                  onClick={() => handleNavClick('home')}
                  className="button-interactive"
                  size="sm"
                >
                  <House className="w-4 h-4 mr-1.5" weight={activeTab === 'home' ? 'fill' : 'regular'} />
                  Home
                </Button>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Button
                  variant={activeTab === 'territories' ? 'default' : 'ghost'}
                  onClick={() => handleNavClick('territories', 'overview')}
                  className="button-interactive"
                  size="sm"
                >
                  <MapTrifold className="w-4 h-4 mr-1.5" weight={activeTab === 'territories' ? 'fill' : 'regular'} />
                  Territories
                </Button>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Button
                  variant={activeTab === 'browse-jobs' ? 'default' : 'ghost'}
                  onClick={() => handleNavClick('browse-jobs')}
                  className="button-interactive"
                  size="sm"
                >
                  <Briefcase className="w-4 h-4 mr-1.5" weight={activeTab === 'browse-jobs' ? 'fill' : 'regular'} />
                  Jobs
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
                      variant={activeTab === 'homeowner' ? 'default' : 'ghost'}
                      className="button-interactive"
                      size="sm"
                    >
                      <House className="w-4 h-4 mr-1.5" weight={activeTab === 'homeowner' ? 'fill' : 'regular'} />
                      Homeowner
                      <CaretDown className="w-3 h-3 ml-1" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-card border-border/50">
                  <DropdownMenuItem onClick={() => handleNavClick('homeowner', 'my-jobs')}>
                    <Package className="w-4 h-4 mr-2" />
                    My Jobs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('homeowner', 'post-job')}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Post New Job
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
                  >
                    <Button
                      variant={activeTab === 'contractor' ? 'default' : 'ghost'}
                      className="button-interactive"
                      size="sm"
                    >
                      <Hammer className="w-4 h-4 mr-1.5" weight={activeTab === 'contractor' ? 'fill' : 'regular'} />
                      Contractor
                      <CaretDown className="w-3 h-3 ml-1" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-card border-border/50">
                  <DropdownMenuItem onClick={() => handleNavClick('contractor', 'dashboard')}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('contractor', 'jobs')}>
                    <Package className="w-4 h-4 mr-2" />
                    My Jobs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('contractor', 'route')}>
                    <MapPin className="w-4 h-4 mr-2" />
                    Route Planner
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
                  >
                    <Button
                      variant={activeTab === 'subcontractor' ? 'default' : 'ghost'}
                      className="button-interactive"
                      size="sm"
                    >
                      <HardHat className="w-4 h-4 mr-1.5" weight={activeTab === 'subcontractor' ? 'fill' : 'regular'} />
                      Sub
                      <CaretDown className="w-3 h-3 ml-1" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-card border-border/50">
                  <DropdownMenuItem onClick={() => handleNavClick('subcontractor', 'dashboard')}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('subcontractor', 'browse')}>
                    <MapPin className="w-4 h-4 mr-2" />
                    Browse Local Jobs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Button
                  variant={activeTab === 'intelligence' ? 'default' : 'ghost'}
                  onClick={() => handleNavClick('intelligence')}
                  className="button-interactive"
                  size="sm"
                >
                  <Lightning className="w-4 h-4 mr-1.5" weight={activeTab === 'intelligence' ? 'fill' : 'regular'} />
                  API
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
                      variant={activeTab === 'partners' ? 'default' : 'ghost'}
                      className="button-interactive"
                      size="sm"
                    >
                      <Handshake className="w-4 h-4 mr-1.5" weight={activeTab === 'partners' ? 'fill' : 'regular'} />
                      Partners
                      <CaretDown className="w-3 h-3 ml-1" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-card border-border/50">
                  <DropdownMenuItem onClick={() => handleNavClick('partners', undefined)}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Overview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('partners', 'materials')}>
                    <Package className="w-4 h-4 mr-2" />
                    Materials Vendors
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('partners', 'insurance')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Insurance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('partners', 'ai')}>
                    <Brain className="w-4 h-4 mr-2" />
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
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
                  >
                    <Button
                      variant={activeTab === 'referral' ? 'default' : 'ghost'}
                      className="button-interactive"
                      size="sm"
                    >
                      <Gift className="w-4 h-4 mr-1.5" weight={activeTab === 'referral' ? 'fill' : 'regular'} />
                      Referral
                      <CaretDown className="w-3 h-3 ml-1" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-card border-border/50">
                  <DropdownMenuItem onClick={() => handleNavClick('referral', 'program')}>
                    <Gift className="w-4 h-4 mr-2" />
                    Program Info
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('referral', 'my_referrals')}>
                    <Users className="w-4 h-4 mr-2" />
                    My Referrals
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
                <Button variant="ghost" size="icon" className="button-interactive relative h-8 w-8">
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
                      <CaretDown className="w-3 h-3" />
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
                  <DropdownMenuItem onClick={() => {
                    setActiveTab('home');
                    setActiveSubTab(null);
                    setShowProfile(false);
                    setShowAdminPanel(false);
                  }}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Post a Job
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
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                  {activeTab === 'payment' && <PaymentScreen onPaymentComplete={() => {
                    setActiveTab('home');
                    toast.success('Payment completed successfully!');
                  }} />}
                  {activeTab === 'home' && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <QuickJobPost onCreateJob={handleCreateJob} />
                        </div>
                        <div>
                          <TerritoryMiniMap onStateClick={(stateCode) => handleNavClick('territories', 'overview')} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.div
                          whileHover={{ y: -8 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ duration: 0.28, ease: [0.34, 1.25, 0.64, 1] }}
                        >
                          <Card className="glass-card p-6 cursor-pointer h-full" onClick={() => handleNavClick('territories', 'overview')}>
                            <div className="flex items-center gap-4 mb-3">
                              <div className="p-3 rounded-xl bg-primary">
                                <MapTrifold className="w-7 h-7 text-white" weight="fill" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Available</p>
                                <p className="text-2xl font-bold">850+</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold">Territories</p>
                            <p className="text-xs text-muted-foreground">First 10 FREE • Then $124.99 each</p>
                          </Card>
                        </motion.div>

                        <motion.div
                          whileHover={{ y: -8 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ duration: 0.28, ease: [0.34, 1.25, 0.64, 1] }}
                        >
                          <Card className="glass-card p-6 cursor-pointer h-full" onClick={() => handleNavClick('browse-jobs')}>
                            <div className="flex items-center gap-4 mb-3">
                              <div className="p-3 rounded-xl bg-accent">
                                <Briefcase className="w-7 h-7 text-white" weight="fill" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Active</p>
                                <p className="text-2xl font-bold">2.8K+</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold">Jobs Available</p>
                            <p className="text-xs text-muted-foreground">Browse opportunities now</p>
                          </Card>
                        </motion.div>

                        <motion.div
                          whileHover={{ y: -8 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ duration: 0.28, ease: [0.34, 1.25, 0.64, 1] }}
                        >
                          <Card className="glass-card p-6 cursor-pointer h-full" onClick={() => handleNavClick('contractor', 'dashboard')}>
                            <div className="flex items-center gap-4 mb-3">
                              <div className="p-3 rounded-xl bg-secondary">
                                <Hammer className="w-7 h-7 text-white" weight="fill" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Network</p>
                                <p className="text-2xl font-bold">3.5K+</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold">Contractors</p>
                            <p className="text-xs text-muted-foreground">Join our network</p>
                          </Card>
                        </motion.div>

                        <motion.div
                          whileHover={{ y: -8 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ duration: 0.28, ease: [0.34, 1.25, 0.64, 1] }}
                        >
                          <Card className="glass-card p-6 cursor-pointer h-full" onClick={() => handleNavClick('intelligence')}>
                            <div className="flex items-center gap-4 mb-3">
                              <div className="p-3 rounded-xl bg-primary">
                                <Brain className="w-7 h-7 text-white" weight="fill" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Accuracy</p>
                                <p className="text-2xl font-bold">94.5%</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold">AI Accuracy</p>
                            <p className="text-xs text-muted-foreground">Self-learning platform</p>
                          </Card>
                        </motion.div>
                      </div>

                      <TerritoryTeaser onExplore={() => handleNavClick('territories', 'overview')} />
                      
                      <Card className="glass-card p-8 border-2 border-primary/20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                          <div>
                            <h3 className="text-2xl font-bold mb-4">Zero Fees for Contractors</h3>
                            <p className="text-muted-foreground mb-6">
                              Unlike other platforms, we don't charge contractors any fees. Territory operators fund the platform through 8% revenue share, so you keep 100% of your earnings.
                            </p>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" weight="fill" />
                                <p className="text-sm">No platform fees ever</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" weight="fill" />
                                <p className="text-sm">Keep 100% of your earnings</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" weight="fill" />
                                <p className="text-sm">Instant payouts available</p>
                              </div>
                            </div>
                            <Button size="lg" className="mt-6" onClick={() => handleNavClick('contractor', 'dashboard')}>
                              Join as Contractor
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                          </div>
                          <div className="bg-white rounded-2xl p-6 shadow-2xl">
                            <h4 className="font-bold mb-4 text-center">Payment Breakdown</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <span className="text-sm">Job Payment</span>
                                <span className="font-bold">$10,000</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm">Territory Fee (8%)</span>
                                <span className="font-bold text-blue-600">-$800</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                                <span className="text-sm font-semibold">You Receive</span>
                                <span className="font-bold text-accent text-lg">$9,200</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                  {activeTab === 'browse-jobs' && <JobBrowser />}
                  {activeTab === 'homeowner' && <QuickJobPost onCreateJob={handleCreateJob} />}
                  {activeTab === 'territories' && activeSubTab === 'overview' && (
                    <TerritoriesOverview 
                      onNavigateToDetail={(stateCode) => {
                        setActiveSubTab(null);
                      }}
                    />
                  )}
                  {activeTab === 'territories' && activeSubTab !== 'overview' && <TerritoryMapPage />}
                  {activeTab === 'contractor' && <ContractorDashboard user={currentUser || undefined} subTab={activeSubTab} />}
                  {activeTab === 'subcontractor' && activeSubTab === 'browse' && <LocationJobBrowser userId={currentUser?.id} />}
                  {activeTab === 'subcontractor' && activeSubTab !== 'browse' && <ContractorDashboard user={currentUser || undefined} subTab={activeSubTab} isSubcontractor />}
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
          className="border-t-2 border-primary/20 bg-gradient-to-b from-background to-muted/20"
        >
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary">
                  <Brain className="w-6 h-6 text-white" weight="fill" />
                </div>
                <h2 className="text-2xl font-bold">Admin Dashboard - Intelligence & Learning</h2>
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
