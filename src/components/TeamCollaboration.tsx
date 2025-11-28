import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassSurface } from './GlassSurface';
import { getDefaultGlassContext } from '@/lib/glass-context-utils';
import {
  Users,
  UserPlus,
  Trophy,
  Target,
  ChartLineUp,
  CheckCircle,
  Clock,
  Star,
  Lightning,
  Crown,
  ArrowRight,
  Plus,
  Briefcase,
  MapPin,
} from '@phosphor-icons/react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'lead' | 'member' | 'apprentice';
  specialties: string[];
  rating: number;
  completedJobs: number;
  earnings: number;
  status: 'active' | 'busy' | 'offline';
  joinedAt: Date;
  avatar?: string;
}

interface TeamProject {
  id: string;
  title: string;
  client: string;
  status: 'planning' | 'in_progress' | 'completed';
  members: string[];
  budget: number;
  startDate: Date;
  endDate?: Date;
  progress: number;
}

interface TeamGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline: Date;
  reward?: string;
}

const MOCK_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    email: 'mike@contractor.com',
    role: 'lead',
    specialties: ['Roofing', 'General Construction'],
    rating: 4.9,
    completedJobs: 234,
    earnings: 458000,
    status: 'active',
    joinedAt: new Date('2022-01-15'),
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah@contractor.com',
    role: 'member',
    specialties: ['HVAC', 'Electrical'],
    rating: 4.8,
    completedJobs: 156,
    earnings: 312000,
    status: 'busy',
    joinedAt: new Date('2022-06-20'),
  },
  {
    id: '3',
    name: 'James Rodriguez',
    email: 'james@contractor.com',
    role: 'member',
    specialties: ['Plumbing', 'Bathroom Remodel'],
    rating: 4.7,
    completedJobs: 98,
    earnings: 187000,
    status: 'active',
    joinedAt: new Date('2023-02-10'),
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily@contractor.com',
    role: 'apprentice',
    specialties: ['Painting', 'Drywall'],
    rating: 4.5,
    completedJobs: 23,
    earnings: 34000,
    status: 'offline',
    joinedAt: new Date('2024-01-05'),
  },
];

const MOCK_PROJECTS: TeamProject[] = [
  {
    id: '1',
    title: 'Commercial Roof Replacement',
    client: 'ABC Corporation',
    status: 'in_progress',
    members: ['1', '2', '3'],
    budget: 85000,
    startDate: new Date('2024-02-01'),
    progress: 65,
  },
  {
    id: '2',
    title: 'Office HVAC Upgrade',
    client: 'Tech Startup Inc',
    status: 'planning',
    members: ['2'],
    budget: 35000,
    startDate: new Date('2024-03-15'),
    progress: 10,
  },
  {
    id: '3',
    title: 'Residential Bathroom Remodel',
    client: 'Smith Residence',
    status: 'completed',
    members: ['3', '4'],
    budget: 18000,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-02-15'),
    progress: 100,
  },
];

const MOCK_GOALS: TeamGoal[] = [
  {
    id: '1',
    title: 'Monthly Revenue Target',
    description: 'Reach $100,000 in team revenue this month',
    target: 100000,
    current: 78500,
    deadline: new Date('2024-02-29'),
    reward: 'Team bonus: $2,000 split',
  },
  {
    id: '2',
    title: '5-Star Rating Streak',
    description: 'Maintain 5-star ratings for 10 consecutive jobs',
    target: 10,
    current: 7,
    deadline: new Date('2024-03-31'),
  },
  {
    id: '3',
    title: 'New Client Acquisition',
    description: 'Onboard 15 new clients this quarter',
    target: 15,
    current: 11,
    deadline: new Date('2024-03-31'),
    reward: 'Featured team listing for 1 month',
  },
];

const ROLE_CONFIG = {
  lead: { label: 'Team Lead', color: 'bg-yellow-100 text-yellow-700', icon: Crown },
  member: { label: 'Member', color: 'bg-blue-100 text-blue-700', icon: Users },
  apprentice: { label: 'Apprentice', color: 'bg-purple-100 text-purple-700', icon: Lightning },
};

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-green-500' },
  busy: { label: 'Busy', color: 'bg-yellow-500' },
  offline: { label: 'Offline', color: 'bg-gray-400' },
};

export function TeamCollaboration() {
  const [members] = useState<TeamMember[]>(MOCK_MEMBERS);
  const [projects] = useState<TeamProject[]>(MOCK_PROJECTS);
  const [goals] = useState<TeamGoal[]>(MOCK_GOALS);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const totalEarnings = members.reduce((sum, m) => sum + m.earnings, 0);
  const totalJobs = members.reduce((sum, m) => sum + m.completedJobs, 0);
  const avgRating = members.reduce((sum, m) => sum + m.rating, 0) / members.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7" />
            Team Collaboration
          </h2>
          <p className="text-muted-foreground">Manage your crew and track team performance</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassSurface id="team-members-stat" context={{...getDefaultGlassContext(), serviceCategory: 'team'}}>
          <Card className="p-4 border-0 bg-transparent">
            <p className="text-xs text-muted-foreground">Team Members</p>
            <p className="text-2xl font-bold">{members.length}</p>
            <p className="text-xs text-green-600">+1 this month</p>
          </Card>
        </GlassSurface>
        <GlassSurface id="team-earnings-stat" context={{...getDefaultGlassContext(), serviceCategory: 'team', confidence: 0.9}}>
          <Card className="p-4 border-0 bg-transparent">
            <p className="text-xs text-muted-foreground">Total Earnings</p>
            <p className="text-2xl font-bold">${(totalEarnings / 1000).toFixed(0)}K</p>
            <p className="text-xs text-green-600">+12% vs last year</p>
          </Card>
        </GlassSurface>
        <GlassSurface id="team-jobs-stat" context={{...getDefaultGlassContext(), serviceCategory: 'team'}}>
          <Card className="p-4 border-0 bg-transparent">
            <p className="text-xs text-muted-foreground">Jobs Completed</p>
            <p className="text-2xl font-bold">{totalJobs}</p>
            <p className="text-xs text-muted-foreground">All time</p>
          </Card>
        </GlassSurface>
        <GlassSurface id="team-rating-stat" context={{...getDefaultGlassContext(), serviceCategory: 'team', confidence: avgRating / 100}}>
          <Card className="p-4 border-0 bg-transparent">
            <p className="text-xs text-muted-foreground">Team Rating</p>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500" weight="fill" />
              <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
            </div>
            <p className="text-xs text-muted-foreground">Average</p>
          </Card>
        </GlassSurface>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="projects">Active Projects</TabsTrigger>
          <TabsTrigger value="goals">Team Goals</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map(member => {
              const RoleIcon = ROLE_CONFIG[member.role].icon;
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedMember(member)}
                  className="cursor-pointer"
                >
                  <GlassSurface
                    id={`team-member-${member.id}`}
                    context={{
                      ...getDefaultGlassContext(),
                      serviceCategory: 'team',
                      confidence: member.rating / 100,
                      urgency: member.status === 'active' ? 'medium' : 'low'
                    }}
                  >
                    <Card className="p-4 border-0 bg-transparent">
                      <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-bold">{member.name.charAt(0)}</span>
                          </div>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${STATUS_CONFIG[member.status].color}`}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <Badge className={`text-xs ${ROLE_CONFIG[member.role].color}`}>
                            <RoleIcon className="w-3 h-3 mr-1" weight="fill" />
                            {ROLE_CONFIG[member.role].label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" weight="fill" />
                        <span className="font-medium">{member.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {member.specialties.map(spec => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <p className="font-bold">{member.completedJobs}</p>
                        <p className="text-xs text-muted-foreground">Jobs</p>
                      </div>
                      <div>
                        <p className="font-bold">${(member.earnings / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-muted-foreground">Earned</p>
                      </div>
                      <div>
                        <p className="font-bold capitalize">{member.status}</p>
                        <p className="text-xs text-muted-foreground">Status</p>
                      </div>
                    </div>
                  </Card>
                  </GlassSurface>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {projects.map(project => (
            <GlassSurface
              key={project.id}
              id={`team-project-${project.id}`}
              context={{
                ...getDefaultGlassContext(),
                serviceCategory: 'team',
                completion: project.progress / 100,
                urgency: project.status === 'in_progress' ? 'medium' : 'low'
              }}
            >
              <Card className="p-4 border-0 bg-transparent">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{project.title}</h4>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
                <Badge
                  className={
                    project.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : project.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }
                >
                  {project.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>${project.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{project.startDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{project.members.length} members</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {project.members.slice(0, 3).map(memberId => {
                    const member = members.find(m => m.id === memberId);
                    return (
                      <div
                        key={memberId}
                        className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center"
                        title={member?.name}
                      >
                        <span className="text-xs font-medium">{member?.name.charAt(0)}</span>
                      </div>
                    );
                  })}
                  {project.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs">+{project.members.length - 3}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
            </GlassSurface>
          ))}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          {goals.map(goal => (
            <GlassSurface
              key={goal.id}
              id={`team-goal-${goal.id}`}
              context={{
                ...getDefaultGlassContext(),
                serviceCategory: 'team',
                completion: goal.current / goal.target,
                urgency: goal.current / goal.target > 0.8 ? 'high' : 'medium'
              }}
            >
              <Card className="p-4 border-0 bg-transparent">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">{goal.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                {goal.reward && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    <Trophy className="w-3 h-3 mr-1" weight="fill" />
                    Reward
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    Due: {goal.deadline.toLocaleDateString()}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {((goal.current / goal.target) * 100).toFixed(0)}% complete
                </p>
              </div>
            </Card>
            </GlassSurface>
          ))}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <GlassSurface
            id="team-leaderboard"
            context={{
              ...getDefaultGlassContext(),
              serviceCategory: 'team',
              confidence: 0.95
            }}
          >
            <Card className="p-4 border-0 bg-transparent">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" weight="fill" />
              Monthly Top Performers
            </h4>
            <div className="space-y-3">
              {[...members]
                .sort((a, b) => b.completedJobs - a.completedJobs)
                .map((member, i) => (
                  <div
                    key={member.id}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      i === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-muted/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        i === 0
                          ? 'bg-yellow-500 text-white'
                          : i === 1
                          ? 'bg-gray-400 text-white'
                          : i === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.completedJobs} jobs • ${(member.earnings / 1000).toFixed(0)}K earned
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" weight="fill" />
                      <span className="font-medium">{member.rating}</span>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
          </GlassSurface>
        </TabsContent>
      </Tabs>
    </div>
  );
}
