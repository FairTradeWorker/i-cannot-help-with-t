import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  House,
  Briefcase,
  MapTrifold,
  Brain,
  ChatCircle,
  UserCircle,
  Plus,
} from '@phosphor-icons/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeTab: string;
  onNavigate: (tab: string, subTab?: string) => void;
  currentUser?: {
    name?: string;
    avatar?: string;
    email?: string;
  };
  onDashboardClick?: () => void;
}

export function Navigation({ 
  activeTab, 
  onNavigate, 
  currentUser,
  onDashboardClick 
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation - Uses glass-card styling from design system */}
      <nav className="hidden md:block sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="w-full px-6 pt-2">
          <div className="flex items-center h-16 py-2 max-w-[1920px] mx-auto">
            
            {/* Left: Logo and Navigation */}
            <div className="flex items-center gap-2 flex-1">
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
                  variant={activeTab === 'browse-jobs' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('browse-jobs')}
                  className="button-interactive"
                  size="sm"
                >
                  <Briefcase className="w-4 h-4 mr-1.5" weight={activeTab === 'browse-jobs' ? 'fill' : 'regular'} />
                  Browse Jobs
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
                  variant={activeTab === 'intelligence' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('intelligence')}
                  className="button-interactive"
                  size="sm"
                >
                  <Brain className="w-4 h-4 mr-1.5" weight={activeTab === 'intelligence' ? 'fill' : 'regular'} />
                  Intelligence API
                </Button>
              </motion.div>
            </div>
            
            {/* Center: POST JOB - CENTERED, PROMINENT */}
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
            
            {/* Right: Messages, Dashboard, User Menu */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Button
                  variant={activeTab === 'messages' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('messages')}
                  className="button-interactive relative"
                  size="sm"
                >
                  <ChatCircle className="w-4 h-4 mr-1.5" weight={activeTab === 'messages' ? 'fill' : 'regular'} />
                  Messages
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full" />
                </Button>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Button
                  variant="ghost"
                  onClick={onDashboardClick}
                  className="button-interactive"
                  size="sm"
                >
                  Dashboard
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.11, ease: [0.32, 0, 0.67, 0] }}
              >
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="text-xs">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Nav with FAB */}
      <nav className="md:hidden fixed bottom-0 w-full glass-card border-t border-border/50 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('browse-jobs')}
            className={`flex flex-col items-center justify-center px-3 py-2 ${
              activeTab === 'browse-jobs' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Briefcase className="w-5 h-5" weight={activeTab === 'browse-jobs' ? 'fill' : 'regular'} />
            <span className="text-[10px] mt-0.5">Browse</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('territories', 'overview')}
            className={`flex flex-col items-center justify-center px-3 py-2 ${
              activeTab === 'territories' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <MapTrifold className="w-5 h-5" weight={activeTab === 'territories' ? 'fill' : 'regular'} />
            <span className="text-[10px] mt-0.5">Territories</span>
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
            onClick={() => onNavigate('intelligence')}
            className={`flex flex-col items-center justify-center px-3 py-2 ${
              activeTab === 'intelligence' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Brain className="w-5 h-5" weight={activeTab === 'intelligence' ? 'fill' : 'regular'} />
            <span className="text-[10px] mt-0.5">API</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (onDashboardClick) {
                onDashboardClick();
              } else {
                onNavigate('homeowner', 'profile');
              }
            }}
            className="flex flex-col items-center justify-center px-3 py-2 text-muted-foreground"
          >
            <UserCircle className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Profile</span>
          </motion.button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navigation;
