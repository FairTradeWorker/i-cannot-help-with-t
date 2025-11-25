import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  House, 
  MagnifyingGlass, 
  User, 
  Heart, 
  ChatCircle,
  Sparkle,
  Plus,
  Hammer,
  BellRinging,
  ShoppingCart
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { LegalConsentModal } from '@/components/LegalConsentModal';
import { LegalFooter } from '@/components/LegalFooter';
import { MarketplaceBrowse } from '@/components/MarketplaceBrowse';
import { UserProfile } from '@/components/UserProfile';
import { MessagesView } from '@/components/MessagesView';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { dataStore } from '@/lib/store';
import { initializeDemoData } from '@/lib/demo-data';
import type { User as UserType } from '@/lib/types';

type NavTab = 'browse' | 'services' | 'messages' | 'profile';

function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLegalConsent, setShowLegalConsent] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('browse');
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [20, 30]);

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

  const navItems = [
    { id: 'browse' as NavTab, icon: House, label: 'Browse' },
    { id: 'services' as NavTab, icon: Sparkle, label: 'Services' },
    { id: 'messages' as NavTab, icon: ChatCircle, label: 'Messages' },
    { id: 'profile' as NavTab, icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen pb-24">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkle className="w-6 h-6 text-white" weight="fill" />
              </div>
              <h1 className="text-xl font-bold">ServiceHub</h1>
            </motion.div>

            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="relative">
                  <BellRinging className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="rounded-full">
                  <Plus className="w-5 h-5 mr-2" weight="bold" />
                  Post Job
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'browse' && <MarketplaceBrowse />}
              {activeTab === 'services' && <MarketplaceBrowse featured />}
              {activeTab === 'messages' && <MessagesView userId={currentUser?.id || ''} />}
              {activeTab === 'profile' && <UserProfile user={currentUser} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, delay: 0.2 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="glass rounded-full px-4 py-3 shadow-2xl">
          <div className="flex items-center gap-2">
            {navItems.map((item, index) => {
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-6 py-3 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon 
                    className="w-6 h-6" 
                    weight={isActive ? 'fill' : 'regular'} 
                  />
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-full -z-10"
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.nav>

      <FloatingActionButton onAction={(action) => console.log('Action:', action)} />

      <LegalFooter />
    </div>
  );
}

export default App;
