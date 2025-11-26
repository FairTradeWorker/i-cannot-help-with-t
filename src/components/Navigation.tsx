import { motion } from 'framer-motion';
import {
  House,
  Briefcase,
  MapTrifold,
  Brain,
  ChatCircle,
  UserCircle,
  CaretDown,
  Plus,
  Package,
  MapPin,
  Hammer,
  Shield,
  Bank,
  Buildings,
  Handshake,
  ShieldCheck,
  BellRinging,
  CreditCard,
  UserGear,
  SignOut,
} from '@phosphor-icons/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  activeTab: string;
  onNavigate: (tab: string, subTab?: string) => void;
  currentUser?: {
    name?: string;
    avatar?: string;
    email?: string;
    role?: string;
    contractorProfile?: {
      specialties?: string[];
    };
  };
  onDashboardClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  showAdminPanel?: boolean;
  onAdminClick?: () => void;
}

export function Navigation({ 
  activeTab, 
  onNavigate, 
  currentUser,
  onDashboardClick,
  onProfileClick,
  onLogout,
  showAdminPanel,
  onAdminClick,
}: NavigationProps) {
  return (
    <>
      {/* Desktop Navigation - Matches App.tsx header structure exactly */}
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
                  onClick={() => onNavigate('home')}
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
                  onClick={() => onNavigate('territories', 'overview')}
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
                  onClick={() => onNavigate('browse-jobs')}
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
                  <DropdownMenuItem onClick={() => onNavigate('contractor', 'dashboard')}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('contractor', 'jobs')}>
                    <Package className="w-4 h-4 mr-2" />
                    My Jobs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('contractor', 'route')}>
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
                  onClick={() => onNavigate('homeowner', 'post-job')}
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
                  <DropdownMenuItem onClick={() => onNavigate('homeowner', 'profile')}>
                    <UserCircle className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('homeowner', 'my-jobs')}>
                    <Package className="w-4 h-4 mr-2" />
                    Job Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('homeowner', 'post-job')}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Post a Job
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
                  <DropdownMenuItem onClick={() => onNavigate('partners', undefined)}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Overview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('partners', 'materials')}>
                    <Package className="w-4 h-4 mr-2" />
                    Materials Vendors
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('partners', 'insurance')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Insurance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('partners', 'ai')}>
                    <Brain className="w-4 h-4 mr-2" />
                    API - Coming Soon
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('partners', 'private_equity')}>
                    <Bank className="w-4 h-4 mr-2" />
                    Private Equity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('partners', 'real_estate')}>
                    <Buildings className="w-4 h-4 mr-2" />
                    Real Estate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Button
                  variant={activeTab === 'warranty' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('warranty')}
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
                  onClick={() => onNavigate('messages')}
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
                <Button variant="ghost" size="icon" className="button-interactive relative h-8 w-8">
                  <BellRinging className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                </Button>
              </motion.div>

              {currentUser?.role === 'admin' && onAdminClick && (
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
                >
                  <Button
                    variant={showAdminPanel ? 'default' : 'outline'}
                    size="icon"
                    onClick={onAdminClick}
                    className="button-interactive h-8 w-8"
                  >
                    <Briefcase className="w-4 h-4" weight={showAdminPanel ? 'fill' : 'regular'} />
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
                  onClick={() => onNavigate('payment')}
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
                  <DropdownMenuItem onClick={onProfileClick}>
                    <UserGear className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('homeowner', 'post-job')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Post a Job
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive">
                    <SignOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation - Bottom Nav with FAB */}
      <nav className="md:hidden fixed bottom-0 w-full glass-card border-t border-border/50 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center justify-center px-3 py-2 ${
              activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <House className="w-5 h-5" weight={activeTab === 'home' ? 'fill' : 'regular'} />
            <span className="text-[10px] mt-0.5">Home</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('browse-jobs')}
            className={`flex flex-col items-center justify-center px-3 py-2 ${
              activeTab === 'browse-jobs' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Briefcase className="w-5 h-5" weight={activeTab === 'browse-jobs' ? 'fill' : 'regular'} />
            <span className="text-[10px] mt-0.5">Jobs</span>
          </motion.button>
          
          {/* Floating Action Button for Post Job */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={() => onNavigate('homeowner', 'post-job')}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-full -mt-8 shadow-lg px-6"
            >
              <Plus className="w-5 h-5 mr-1" weight="bold" />
              <span className="font-semibold text-sm">Post Job</span>
            </Button>
          </motion.div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('messages')}
            className={`flex flex-col items-center justify-center px-3 py-2 ${
              activeTab === 'messages' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <ChatCircle className="w-5 h-5" weight={activeTab === 'messages' ? 'fill' : 'regular'} />
            <span className="text-[10px] mt-0.5">Messages</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onProfileClick || (() => onNavigate('homeowner', 'profile'))}
            className="flex flex-col items-center justify-center px-3 py-2 text-muted-foreground"
          >
            <UserCircle className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Profile</span>
          </motion.button>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
