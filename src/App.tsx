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
  SignIn,
  UserPlus,
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
  List,
  VideoCamera,
  Clock,
  Star,
  CheckCircle as CheckCircleIcon,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LegalFooter } from '@/components/LegalFooter';
import { LoginModal } from '@/components/LoginModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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
import { JobsTab } from '@/components/JobsTab';
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
import { DispatchMap } from '@/components/DispatchMap';
import { TerritoryMiniMap } from '@/components/TerritoryMiniMap';
import { SubcontractorDashboard } from '@/components/SubcontractorDashboard';
import { ServiceCategoriesShowcase } from '@/components/ServiceCategoriesShowcase';
import { ServiceCategoryMegaMenu } from '@/components/ServiceCategoryMegaMenu';
import type { ServiceSelection } from '@/types/service-categories';
import { dataStore } from '@/lib/store';
import { initializeDemoData } from '@/lib/demo-data';
import { toast } from 'sonner';
import type { User as UserType, Referral, Analytics } from '@/lib/types';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getAvailableTerritoryCount, getStateStats } from '@/lib/territory-data';

type MainTab = 'home' | 'territories' | 'jobs' | 'contractors-browse' | 'homeowner' | 'contractor' | 'subcontractor' | 'api' | 'warranty' | 'partners' | 'messages' | 'payment' | 'notifications' | 'dispatch';
type SubTab = 'overview' | 'file-claim' | 'materials' | 'insurance' | 'my-jobs' | 'post-job' | 'profile' | 'dashboard' | 'route';

function App() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [activeSubTab, setActiveSubTab] = useState<SubTab | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showJobPost, setShowJobPost] = useState(false);
  const [showServiceMenu, setShowServiceMenu] = useState(false);
  const [preselectedCategoryId, setPreselectedCategoryId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentJobData, setPaymentJobData] = useState<{ title: string; amount: number } | null>(null);
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'signup'>('login');
  const [pendingServiceSelection, setPendingServiceSelection] = useState<ServiceSelection | null>(null);

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
    
    // Allow users to browse without logging in
    if (user) {
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
    if (isMobile) {
      setMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

  const handleCreateJob = (selection?: ServiceSelection) => {
    // Require authentication to post a job
    if (!currentUser) {
      setLoginModalMode('signup');
      setShowLogin(true);
      if (selection) {
        setPendingServiceSelection(selection);
      }
      return;
    }
    if (selection) {
      setPendingServiceSelection(selection);
    }
    setShowJobPost(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    // Don't force login after logout - allow browsing
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

  return (
    <div className="min-h-screen flex flex-col">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
        className="sticky top-0 z-50 glass-card border-b border-border/50"
      >
        <div className="w-full px-4 md:px-6">
          <div className="flex items-center h-14 md:h-16 py-2 max-w-[1800px] mx-auto gap-2 md:gap-4">
            {/* Mobile Hamburger Menu */}
            {isMobile && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <List className="w-6 h-6" weight="bold" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col p-4 gap-2">
                    <Button
                      variant={activeTab === 'home' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('home')}
                      className="justify-start w-full h-12"
                    >
                      <House className="w-5 h-5 mr-3" />
                      Home
                    </Button>
                    <Button
                      variant={activeTab === 'territories' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('territories', 'overview')}
                      className="justify-start w-full h-12"
                    >
                      <MapTrifold className="w-5 h-5 mr-3" />
                      Territories
                    </Button>
                    <Button
                      variant={activeTab === 'jobs' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('jobs')}
                      className="justify-start w-full h-12"
                    >
                      <Briefcase className="w-5 h-5 mr-3" />
                      Jobs
                    </Button>
                    
                    <div className="border-t my-2" />
                    
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                      Homeowners
                    </div>
                    <Button
                      variant={activeTab === 'homeowner' && activeSubTab === 'profile' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('homeowner', 'profile')}
                      className="justify-start w-full h-12 pl-8"
                    >
                      Profile
                    </Button>
                    <Button
                      variant={activeTab === 'homeowner' && activeSubTab === 'my-jobs' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('homeowner', 'my-jobs')}
                      className="justify-start w-full h-12 pl-8"
                    >
                      My Jobs
                    </Button>
                    
                    <div className="border-t my-2" />
                    
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                      For Pros
                    </div>
                    <Button
                      variant={activeTab === 'contractors-browse' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('contractors-browse')}
                      className="justify-start w-full h-12 pl-8"
                    >
                      Browse Contractors
                    </Button>
                    <div className="px-3 py-2 text-xs text-muted-foreground pl-8">
                      Contractor
                    </div>
                    <Button
                      variant={activeTab === 'contractor' && activeSubTab === 'dashboard' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('contractor', 'dashboard')}
                      className="justify-start w-full h-12 pl-12"
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant={activeTab === 'contractor' && activeSubTab === 'my-jobs' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('contractor', 'my-jobs')}
                      className="justify-start w-full h-12 pl-12"
                    >
                      My Estimates
                    </Button>
                    <Button
                      variant={activeTab === 'contractor' && activeSubTab === 'route' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('contractor', 'route')}
                      className="justify-start w-full h-12 pl-12"
                    >
                      Route Planner
                    </Button>
                    <Button
                      variant={activeTab === 'dispatch' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('dispatch')}
                      className="justify-start w-full h-12 pl-12"
                    >
                      Dispatch Map
                    </Button>
                    <div className="px-3 py-2 text-xs text-muted-foreground pl-8">
                      Subcontractor
                    </div>
                    <Button
                      variant={activeTab === 'subcontractor' && activeSubTab === 'dashboard' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('subcontractor', 'dashboard')}
                      className="justify-start w-full h-12 pl-12"
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant={activeTab === 'subcontractor' && activeSubTab === 'my-jobs' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('subcontractor', 'my-jobs')}
                      className="justify-start w-full h-12 pl-12"
                    >
                      My Estimates
                    </Button>
                    <Button
                      variant={activeTab === 'subcontractor' && activeSubTab === 'route' ? 'default' : 'ghost'}
                      onClick={() => handleNavClick('subcontractor', 'route')}
                      className="justify-start w-full h-12 pl-12"
                    >
                      Route Planner
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
            
            {/* LEFT SIDE NAVIGATION */}
            <nav className="hidden md:flex items-center gap-1.5">
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={activeTab === 'homeowner' ? 'default' : 'ghost'}
                    className="button-interactive"
                    size="sm"
                  >
                    Homeowners
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
                    variant={activeTab === 'contractor' || activeTab === 'subcontractor' || activeTab === 'contractors-browse' ? 'default' : 'ghost'}
                    className="button-interactive"
                    size="sm"
                  >
                    For Pros
                    <CaretDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-2 border-black">
                  <DropdownMenuItem onClick={() => handleNavClick('contractors-browse')}>
                    Browse Contractors
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Contractor</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleNavClick('contractor', 'dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('contractor', 'my-jobs')}>
                    My Estimates
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('contractor', 'route')}>
                    Route Planner
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick('dispatch')}>
                    Dispatch Map
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Subcontractor</DropdownMenuLabel>
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

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => handleCreateJob()}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs md:text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-full hover:bg-white/90 shadow-md font-semibold px-4 md:px-5 h-9 md:h-10 ml-2 md:ml-4 text-slate-50 bg-blue-800 border border-blue-700"
                    aria-label="Post a new job"
                  >
                    <Plus className="w-4 h-4 mr-1.5 md:mr-2" weight="bold" />
                    Post a Job
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create a new job posting to connect with qualified contractors</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex-1" />

            {/* RIGHT SIDE NAVIGATION */}
            <nav className="flex items-center gap-1.5 mr-4">
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

              <ThemeToggle />

              {currentUser ? (
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
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLoginModalMode('login');
                      setShowLogin(true);
                    }}
                    className="button-interactive border-border text-foreground bg-white/70 hover:bg-white"
                  >
                    <SignIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setLoginModalMode('signup');
                      setShowLogin(true);
                    }}
                    className="button-interactive bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </div>
              )}
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
                    setPendingServiceSelection(null);
                    setActiveTab('homeowner');
                    setActiveSubTab('my-jobs');
                  }}
                  onCancel={() => {
                    setShowJobPost(false);
                    setPendingServiceSelection(null);
                  }}
                  serviceSelection={pendingServiceSelection || undefined}
                />
              )}
              <ServiceCategoryMegaMenu
                open={showServiceMenu}
                onClose={() => {
                  setShowServiceMenu(false);
                  setPreselectedCategoryId(null);
                }}
                onSelect={(selection: ServiceSelection) => {
                  setShowServiceMenu(false);
                  handleCreateJob(selection);
                }}
                initialCategoryId={preselectedCategoryId}
              />
              {!showProfile && !showJobPost && (
                <>
                  {activeTab === 'payment' && <PaymentScreen onPaymentComplete={() => {
                    setActiveTab('home');
                    toast.success('Payment completed successfully!');
                  }} />}
                  {activeTab === 'notifications' && <NotificationsPage />}
                  {activeTab === 'home' && (
                    <div className="space-y-8">
                      {/* Service Categories at top */}
                      <ServiceCategoriesShowcase
                        onCategoryClick={(categoryId) => {
                          // Open service selector focused on this category,
                          // then launch Post a Job with the chosen service.
                          setPreselectedCategoryId(categoryId);
                          setShowServiceMenu(true);
                        }}
                        onServiceSelect={() => {
                          setPreselectedCategoryId(null);
                          setShowServiceMenu(true);
                        }}
                      />

                      {/* Top section with Post Job */}
                      <div>
                          <Card 
                            className="glass-card p-4 md:p-5 border-0 bg-transparent hover:bg-transparent cursor-pointer"
                            onClick={() => handleCreateJob()}
                          >
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="p-2.5 rounded-xl bg-primary flex-shrink-0">
                                    <Plus className="w-5 h-5 text-white" weight="bold" />
                                  </div>
                                  <div className="min-w-0">
                                    <h3 className="text-base md:text-lg font-bold mb-0.5">Post a New Job</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                      Get estimates from qualified contractors in your area
                                    </p>
                                  </div>
                                </div>
                                <Button size="sm" className="h-8 px-3 text-xs rounded-full">
                                  Get Started
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm md:text-base text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <VideoCamera className="w-5 h-5 md:w-6 md:h-6" />
                                  <span>Post by video, photos, or text</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Lightning className="w-5 h-5 md:w-6 md:h-6" />
                                  <span>Instant matches to nearby pros</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                                  <span>No platform fees for contractors</span>
                                </div>
                              </div>
                              
                              {/* How It Works Section */}
                              <div className="border-t border-border/50 pt-5">
                                <h4 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
                                  <Brain className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                  How It Works
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                                      <span className="text-base md:text-lg font-bold text-primary">1</span>
                                    </div>
                                    <div>
                                      <p className="text-sm md:text-base font-medium mb-1">Post Your Job</p>
                                      <p className="text-xs md:text-sm text-muted-foreground">Upload video, photos, or describe your project</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-lg bg-accent/10 flex-shrink-0 mt-0.5">
                                      <span className="text-base md:text-lg font-bold text-accent">2</span>
                                    </div>
                                    <div>
                                      <p className="text-sm md:text-base font-medium mb-1">Get Matched</p>
                                      <p className="text-xs md:text-sm text-muted-foreground">AI connects you with verified local contractors</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-lg bg-secondary/10 flex-shrink-0 mt-0.5">
                                      <span className="text-base md:text-lg font-bold text-secondary">3</span>
                                    </div>
                                    <div>
                                      <p className="text-sm md:text-base font-medium mb-1">Compare & Choose</p>
                                      <p className="text-xs md:text-sm text-muted-foreground">Review bids, ratings, and select the best fit</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Testimonials Section */}
                              <div className="border-t border-border/50 pt-6 mt-6">
                                <h4 className="text-base md:text-lg font-semibold mb-4 text-center">
                                  What Homeowners Are Saying
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {/* Testimonial Card 1 */}
                                  <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex gap-1 mb-3">
                                      {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-4 h-4" weight="fill" style={{ color: '#fbbf24' }} />
                                      ))}
                                    </div>
                                    <p className="text-sm md:text-base italic text-foreground mb-4">
                                      "Got 5 quotes in 24 hours. Way faster than Angi or Thumbtack."
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      — Sarah M., Austin TX
                                    </p>
                                  </div>

                                  {/* Testimonial Card 2 */}
                                  <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex gap-1 mb-3">
                                      {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-4 h-4" weight="fill" style={{ color: '#fbbf24' }} />
                                      ))}
                                    </div>
                                    <p className="text-sm md:text-base italic text-foreground mb-4">
                                      "Finally, a platform that doesn't charge contractors crazy fees. Better pros signed up."
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      — Marcus T., Denver CO
                                    </p>
                                  </div>

                                  {/* Testimonial Card 3 */}
                                  <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex gap-1 mb-3">
                                      {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-4 h-4" weight="fill" style={{ color: '#fbbf24' }} />
                                      ))}
                                    </div>
                                    <p className="text-sm md:text-base italic text-foreground mb-4">
                                      "Posted a video of my leaky roof. Contractor knew exactly what to quote. So easy."
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      — Jennifer L., Phoenix AZ
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Benefits & Stats */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-2 mb-2">
                                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                    <span className="text-base md:text-lg font-bold">24hr</span>
                                  </div>
                                  <p className="text-xs md:text-sm text-muted-foreground">Avg Response</p>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-2 mb-2">
                                    <Star className="w-5 h-5 md:w-6 md:h-6 text-amber-500" weight="fill" />
                                    <span className="text-base md:text-lg font-bold">4.8/5</span>
                                  </div>
                                  <p className="text-xs md:text-sm text-muted-foreground">Avg Rating</p>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-2 mb-2">
                                    <Users className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                                    <span className="text-base md:text-lg font-bold">3.5K+</span>
                                  </div>
                                  <p className="text-xs md:text-sm text-muted-foreground">Contractors</p>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-2 mb-2">
                                    <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-secondary" weight="fill" />
                                    <span className="text-base md:text-lg font-bold">$20</span>
                                  </div>
                                  <p className="text-xs md:text-sm text-muted-foreground">One-time Fee</p>
                                </div>
                              </div>
                            </div>
                          </Card>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <Card 
                            className="glass-card p-6 h-full border-0 bg-transparent hover:bg-transparent cursor-pointer h-full"
                            onClick={() => handleNavClick('territories', 'overview')}
                          >
                            <div className="flex items-center gap-4 mb-3">
                              <div className="p-3 rounded-xl bg-primary">
                                <MapTrifold className="w-7 h-7 text-white" weight="fill" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Available</p>
                                <p className="text-2xl font-bold">{getAvailableTerritoryCount().toLocaleString()}+</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold mb-1">Territories</p>
                            <p className="text-xs text-muted-foreground mb-2">$45/month • Exclusive lead rights</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge variant="outline" className="text-[10px]">TX</Badge>
                              <Badge variant="outline" className="text-[10px]">AZ</Badge>
                              <Badge variant="outline" className="text-[10px]">GA</Badge>
                              <Badge variant="outline" className="text-[10px]">+{getStateStats().length - 3} states</Badge>
                            </div>
                          </Card>
                          <Card 
                            className="glass-card p-6 h-full border-0 bg-transparent hover:bg-transparent cursor-pointer h-full"
                            onClick={() => handleNavClick('jobs')}
                          >
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

                          <Card 
                            className="glass-card p-6 h-full border-0 bg-transparent hover:bg-transparent cursor-pointer h-full"
                            onClick={() => handleNavClick('contractors-browse')}
                          >
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

                          <Card 
                            className="glass-card p-6 h-full border-0 bg-transparent hover:bg-transparent cursor-pointer h-full"
                            onClick={() => handleNavClick('api')}
                          >
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
                      </div>

                      <TerritoryTeaser onExplore={() => handleNavClick('territories', 'overview')} />

                        <Card className="glass-card p-8 border-0 bg-transparent">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                          <div>
                            <h3 className="text-2xl font-bold mb-2">Zero Fees for Contractors</h3>
                            <Badge variant="secondary" className="mb-4">100% Earnings Guarantee</Badge>
                            <p className="text-muted-foreground mb-6">
                              Unlike other platforms that charge 15-30% fees, FairTradeWorker contractors keep 100% of their job earnings. Territory operators pay $45/month for exclusive lead rights in their area to fund the platform. Homeowners pay a one-time $20 platform fee per job.
                            </p>
                            <div className="space-y-3">
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
                            </div>
                            <Button size="lg" className="mt-6" onClick={() => handleNavClick('contractor', 'dashboard')}>
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
                        </div>
                        </Card>
                    </div>
                  )}
                  {activeTab === 'jobs' && (
                    <JobsTab 
                      user={currentUser || undefined}
                      onPostJob={handleCreateJob}
                      onJobSelect={(job) => {
                        toast.success(`Selected job: ${job.title}`);
                      }}
                    />
                  )}
                  {activeTab === 'contractors-browse' && <ContractorBrowser />}
                  {activeTab === 'homeowner' && (
                    currentUser ? (
                      <HomeownerDashboard user={currentUser} activeSubTab={activeSubTab} />
                    ) : (
                      <div className="space-y-6">
                        <div className="text-center py-12">
                          <h2 className="text-2xl font-bold mb-4">Homeowner Dashboard</h2>
                          <p className="text-muted-foreground mb-6">
                            Sign in or create an account to access your homeowner dashboard
                          </p>
                          <div className="flex gap-4 justify-center">
                            <Button
                              onClick={() => {
                                setLoginModalMode('login');
                                setShowLogin(true);
                              }}
                            >
                              <SignIn className="w-4 h-4 mr-2" />
                              Sign In
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setLoginModalMode('signup');
                                setShowLogin(true);
                              }}
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Sign Up
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  {activeTab === 'territories' && activeSubTab === 'overview' && (
                    <TerritoriesOverview 
                      onNavigateToDetail={(stateCode) => {
                        setActiveSubTab(null);
                      }}
                    />
                  )}
                  {activeTab === 'territories' && activeSubTab !== 'overview' && <TerritoryMapPage />}
                  {activeTab === 'contractor' && (
                    currentUser ? (
                      <ContractorDashboard user={currentUser} subTab={activeSubTab} />
                    ) : (
                      <div className="space-y-6">
                        <div className="text-center py-12">
                          <h2 className="text-2xl font-bold mb-4">Contractor Dashboard</h2>
                          <p className="text-muted-foreground mb-6">
                            Sign in or create a contractor account to access your dashboard
                          </p>
                          <div className="flex gap-4 justify-center">
                            <Button
                              onClick={() => {
                                setLoginModalMode('login');
                                setShowLogin(true);
                              }}
                            >
                              <SignIn className="w-4 h-4 mr-2" />
                              Sign In
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setLoginModalMode('signup');
                                setShowLogin(true);
                              }}
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Sign Up
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  {activeTab === 'subcontractor' && <SubcontractorDashboard user={currentUser || undefined} subTab={activeSubTab} />}
                  {activeTab === 'dispatch' && <DispatchMap />}
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

      {/* Login Modal Overlay */}
      {showLogin && (
        <LoginModal
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          onClose={() => setShowLogin(false)}
          initialMode={loginModalMode}
        />
      )}
      
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
          <div className="flex items-center justify-around h-16">
            <Button
              variant={activeTab === 'home' ? 'default' : 'ghost'}
              onClick={() => handleNavClick('home')}
              className="flex flex-col items-center gap-1 h-full w-full rounded-none"
              size="sm"
            >
              <House className="w-5 h-5" weight={activeTab === 'home' ? 'fill' : 'regular'} />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant={activeTab === 'territories' ? 'default' : 'ghost'}
              onClick={() => handleNavClick('territories', 'overview')}
              className="flex flex-col items-center gap-1 h-full w-full rounded-none"
              size="sm"
            >
              <MapTrifold className="w-5 h-5" weight={activeTab === 'territories' ? 'fill' : 'regular'} />
              <span className="text-xs">Territories</span>
            </Button>
            <Button
              variant={activeTab === 'jobs' ? 'default' : 'ghost'}
              onClick={() => handleNavClick('jobs')}
              className="flex flex-col items-center gap-1 h-full w-full rounded-none"
              size="sm"
            >
              <Briefcase className="w-5 h-5" weight={activeTab === 'jobs' ? 'fill' : 'regular'} />
              <span className="text-xs">Jobs</span>
            </Button>
            <Button
              variant={activeTab === 'messages' ? 'default' : 'ghost'}
              onClick={() => handleNavClick('messages')}
              className="flex flex-col items-center gap-1 h-full w-full rounded-none"
              size="sm"
            >
              <ChatCircle className="w-5 h-5" weight={activeTab === 'messages' ? 'fill' : 'regular'} />
              <span className="text-xs">Messages</span>
            </Button>
            <Button
              variant={activeTab === 'notifications' ? 'default' : 'ghost'}
              onClick={() => handleNavClick('notifications')}
              className="flex flex-col items-center gap-1 h-full w-full rounded-none"
              size="sm"
            >
              <BellRinging className="w-5 h-5" weight={activeTab === 'notifications' ? 'fill' : 'regular'} />
              <span className="text-xs">Alerts</span>
            </Button>
          </div>
        </nav>
      )}
      
      {/* Add padding to main content on mobile to account for bottom nav */}
      {isMobile && <div className="h-16" />}
    </div>
  );
}

export default App;
