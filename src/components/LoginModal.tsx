import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeSimple, Lock, Eye, EyeSlash, UserCircle, Hammer, HardHat } from '@phosphor-icons/react';
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
      icon: UserCircle,
      description: 'Post jobs and hire contractors',
    },
    {
      id: 'contractor' as const,
      label: 'Contractor',
      icon: Hammer,
      description: 'Find work and grow your business',
    },
    {
      id: 'subcontractor' as const,
      label: 'Subcontractor',
      icon: HardHat,
      description: 'Browse location-based opportunities',
    },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-2 border-primary/20">
          <CardHeader className="text-center space-y-2 pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
            >
              <UserCircle className="w-10 h-10 text-white" weight="fill" />
            </motion.div>
            <h2 className="text-2xl font-bold">Welcome to ServiceHub</h2>
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Sign in to continue' : 'Create your account'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(v) => setIsLogin(v === 'login')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <EnvelopeSimple className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
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
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeSlash className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>I am a...</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                          <motion.div
                            key={role.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedRole(role.id)}
                              className={`w-full p-3 rounded-lg border-2 transition-all ${
                                selectedRole === role.id
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <Icon
                                className={`w-6 h-6 mx-auto mb-1 ${
                                  selectedRole === role.id ? 'text-primary' : 'text-muted-foreground'
                                }`}
                                weight={selectedRole === role.id ? 'fill' : 'regular'}
                              />
                              <p className="text-xs font-medium">{role.label}</p>
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full" size="lg">
                      Sign In
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <EnvelopeSimple className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-password"
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
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeSlash className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>I am a...</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                          <motion.div
                            key={role.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedRole(role.id)}
                              className={`w-full p-3 rounded-lg border-2 transition-all ${
                                selectedRole === role.id
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <Icon
                                className={`w-6 h-6 mx-auto mb-1 ${
                                  selectedRole === role.id ? 'text-primary' : 'text-muted-foreground'
                                }`}
                                weight={selectedRole === role.id ? 'fill' : 'regular'}
                              />
                              <p className="text-xs font-medium">{role.label}</p>
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full" size="lg">
                      Create Account
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
