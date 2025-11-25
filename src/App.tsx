import { useState, useEffect } from 'react';
import { User, Hammer, House } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContractorDashboard } from '@/components/ContractorDashboard';
import { HomeownerDashboard } from '@/components/HomeownerDashboard';
import { LegalConsentModal } from '@/components/LegalConsentModal';
import { LegalFooter } from '@/components/LegalFooter';
import { dataStore } from '@/lib/store';
import { initializeDemoData, switchUserRole } from '@/lib/demo-data';
import type { User as UserType } from '@/lib/types';

function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLegalConsent, setShowLegalConsent] = useState(false);
  const [pendingRole, setPendingRole] = useState<'contractor' | 'homeowner' | null>(null);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    await initializeDemoData();
    const user = await dataStore.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  };

  const handleSelectRole = async (role: 'contractor' | 'homeowner') => {
    setPendingRole(role);
    setShowLegalConsent(true);
  };

  const handleLegalAccept = async (consents: any) => {
    if (pendingRole) {
      const user = await switchUserRole(pendingRole);
      setCurrentUser(user);
      setShowLegalConsent(false);
      setPendingRole(null);
    }
  };

  const handleLegalDecline = () => {
    setShowLegalConsent(false);
    setPendingRole(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading platform...</p>
        </div>
      </div>
    );
  }

  if (showLegalConsent && pendingRole) {
    return (
      <LegalConsentModal
        userType={pendingRole}
        onAccept={handleLegalAccept}
        onDecline={handleLegalDecline}
      />
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold tracking-tight">AI Home Services Platform</h1>
            <p className="text-muted-foreground mt-1">Select your role to get started</p>
          </div>
        </div>

        <div className="flex-1 max-w-4xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 hover:border-primary/50 transition-colors cursor-pointer" 
              onClick={() => handleSelectRole('contractor')}
            >
              <div className="text-center">
                <Hammer className="w-20 h-20 text-primary mx-auto mb-4" weight="duotone" />
                <h2 className="text-2xl font-bold mb-2">I'm a Contractor</h2>
                <p className="text-muted-foreground mb-6">
                  Find jobs, submit bids, manage projects, and grow your business
                </p>
                <Button size="lg" className="w-full">
                  <Hammer className="w-5 h-5 mr-2" weight="fill" />
                  Continue as Contractor
                </Button>
              </div>
            </Card>

            <Card className="p-8 hover:border-accent/50 transition-colors cursor-pointer"
              onClick={() => handleSelectRole('homeowner')}
            >
              <div className="text-center">
                <House className="w-20 h-20 text-accent mx-auto mb-4" weight="duotone" />
                <h2 className="text-2xl font-bold mb-2">I'm a Homeowner</h2>
                <p className="text-muted-foreground mb-6">
                  Post projects, get AI estimates, compare bids, and hire trusted contractors
                </p>
                <Button size="lg" variant="outline" className="w-full">
                  <House className="w-5 h-5 mr-2" weight="fill" />
                  Continue as Homeowner
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <LegalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setCurrentUser(null)}
        >
          <User className="w-4 h-4 mr-2" />
          Switch Role
        </Button>
      </div>

      <div className="flex-1">
        {currentUser.role === 'contractor' && <ContractorDashboard user={currentUser} />}
        {currentUser.role === 'homeowner' && <HomeownerDashboard user={currentUser} />}
      </div>

      <LegalFooter />
    </div>
  );
}

export default App;