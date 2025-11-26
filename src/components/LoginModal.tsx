import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeSimple, Lock, Eye, EyeSlash, UserCircle, Hammer, HardHat, House, MapTrifold } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LoginModalProps {
  onLogin: (email: string, password: string, role: 'homeowner' | 'contractor' | 'subcontractor') => void;
  onSignUp: (email: string, password: string, role: 'homeowner' | 'contractor' | 'subcontractor') => void;
}

export function LoginModal({ onLogin, onSignUp }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'homeowner' | 'contractor' | 'subcontractor'>('homeowner');
  const [selectedTrade, setSelectedTrade] = useState<string>('General Contractor');
  const [isLogin, setIsLogin] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  const trades = [
    'General Contractor', 'Roofing', 'Plumbing', 'Electrical', 'HVAC',
    'Carpentry', 'Painting', 'Flooring', 'Landscaping', 'Concrete'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password, selectedRole);
    } else {
      onSignUp(email, password, selectedRole);
    }
  };

  const roles = [
    {
      id: 'homeowner' as const,
      label: 'Homeowner',
      icon: House,
      description: 'Post jobs and hire contractors',
      color: 'bg-primary',
    },
    {
      id: 'contractor' as const,
      label: 'Contractor',
      icon: Hammer,
      description: 'Find work and grow your business',
      color: 'bg-accent',
    },
    {
      id: 'subcontractor' as const,
      label: 'Subcontractor',
      icon: HardHat,
      description: 'Browse location-based opportunities',
      color: 'bg-secondary',
    },
  ];

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto w-32 h-32 rounded-3xl bg-primary flex items-center justify-center mb-8 shadow-2xl"
          >
            <House className="w-20 h-20 text-white" weight="fill" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold mb-3"
          >
            FairTradeWorker
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Connect. Build. Transform.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              size="lg"
              onClick={() => setShowSplash(false)}
              className="px-8 py-6 text-lg shadow-xl"
            >
              Get Started
              <MapTrifold className="w-5 h-5 ml-2" weight="fill" />
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex items-center justify-center gap-8"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">15K+</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">3.5K+</div>
              <div className="text-sm text-muted-foreground">Contractors</div>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">29K+</div>
              <div className="text-sm text-muted-foreground">Jobs</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-5xl my-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 flex flex-col justify-center p-8 bg-primary rounded-l-2xl text-white shadow-2xl"
          >
            <Tabs defaultValue={isLogin ? 'login' : 'signup'} onValueChange={(v) => setIsLogin(v === 'login')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10">
                <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-primary">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-primary">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6"
              >
                <House className="w-10 h-10 text-white" weight="fill" />
              </motion.div>
              <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
              <p className="text-white/80 text-lg">
                Sign in to access your dashboard and connect with professionals
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapTrifold className="w-4 h-4 text-white" weight="fill" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Instant Connections</h4>
                  <p className="text-white/70 text-sm">Connect with verified contractors in seconds</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Lock className="w-4 h-4 text-white" weight="fill" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Secure Payments</h4>
                  <p className="text-white/70 text-sm">Protected transactions with escrow</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapTrifold className="w-4 h-4 text-white" weight="fill" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Territory Ownership</h4>
                  <p className="text-white/70 text-sm">Invest in territories and earn 8% revenue share</p>
                </div>
              </div>
            </div>
          </motion.div>

          <Card className="lg:col-span-3 glass-card border-2 shadow-2xl rounded-l-none rounded-r-2xl border-l-0">
            <CardHeader className="text-center space-y-2 pb-4">
              <h2 className="text-3xl font-bold">{isLogin ? 'Sign In' : 'Create Account'}</h2>
              <p className="text-sm text-muted-foreground">
                Choose your role and continue to your dashboard
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeSlash className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">I am a...</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <motion.button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                            selectedRole === role.id
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border bg-card hover:border-primary/50'
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-lg ${role.color} flex items-center justify-center`}
                          >
                            <Icon className="w-6 h-6 text-white" weight="fill" />
                          </div>
                          <span className="text-sm font-medium text-center">
                            {role.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {(selectedRole === 'contractor' || selectedRole === 'subcontractor') && !isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="trade" className="text-sm font-medium">
                      Trade / Specialty
                    </Label>
                    <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                      <SelectTrigger id="trade">
                        <SelectValue placeholder="Select your trade" />
                      </SelectTrigger>
                      <SelectContent>
                        {trades.map((trade) => (
                          <SelectItem key={trade} value={trade}>
                            {trade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full shadow-xl"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
