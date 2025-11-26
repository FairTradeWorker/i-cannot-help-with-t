import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  House,
  Briefcase,
  MapTrifold,
  Brain,
  ChatCircle,
  UserCircle,
  List,
  X,
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

  const navItems = [
    { id: 'browse-jobs', label: 'Browse Jobs', icon: Briefcase },
    { id: 'territories', label: 'Territories', icon: MapTrifold },
    { id: 'intelligence', label: 'Intelligence API', icon: Brain },
    { id: 'messages', label: 'Messages', icon: ChatCircle },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Logo */}
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center cursor-pointer"
                onClick={() => onNavigate('home')}
              >
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <House className="h-5 w-5 text-white" weight="fill" />
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text">
                  FairTradeWorker
                </span>
              </motion.div>
            </div>
            
            {/* Center: Main Navigation - ALL SIDE BY SIDE, PERFECT SPACING */}
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('browse-jobs')}
                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                  activeTab === 'browse-jobs' ? 'text-blue-600' : ''
                }`}
              >
                Browse Jobs
              </motion.button>
              
              {/* POST JOB - CENTERED, PROMINENT */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('homeowner', 'post-job')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transform transition-all"
              >
                <Plus className="w-4 h-4 inline mr-1" weight="bold" />
                Post Job
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('territories', 'overview')}
                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                  activeTab === 'territories' ? 'text-blue-600' : ''
                }`}
              >
                Territories
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('intelligence')}
                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                  activeTab === 'intelligence' ? 'text-blue-600' : ''
                }`}
              >
                Intelligence API
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('messages')}
                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors relative ${
                  activeTab === 'messages' ? 'text-blue-600' : ''
                }`}
              >
                Messages
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-orange-500 rounded-full" />
              </motion.button>
            </div>
            
            {/* Right: User Menu */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDashboardClick}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Spacer so content doesn't hide under fixed nav */}
      <div className="hidden md:block h-16" />

      {/* Mobile Navigation - Bottom Nav with FAB */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('browse-jobs')}
            className={`flex flex-col items-center justify-center px-3 py-2 ${
              activeTab === 'browse-jobs' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Briefcase className="w-5 h-5" weight={activeTab === 'browse-jobs' ? 'fill' : 'regular'} />
            <span className="text-[10px] mt-0.5">Browse</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('territories', 'overview')}
            className={`flex flex-col items-center justify-center px-3 py-2 ${
              activeTab === 'territories' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <MapTrifold className="w-5 h-5" weight={activeTab === 'territories' ? 'fill' : 'regular'} />
            <span className="text-[10px] mt-0.5">Territories</span>
          </motion.button>
          
          {/* Floating Action Button for Post Job */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('homeowner', 'post-job')}
            className="bg-blue-600 text-white px-6 py-2 rounded-full -mt-8 shadow-lg flex items-center gap-1"
          >
            <Plus className="w-5 h-5" weight="bold" />
            <span className="font-semibold text-sm">Post Job</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('intelligence')}
            className={`flex flex-col items-center justify-center px-3 py-2 ${
              activeTab === 'intelligence' ? 'text-blue-600' : 'text-gray-500'
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
            className="flex flex-col items-center justify-center px-3 py-2 text-gray-500"
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
