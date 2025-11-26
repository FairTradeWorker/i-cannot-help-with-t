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
import { AdminLearningDashboard } from '@/components/AdminDashboard/AdminLearningDashboard';
import { TerritoryTeaser } from '@/components/TerritoryTeaser';
import { PriorityLeadsVisual } from '@/components/PriorityLeadsVisual';
import { PaymentModal } from '@/components/PaymentModal';
import { PaymentScreen } from '@/components/PaymentScreen';
import { IntelligenceAPIManager } from '@/components/IntelligenceAPI/IntelligenceAPIManager';
import { WarrantySection } from '@/components/WarrantySection';
import { FileAClaim } from '@/components/FileAClaim';
import { UnifiedJobPost } from '@/components/UnifiedJobPost';
import { NotificationsPage } from '@/components/NotificationsPage';
import { dataStore } from '@/lib/store';
import { initializeDemoData } from '@/lib/demo-data';
import { toast, Toaster } from 'sonner';
import type { User as UserType, Referral, Analytics } from '@/lib/types';

type MainTab = 'home' | 'territories' | 'jobs' | 'homeowner' | 'contractor' | 'subcontractor' | 'api' | 'warranty' | 'partners' | 'messages' | 'payment' | 'notifications' | 'intelligence' | 'browse-jobs';
type SubTab = 'overview' | 'file-claim' | 'materials' | 'insurance' | 'my-jobs' | 'post-job' | 'profile' | 'dashboard' | 'route' | 'jobs';

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
    
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('⏱️ Loading timeout - forcing login screen');
        setLoading(false);
        setShowLogin(true);
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, []);

  const initialize = async () => {
    try {
      console.log('🚀 Initializing app...');
      await initializeDemoData();
      console.log('✅ Demo data initialized');
      
      const user = await dataStore.getCurrentUser();
      console.log('👤 Current user from storage:', user ? `${user.id} (${user.role})` : 'none');
      
      if (!user) {
        console.log('ℹ️ No user found, showing login screen');
        setShowLogin(true);
      } else {
        console.log('✅ User found, setting current user');
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('❌ Initialization error:', error);
      setShowLogin(true);
    } finally {
      console.log('✅ Initialization complete, loading = false');
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string, role: 'homeowner' | 'contractor' | 'subcontractor') => {
    try {
      console.log('🔐 Login attempt:', { email, role });
      const users = await dataStore.getUsers();
      console.log('👥 Found users:', users.length);
      let user = users.find(u => u.email === email);
      
      if (!user) {
        console.log('❌ User not found, creating new user');
        user = {
          id: 'user-' + Date.now(),
          role: role,
          email: email,
          name: email.split('@')[0],
          createdAt: new Date(),
        };
        await dataStore.saveUser(user);
        console.log('✅ New user saved:', user.id);
      } else {
        console.log('✅ User found:', user.id, user.role);
      }
      
      await dataStore.setCurrentUser(user);
      console.log('✅ Current user set in storage');
      
      setCurrentUser(user);
      console.log('✅ Current user set in state');
      
      setShowLogin(false);
      console.log('✅ Login modal closed');
      
      toast.success(`Welcome back, ${user.name}!`);
      console.log('✅ Login complete');
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('Failed to sign in. Please try again.');
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, role: 'homeowner' | 'contractor' | 'subcontractor') => {
    try {
      console.log('📝 Sign up attempt:', { email, role });
      const newUser: UserType = {
        id: 'user-' + Date.now(),
        role: role,
        email: email,
        name: email.split('@')[0],
        createdAt: new Date(),
      };
      
      await dataStore.saveUser(newUser);
      console.log('✅ New user saved:', newUser.id);
      
      await dataStore.setCurrentUser(newUser);
      console.log('✅ Current user set in storage');
      
      setCurrentUser(newUser);
      console.log('✅ Current user set in state');
      
      setShowLogin(false);
      console.log('✅ Sign up modal closed');
      
      toast.success(`Welcome, ${newUser.name}!`);
      console.log('✅ Sign up complete');
    } catch (error) {
      console.error('❌ Sign up error:', error);
      toast.error('Failed to create account. Please try again.');
      throw error;
    }
  };

  const handleNavClick = (tab: MainTab, subTab?: SubTab) => {
    setActiveTab(tab);
    setActiveSubTab(subTab || null);
    setShowAdminPanel(false);
    setShowProfile(false);
    setShowJobPost(false);
  };

  const handleCreateJob = () => {
    setActiveTab('homeowner');
    setActiveSubTab('post-job');
  };

  const handleLogout = async () => {
    await window.spark.kv.delete('current-user');
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
      <Toaster position="top-right" richColors />
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
        className="sticky top-0 z-50 glass-card border-b border-border/50"
      >
        <div className="w-full px-6 pt-2">
          <div className="flex items-center h-16 py-2 max-w-[1920px] mx-auto" style={{ paddingLeft: '2rem' }}>
            <nav className="flex items-center gap-2 flex-1">
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
                  Home
                </Button>
              </motion.div>

              {currentUser?.role !== 'homeowner' && (
                <Button
                  variant={activeTab === 'territories' ? 'default' : 'ghost'}
                  onClick={() => handleNavClick('territories', 'overview')}
                  className="button-interactive"
                  size="sm"
                >
                  Territories
                </Button>
              )}

              {currentUser?.role !== 'homeowner' && (
                <Button
                  variant={activeTab === 'jobs' ? 'default' : 'ghost'}
                  onClick={() => handleNavClick('jobs')}
                  className="button-interactive"
                  size="sm"
                >
                  Jobs
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={activeTab === 'contractor' ? 'default' : 'ghost'}
                    className="button-interactive"
                    size="sm"
                  >
                    <Hammer className="w-4 h-4 mr-1.5" weight={activeTab === 'contractor' ? 'fill' : 'regular'} />
                    Contractor
                    <CaretDown className="w-3 h-3 ml-1" />
                  </Button>
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
            </nav>

            <div className="absolute left-1/2 -translate-x-1/2">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Button
                  size="default"
                  onClick={() => handleNavClick('homeowner', 'post-job')}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg font-bold px-6"
                >
                  <Plus className="w-4 h-4 mr-1.5" weight="bold" />
                  Post a Job
                </Button>
              </motion.div>
            </div>

            <nav className="flex items-center gap-2 flex-1 justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={activeTab === 'homeowner' ? 'default' : 'ghost'}
                    className="button-interactive"
                    size="sm"
                  >
                    <House className="w-4 h-4 mr-1.5" weight={activeTab === 'homeowner' ? 'fill' : 'regular'} />
                    Homeowner
                    <CaretDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-card border-border/50">
                  <DropdownMenuItem onClick={() => handleNavClick('homeowner', 'profile')}>
                    <UserCircle className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('homeowner', 'my-jobs')}>
                    <Package className="w-4 h-4 mr-2" />
                    Job Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('homeowner', 'post-job')}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Post a Job
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
                  <DropdownMenuItem onClick={() => handleNavClick('intelligence')}>
                    <Brain className="w-4 h-4 mr-2" />
                    Intelligence API
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
              className="hover:bg-black/90 shadow-lg font-black uppercase px-6 h-12 border-2 ml-4 text-slate-50 bg-blue-800 border-blue-700"
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
                <Brain className="w-4 h-4 mr-1.5" weight={activeTab === 'api' ? 'fill' : 'regular'} />
                API
              </Button>

              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Button
                  variant={activeTab === 'warranty' ? 'default' : 'ghost'}
                  onClick={() => handleNavClick('warranty')}
                  className="button-interactive"
                  size="sm"
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5" weight={activeTab === 'warranty' ? 'fill' : 'regular'} />
                  Warranty
                </Button>
              </motion.div>
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
                  className="button-interactive relative h-8 w-8"
                  size="icon"
                >
                  <ChatCircle className="w-3.5 h-3.5" weight={activeTab === 'messages' ? 'fill' : 'regular'} />
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-accent rounded-full" />
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
                    setActiveTab('homeowner');
                    setActiveSubTab('post-job');
                    setShowProfile(false);
                    setShowAdminPanel(false);
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
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
                  onCancel={() => {
                    setShowJobPost(false);
                    setActiveTab('homeowner');
                    setActiveSubTab('post-job');
                  }}
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
                      <Card className="glass-card p-6 cursor-pointer border-2 border-primary/20 hover:border-primary transition-all relative overflow-hidden group" onClick={handleCreateJob}>
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                            <motion.div 
                              className="p-4 rounded-xl bg-primary"
                              whileHover={{ scale: 1.05, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Plus className="w-8 h-8 text-white" weight="bold" />
                            </motion.div>
                            <div>
                              <h3 className="text-xl font-bold mb-1">Post a New Job</h3>
                              <p className="text-sm text-muted-foreground">Get estimates from qualified contractors in your area</p>
                            </div>
                          </div>
                          <Button size="lg" className="group-hover:scale-105 transition-transform">
                            Get Started
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </Card>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="glass-card p-6 cursor-pointer h-full glass-hover" onClick={() => handleNavClick('territories', 'overview')}>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 rounded-xl bg-primary">
                              <MapTrifold className="w-7 h-7 text-white" weight="fill" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold mb-1">Territories</p>
                              <p className="text-xs text-muted-foreground mb-2">$45/month • Exclusive lead rights</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                <Badge variant="outline" className="text-[10px]">CA</Badge>
                                <Badge variant="outline" className="text-[10px]">TX</Badge>
                                <Badge variant="outline" className="text-[10px]">FL</Badge>
                                <Badge variant="outline" className="text-[10px]">+47 states</Badge>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {currentUser?.role !== 'homeowner' && (
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
                        )}

                        <Card className="glass-card p-6 cursor-pointer h-full glass-hover" onClick={() => handleNavClick('contractor', 'dashboard')}>
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
                          <p className="text-xs text-muted-foreground mb-2">Join our professional network</p>
                          <div className="flex items-center gap-1 mt-2 text-xs">
                            <CheckCircle className="w-3 h-3 text-secondary" weight="fill" />
                            <span className="text-muted-foreground">Zero platform fees</span>
                          </div>
                        </Card>
                      </div>

                      <PriorityLeadsVisual onExplore={() => handleNavClick('territories', 'overview')} />
                      
                      <Card className="glass-card p-10 border-2 border-primary/20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                          <div>
                            <h3 className="text-3xl font-bold mb-3">Zero Fees for Contractors</h3>
                            <Badge variant="secondary" className="mb-6 text-sm px-3 py-1">100% Earnings Guarantee</Badge>
                            <p className="text-muted-foreground mb-8 text-base leading-relaxed">
                              Unlike other platforms that charge 15-30% fees, ServiceHub contractors keep 100% of their job earnings. Territory operators pay $45/month for exclusive lead rights in their area to fund the platform. Homeowners pay a one-time $10 platform fee per job.
                            </p>
                            <div className="space-y-5">
                              <div className="flex items-start gap-4">
                                <CheckCircle className="w-7 h-7 text-secondary flex-shrink-0 mt-0.5" weight="fill" />
                                <div>
                                  <p className="text-base font-semibold mb-1">No platform fees for contractors</p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">Never lose a percentage of your earnings</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-4">
                                <CheckCircle className="w-7 h-7 text-secondary flex-shrink-0 mt-0.5" weight="fill" />
                                <div>
                                  <p className="text-base font-semibold mb-1">Keep 100% of job payments</p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">Full payment released upon completion</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-4">
                                <CheckCircle className="w-7 h-7 text-secondary flex-shrink-0 mt-0.5" weight="fill" />
                                <div>
                                  <p className="text-base font-semibold mb-1">Instant payouts available</p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">Get paid immediately after job approval</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-4">
                                <CheckCircle className="w-7 h-7 text-secondary flex-shrink-0 mt-0.5" weight="fill" />
                                <div>
                                  <p className="text-base font-semibold mb-1">Secure escrow protection</p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">Funds guaranteed before starting work</p>
                                </div>
                              </div>
                            </div>
                            <Button size="lg" className="mt-8" onClick={() => handleNavClick('contractor', 'dashboard')}>
                              Join as Contractor
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                          </div>
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
                                <span className="font-bold text-blue-600">$10</span>
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
                        </div>
                      </Card>

                      <Card className="glass-card p-8 col-span-full">
                        <h3 className="text-2xl font-bold mb-6 text-center">Services We Support</h3>
                        <p className="text-center text-muted-foreground mb-8">ServiceHub connects you with verified professionals across all major home service trades</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {[
                            'Roofing', 'HVAC', 'Plumbing', 'Electrical',
                            'Landscaping', 'Painting', 'Carpentry', 'Masonry',
                            'Flooring', 'Windows & Doors', 'Siding', 'Gutters',
                            'Fencing', 'Decking', 'Concrete', 'Drywall',
                            'Insulation', 'Foundation Repair', 'Pool Service', 'Pest Control',
                            'Tree Service', 'Snow Removal', 'Garage Doors', 'Solar Installation',
                            'Demolition', 'Waterproofing', 'Septic Systems', 'Well Drilling',
                            'Chimney Service', 'Appliance Repair', 'Home Theater', 'Smart Home'
                          ].map((service) => (
                            <div
                              key={service}
                              className="p-3 rounded-lg bg-muted/50 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all text-center"
                            >
                              <span className="text-sm font-medium">{service}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 text-center">
                          <Button variant="outline" onClick={() => handleNavClick('browse-jobs')}>
                            View All Service Categories
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}
                  {activeTab === 'jobs' && <JobBrowser />}
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
