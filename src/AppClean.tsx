import { useState, useEffect } from 'react';
import { 
  House, 
  ChatCircle,
  Lightning,
  SignOut,
  UserCircle
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { QuickJobPost } from '@/components/QuickJobPost';
import { APIPage } from '@/components/APIPage';
import { MessagesViewClean } from '@/components/MessagesViewClean';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';

type MainTab = 'home' | 'api' | 'messages';

function App() {
  const [currentUser, setCurrentUser] = useState({ id: 'user-1', name: 'Demo User', email: 'demo@example.com' });
  const [activeTab, setActiveTab] = useState<MainTab>('home');

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleCreateJob = (type: 'video' | 'photo' | 'text') => {
    toast.success(`Creating ${type} job post...`);
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b-2 border-border bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center gap-2">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('home')}
                className={`font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'home'
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <House className="w-5 h-5 mr-2" weight="bold" />
                Home
              </Button>

              <Button
                variant={activeTab === 'api' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('api')}
                className={`font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'api'
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <Lightning className="w-5 h-5 mr-2" weight="bold" />
                API
              </Button>

              <Button
                variant={activeTab === 'messages' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('messages')}
                className={`font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'messages'
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <ChatCircle className="w-5 h-5 mr-2" weight="bold" />
                Messages
              </Button>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 hover:bg-muted transition-all duration-200"
                  >
                    <Avatar className="w-8 h-8 border-2 border-border">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline font-bold">{currentUser.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-2 border-border">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-bold">{currentUser.name}</span>
                      <span className="text-xs text-muted-foreground font-semibold">{currentUser.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="font-semibold">
                    <UserCircle className="w-4 h-4 mr-2" weight="bold" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive font-semibold">
                    <SignOut className="w-4 h-4 mr-2" weight="bold" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'home' && (
            <div className="space-y-8">
              <QuickJobPost onCreateJob={handleCreateJob} />
            </div>
          )}

          {activeTab === 'api' && <APIPage userId={currentUser.id} />}

          {activeTab === 'messages' && <MessagesViewClean userId={currentUser.id} />}
        </div>
      </main>

      <footer className="border-t-2 border-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-semibold">
            © 2025 FairTradeWorker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
