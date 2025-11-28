// Subcontractor Dashboard - Specialized interface for subcontractors
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HardHat,
  Briefcase,
  CurrencyDollar,
  Clock,
  CheckCircle,
  MapPin,
  Star,
  Calendar,
  Users,
  TrendUp,
  Phone,
  Envelope,
  Certificate,
  Wrench,
  ArrowRight,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import type { User, Job } from '@/lib/types';
import { toast } from 'sonner';

interface SubcontractorDashboardProps {
  user?: User;
  subTab?: string | null;
}

// Sample team opportunities
const sampleTeamOpportunities = [
  {
    id: 'team-1',
    gcName: 'Premier Renovations LLC',
    gcRating: 96,
    projectTitle: 'Kitchen Remodel - Electrical Work',
    location: 'Atlanta, GA',
    payRate: 85,
    duration: '3 days',
    startDate: 'Dec 5, 2024',
    specialty: 'Electrical',
    status: 'open',
  },
  {
    id: 'team-2',
    gcName: 'BuildRight Construction',
    gcRating: 92,
    projectTitle: 'Commercial HVAC Installation',
    location: 'Austin, TX',
    payRate: 95,
    duration: '2 weeks',
    startDate: 'Dec 10, 2024',
    specialty: 'HVAC',
    status: 'open',
  },
  {
    id: 'team-3',
    gcName: 'Home Masters Inc',
    gcRating: 88,
    projectTitle: 'Bathroom Renovation - Plumbing',
    location: 'Denver, CO',
    payRate: 80,
    duration: '5 days',
    startDate: 'Dec 8, 2024',
    specialty: 'Plumbing',
    status: 'pending',
  },
];

// Sample work history
const sampleWorkHistory = [
  {
    id: 'work-1',
    gcName: 'Premier Renovations LLC',
    projectTitle: 'Office Complex Electrical',
    completedDate: 'Nov 15, 2024',
    earnings: 3500,
    rating: 98,
    hoursWorked: 40,
  },
  {
    id: 'work-2',
    gcName: 'BuildRight Construction',
    projectTitle: 'Residential HVAC Install',
    completedDate: 'Nov 1, 2024',
    earnings: 2800,
    rating: 95,
    hoursWorked: 32,
  },
  {
    id: 'work-3',
    gcName: 'Quality Contractors',
    projectTitle: 'Restaurant Plumbing',
    completedDate: 'Oct 20, 2024',
    earnings: 4200,
    rating: 92,
    hoursWorked: 48,
  },
];

export function SubcontractorDashboard({ user, subTab }: SubcontractorDashboardProps) {
  const [activeTab, setActiveTab] = useState(subTab || 'dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const profile = user?.contractorProfile;

  if (!user || !profile) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <HardHat className="w-20 h-20 text-muted-foreground mx-auto mb-4" weight="duotone" />
          <h3 className="text-xl font-bold mb-2">Complete Your Subcontractor Profile</h3>
          <p className="text-muted-foreground mb-6">
            Set up your profile to start receiving team opportunities from general contractors.
          </p>
          <Button size="lg">Complete Profile</Button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalEarnings = sampleWorkHistory.reduce((acc, w) => acc + w.earnings, 0);
  const totalHours = sampleWorkHistory.reduce((acc, w) => acc + w.hoursWorked, 0);
  const avgRating = sampleWorkHistory.reduce((acc, w) => acc + w.rating, 0) / sampleWorkHistory.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-border shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold bg-secondary/10 text-secondary">
                    {user.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {profile.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full border-2 border-card flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" weight="fill" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                  <Badge variant="secondary">
                    <HardHat className="w-3 h-3 mr-1" />
                    Subcontractor
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent" weight="fill" />
                    <span className="text-sm font-semibold">{profile.rating}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4" />
                    <span>{profile.completedJobs} jobs completed</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge 
                variant={profile.availability === 'available' ? 'default' : 'secondary'}
                className="mb-2"
              >
                {profile.availability === 'available' ? 'Available for Work' : 'Busy'}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CurrencyDollar className="w-4 h-4" />
                <span>${profile.hourlyRate}/hr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Briefcase className="w-4 h-4" />
              <span>Available Opportunities</span>
            </div>
            <p className="text-3xl font-bold text-primary font-mono">
              {sampleTeamOpportunities.filter(o => o.status === 'open').length}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CurrencyDollar className="w-4 h-4" />
              <span>Total Earnings</span>
            </div>
            <p className="text-3xl font-bold text-accent font-mono">
              ${totalEarnings.toLocaleString()}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span>Hours Worked</span>
            </div>
            <p className="text-3xl font-bold text-foreground font-mono">{totalHours}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Star className="w-4 h-4" />
              <span>Avg Rating</span>
            </div>
            <p className="text-3xl font-bold text-secondary font-mono">{avgRating.toFixed(0)}</p>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-3xl grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="history">Work History</TabsTrigger>
            <TabsTrigger value="skills">Skills & Certs</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Latest Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sampleTeamOpportunities.slice(0, 3).map(opp => (
                    <div key={opp.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{opp.projectTitle}</h4>
                          <p className="text-sm text-muted-foreground">{opp.gcName}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {opp.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {opp.startDate}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">${opp.payRate}/hr</p>
                          <Badge variant={opp.status === 'open' ? 'default' : 'secondary'}>
                            {opp.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('opportunities')}>
                    View All Opportunities
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Skills Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Your Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.skills.slice(0, 5).map((skill, index) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill}</span>
                        <span className="text-sm text-muted-foreground">{85 + index * 3}%</span>
                      </div>
                      <Progress value={85 + index * 3} className="h-2" />
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('skills')}>
                    Manage Skills
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Work */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Recent Completed Work
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sampleWorkHistory.map(work => (
                      <div key={work.id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-1">{work.projectTitle}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{work.gcName}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500" weight="fill" />
                            <span className="font-medium">{work.rating}</span>
                          </div>
                          <span className="font-bold text-accent">${work.earnings}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{work.completedDate}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="opportunities">
            <div className="mb-6">
              <div className="relative max-w-md">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {sampleTeamOpportunities
                .filter(opp => 
                  opp.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  opp.gcName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  opp.location.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((opp, index) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{opp.projectTitle}</h3>
                          <Badge>{opp.specialty}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-medium">{opp.gcName}</span>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-amber-500" weight="fill" />
                            <span>{opp.gcRating}/100</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {opp.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Starts: {opp.startDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Duration: {opp.duration}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${opp.payRate}/hr</p>
                        <Button 
                          className="mt-2"
                          onClick={() => toast.success(`Applied to ${opp.projectTitle}`)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {sampleWorkHistory.map((work, index) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{work.projectTitle}</h3>
                        <p className="text-muted-foreground mb-3">Worked with: {work.gcName}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Completed: {work.completedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {work.hoursWorked} hours
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500" weight="fill" />
                            <span className="font-medium text-foreground">{work.rating}/100</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Earned</p>
                        <p className="text-2xl font-bold text-accent">${work.earnings.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Your Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.skills.map((skill, index) => (
                    <div key={skill} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Wrench className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{skill}</p>
                          <p className="text-xs text-muted-foreground">{5 + index} years experience</p>
                        </div>
                      </div>
                      <Badge variant="outline">Verified</Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add New Skill
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Certificate className="w-5 h-5" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.licenses.map((license, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{license.type}</h4>
                          <p className="text-sm text-muted-foreground">License #{license.number}</p>
                          <p className="text-xs text-muted-foreground mt-1">State: {license.state}</p>
                        </div>
                        <div className="text-right">
                          {license.verified ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Expires: {new Date(license.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add Certification
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
