import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Star, 
  MapPin, 
  Phone, 
  EnvelopeSimple,
  Certificate,
  Heart,
  ClockCounterClockwise,
  Gear
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GlassSurface } from './GlassSurface';
import { getDefaultGlassContext } from '@/lib/glass-context-utils';
import type { User } from '@/lib/types';

interface UserProfileProps {
  user: User | null;
}

export function UserProfile({ user }: UserProfileProps) {
  if (!user) {
    return (
      <GlassSurface
        id="user-profile-empty"
        context={getDefaultGlassContext()}
        className="rounded-3xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 text-center border-0 bg-transparent"
        >
          <UserIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No Profile Found</h2>
          <p className="text-muted-foreground">Please sign in to view your profile</p>
        </motion.div>
      </GlassSurface>
    );
  }

  const stats = [
    { label: 'Projects', value: '12', icon: ClockCounterClockwise },
    { label: 'Favorites', value: '8', icon: Heart },
    { label: 'Reviews', value: '24', icon: Star },
  ];

  return (
    <div className="space-y-6">
      <GlassSurface
        id="user-profile-main"
        context={{
          ...getDefaultGlassContext(),
          serviceCategory: 'profile',
          confidence: 0.95
        }}
        className="rounded-3xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 border-0 bg-transparent"
        >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Avatar className="w-32 h-32 border-4 border-primary/20">
              <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-accent text-white">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center border-4 border-background">
              <Certificate className="w-5 h-5 text-white" weight="fill" />
            </div>
          </motion.div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <EnvelopeSimple className="w-4 h-4" />
                {user.email}
              </p>
              {user.phone && (
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4" />
                  {user.phone}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Badge variant="secondary" className="rounded-full">
                Member since {new Date(user.createdAt).getFullYear()}
              </Badge>
              <Badge className="rounded-full bg-accent text-accent-foreground">
                Verified User
              </Badge>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="rounded-full">
                <Gear className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
              <Card className="rounded-3xl p-6 text-center border-0 bg-transparent">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" weight="duotone" />
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            </GlassSurface>
          </motion.div>
        ))}
      </div>

      <GlassSurface
        id="user-profile-activity"
        context={getDefaultGlassContext()}
        className="rounded-3xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 border-0 bg-transparent"
        >
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <ClockCounterClockwise className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Activity Item {item}</p>
                <p className="text-sm text-muted-foreground">2 days ago</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      </GlassSurface>
    </div>
  );
}
