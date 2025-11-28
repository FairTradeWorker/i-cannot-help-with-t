/**
 * Client Portal System
 * Allow clients to view project progress, documents, and communicate
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Home, FileText, MessageSquare, Camera, Calendar, DollarSign,
  CheckCircle, Clock, AlertCircle, Download, Eye, Send,
  Bell, Settings, LogOut, Star, Paperclip, ChevronRight
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  contractor: {
    name: string;
    avatar: string;
    phone: string;
    email: string;
    rating: number;
    reviewCount: number;
  };
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  progress: number;
  startDate: Date;
  estimatedEnd: Date;
  budget: number;
  spent: number;
  milestones: Array<{
    id: string;
    name: string;
    status: 'completed' | 'in-progress' | 'pending';
    date?: Date;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    date: Date;
    size: string;
  }>;
  photos: Array<{
    id: string;
    url: string;
    caption: string;
    date: Date;
  }>;
  updates: Array<{
    id: string;
    message: string;
    date: Date;
    type: 'progress' | 'milestone' | 'photo' | 'document';
  }>;
}

const mockProject: Project = {
  id: '1',
  name: 'Kitchen Renovation',
  description: 'Complete kitchen remodel including new cabinets, countertops, flooring, and appliances.',
  contractor: {
    name: 'Mike\'s Contracting',
    avatar: 'https://i.pravatar.cc/150?img=12',
    phone: '(512) 555-1234',
    email: 'mike@mikescontracting.com',
    rating: 4.9,
    reviewCount: 127,
  },
  status: 'in-progress',
  progress: 65,
  startDate: new Date('2024-01-15'),
  estimatedEnd: new Date('2024-03-01'),
  budget: 25000,
  spent: 16250,
  milestones: [
    { id: '1', name: 'Design Approval', status: 'completed', date: new Date('2024-01-20') },
    { id: '2', name: 'Demolition', status: 'completed', date: new Date('2024-01-25') },
    { id: '3', name: 'Electrical & Plumbing', status: 'completed', date: new Date('2024-02-05') },
    { id: '4', name: 'Cabinet Installation', status: 'in-progress' },
    { id: '5', name: 'Countertop Installation', status: 'pending' },
    { id: '6', name: 'Final Inspection', status: 'pending' },
  ],
  documents: [
    { id: '1', name: 'Contract Agreement.pdf', type: 'pdf', date: new Date('2024-01-10'), size: '245 KB' },
    { id: '2', name: 'Design Plans.pdf', type: 'pdf', date: new Date('2024-01-15'), size: '1.2 MB' },
    { id: '3', name: 'Invoice #1.pdf', type: 'pdf', date: new Date('2024-01-28'), size: '98 KB' },
    { id: '4', name: 'Material Specifications.pdf', type: 'pdf', date: new Date('2024-01-18'), size: '520 KB' },
  ],
  photos: [
    { id: '1', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', caption: 'Before - Original Kitchen', date: new Date('2024-01-15') },
    { id: '2', url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400', caption: 'Demolition Complete', date: new Date('2024-01-26') },
    { id: '3', url: 'https://images.unsplash.com/photo-1556909190-6fd1af7e9d7f?w=400', caption: 'New Electrical', date: new Date('2024-02-02') },
    { id: '4', url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400', caption: 'Cabinets Being Installed', date: new Date('2024-02-10') },
  ],
  updates: [
    { id: '1', message: 'Cabinet installation started today. Should be completed within 3 days.', date: new Date('2024-02-10'), type: 'progress' },
    { id: '2', message: 'Electrical and plumbing work completed and passed inspection!', date: new Date('2024-02-05'), type: 'milestone' },
    { id: '3', message: 'Added new progress photos of the electrical work', date: new Date('2024-02-02'), type: 'photo' },
    { id: '4', message: 'Demolition phase completed ahead of schedule', date: new Date('2024-01-26'), type: 'milestone' },
  ],
};

type TabType = 'overview' | 'timeline' | 'documents' | 'photos' | 'messages' | 'payments';

export function ClientPortal() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [project] = useState<Project>(mockProject);
  const [message, setMessage] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'timeline', label: 'Timeline', icon: <Calendar className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
    { id: 'photos', label: 'Photos', icon: <Camera className="w-4 h-4" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <DollarSign className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Client Portal</h1>
                <p className="text-sm text-gray-500">Welcome back, Sarah</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Project Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace('-', ' ')}
                </Badge>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">{project.name}</h2>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src={project.contractor.avatar} 
                  alt={project.contractor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{project.contractor.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm">{project.contractor.rating} ({project.contractor.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Project Progress</span>
                <span className="text-sm font-bold text-blue-600">{project.progress}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'bg-blue-600' : ''}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Budget Used</p>
                        <p className="text-lg font-bold">{formatCurrency(project.spent)} / {formatCurrency(project.budget)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Est. Completion</p>
                        <p className="text-lg font-bold">{formatDate(project.estimatedEnd)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.updates.map(update => (
                      <div key={update.id} className="flex gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          update.type === 'milestone' ? 'bg-green-100' :
                          update.type === 'photo' ? 'bg-purple-100' :
                          'bg-blue-100'
                        }`}>
                          {update.type === 'milestone' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                           update.type === 'photo' ? <Camera className="w-4 h-4 text-purple-600" /> :
                           <Clock className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700">{update.message}</p>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(update.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Milestones */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Project Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-start gap-3">
                        <div className="relative">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            milestone.status === 'completed' ? 'bg-green-500' :
                            milestone.status === 'in-progress' ? 'bg-blue-500' :
                            'bg-gray-200'
                          }`}>
                            {milestone.status === 'completed' ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : milestone.status === 'in-progress' ? (
                              <Clock className="w-4 h-4 text-white" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-400" />
                            )}
                          </div>
                          {index < project.milestones.length - 1 && (
                            <div className={`absolute left-3 top-6 w-0.5 h-8 ${
                              milestone.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            milestone.status === 'completed' ? 'text-gray-900' :
                            milestone.status === 'in-progress' ? 'text-blue-600' :
                            'text-gray-500'
                          }`}>{milestone.name}</p>
                          {milestone.date && (
                            <p className="text-sm text-gray-500">{formatDate(milestone.date)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Contractor */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Contact Contractor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <a 
                      href={`tel:${project.contractor.phone}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        📞
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Call</p>
                        <p className="text-sm text-gray-500">{project.contractor.phone}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </a>
                    <a 
                      href={`mailto:${project.contractor.email}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        ✉️
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-500">{project.contractor.email}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.documents.map(doc => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.size} • {formatDate(doc.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'photos' && (
          <Card>
            <CardHeader>
              <CardTitle>Project Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.photos.map(photo => (
                  <div key={photo.id} className="group relative">
                    <img 
                      src={photo.url} 
                      alt={photo.caption}
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end p-3">
                      <div className="text-white">
                        <p className="font-medium text-sm">{photo.caption}</p>
                        <p className="text-xs opacity-75">{formatDate(photo.date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'messages' && (
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  <div className="flex gap-3">
                    <img 
                      src={project.contractor.avatar} 
                      alt={project.contractor.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-md">
                      <p className="text-sm">Good morning! Just wanted to let you know the cabinets arrived and we'll start installation today.</p>
                      <p className="text-xs text-gray-500 mt-1">9:30 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-3 max-w-md">
                      <p className="text-sm">That's great news! Can't wait to see them installed.</p>
                      <p className="text-xs opacity-75 mt-1">9:45 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <img 
                      src={project.contractor.avatar} 
                      alt={project.contractor.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-md">
                      <p className="text-sm">I'll send you photos once the first row is complete. Should be around noon.</p>
                      <p className="text-xs text-gray-500 mt-1">9:48 AM</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">Total Budget</p>
                    <p className="text-2xl font-bold">{formatCurrency(project.budget)}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-600">Paid</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(project.spent)}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-600">Remaining</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(project.budget - project.spent)}</p>
                  </div>
                </div>

                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(project.spent / project.budget) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">{Math.round((project.spent / project.budget) * 100)}% of budget used</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Initial Deposit (30%)</p>
                        <p className="text-sm text-gray-500">Paid on Jan 15, 2024</p>
                      </div>
                    </div>
                    <p className="font-bold text-green-600">{formatCurrency(7500)}</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Midpoint Payment (35%)</p>
                        <p className="text-sm text-gray-500">Paid on Feb 5, 2024</p>
                      </div>
                    </div>
                    <p className="font-bold text-green-600">{formatCurrency(8750)}</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">Final Payment (35%)</p>
                        <p className="text-sm text-gray-500">Due upon completion</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(8750)}</p>
                      <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                        Pay Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'timeline' && (
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-8">
                  {project.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="relative flex gap-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        milestone.status === 'completed' ? 'bg-green-500' :
                        milestone.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                        'bg-gray-200'
                      }`}>
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : milestone.status === 'in-progress' ? (
                          <Clock className="w-5 h-5 text-white" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className={`p-4 rounded-xl ${
                          milestone.status === 'completed' ? 'bg-green-50' :
                          milestone.status === 'in-progress' ? 'bg-blue-50' :
                          'bg-gray-50'
                        }`}>
                          <p className="font-semibold">{milestone.name}</p>
                          {milestone.date && (
                            <p className="text-sm text-gray-500 mt-1">{formatDate(milestone.date)}</p>
                          )}
                          {milestone.status === 'in-progress' && (
                            <Badge className="mt-2 bg-blue-100 text-blue-700">In Progress</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ClientPortal;
