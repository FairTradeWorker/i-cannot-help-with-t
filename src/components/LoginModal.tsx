import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeSimple, Lock, Eye, EyeSlash, UserCircle, Hammer, HardHat, House, Sparkle } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LoginModalProps {
  onLogin: (email: string, password: string, role: 'homeowner' | 'contractor' | 'subcontractor') => void;
  onSignUp: (email: string, password: string, role: 'homeowner' | 'contractor' | 'subcontractor') => void;
}

export function LoginModal({ onLogin, onSignUp }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'homeowner' | 'contractor' | 'subcontractor'>('homeowner');
  const [isLogin, setIsLogin] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

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
      color: 'from-primary to-blue-600',
    },
    {
      id: 'contractor' as const,
      label: 'Contractor',
      icon: Hammer,
      description: 'Find work and grow your business',
      color: 'from-accent to-red-600',
    },
    {
      id: 'subcontractor' as const,
      label: 'Subcontractor',
      icon: HardHat,
      description: 'Browse location-based opportunities',
      color: 'from-secondary to-black',
    },
  ];

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
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
            className="mx-auto w-32 h-32 rounded-3xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center mb-8 shadow-2xl"
          >
            <House className="w-20 h-20 text-white" weight="fill" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
          >
            ServiceHub
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
              <Sparkle className="w-5 h-5 ml-2" weight="fill" />
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
    <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-50 to-red-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-5xl my-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 flex flex-col justify-center p-8 bg-gradient-to-br from-primary to-secondary rounded-2xl text-white shadow-2xl"
          >
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
                  <Sparkle className="w-4 h-4 text-white" weight="fill" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Instant Connections</h4>
                  <p className="text-white/70 text-sm">Connect with verified contractors in seconds</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkle className="w-4 h-4 text-white" weight="fill" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Secure Payments</h4>
                  <p className="text-white/70 text-sm">Protected transactions with escrow</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkle className="w-4 h-4 text-white" weight="fill" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Territory Ownership</h4>
                  <p className="text-white/70 text-sm">Invest in territories and earn 8% revenue share</p>
                </div>
              </div>
            </div>
          </motion.div>

          <Card className="lg:col-span-3 glass-card border-2 shadow-2xl">
            <CardHeader className="text-center space-y-2 pb-4">
              <h2 className="text-3xl font-bold">Sign In</h2>
              <p className="text-sm text-muted-foreground">
                Choose your role and continue to your dashboard
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(v) => setIsLogin(v === 'login')}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="text-base">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="text-base">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-5 mt-0">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-3">
                      <Label className="text-base">Select Your Role</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {roles.map((role) => {
                          const Icon = role.icon;
                          return (
                            <motion.div
                              key={role.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <button
                                type="button"
                                onClick={() => setSelectedRole(role.id)}
                                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                  selectedRole === role.id
                                    ? 'border-primary bg-primary/5 shadow-lg'
                                    : 'border-border hover:border-primary/50 hover:shadow-md'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-lg bg-gradient-to-br ${role.color}`}>
                                    <Icon
                                      className="w-7 h-7 text-white"
                                      weight="fill"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-base">{role.label}</p>
                                    <p className="text-sm text-muted-foreground">{role.description}</p>
                                  </div>
                                  {selectedRole === role.id && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                                    >
                                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </motion.div>
                                  )}
                                </div>
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">Email Address</Label>
                      <div className="relative">
                        <EnvelopeSimple className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 text-base"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-base">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-12 text-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeSlash className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-base" size="lg">
                      Sign In to Dashboard
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-5 mt-0">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-3">
                      <Label className="text-base">Select Your Role</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {roles.map((role) => {
                          const Icon = role.icon;
                          return (
                            <motion.div
                              key={role.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <button
                                type="button"
                                onClick={() => setSelectedRole(role.id)}
                                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                  selectedRole === role.id
                                    ? 'border-primary bg-primary/5 shadow-lg'
                                    : 'border-border hover:border-primary/50 hover:shadow-md'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-lg bg-gradient-to-br ${role.color}`}>
                                    <Icon
                                      className="w-7 h-7 text-white"
                                      weight="fill"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-base">{role.label}</p>
                                    <p className="text-sm text-muted-foreground">{role.description}</p>
                                  </div>
                                  {selectedRole === role.id && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                                    >
                                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </motion.div>
                                  )}
                                </div>
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-base">Email Address</Label>
                      <div className="relative">
                        <EnvelopeSimple className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 text-base"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-base">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-12 text-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeSlash className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-base" size="lg">
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
