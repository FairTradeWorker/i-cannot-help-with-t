/**
 * Safety & Compliance System
 * Track safety certifications, compliance documents, and training
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Award, FileCheck, AlertTriangle, Calendar,
  CheckCircle, Clock, XCircle, Download, Eye, Upload,
  Users, BookOpen, Bell, TrendingUp
} from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  holder: string;
  holderId: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'valid' | 'expiring' | 'expired';
  documentUrl?: string;
  certificateNumber: string;
}

interface SafetyTraining {
  id: string;
  name: string;
  description: string;
  requiredFor: string[];
  completedBy: Array<{ name: string; completedDate: Date }>;
  dueDate?: Date;
  duration: string;
  isRequired: boolean;
}

interface IncidentReport {
  id: string;
  date: Date;
  type: 'injury' | 'near-miss' | 'property-damage' | 'safety-violation';
  severity: 'low' | 'medium' | 'high';
  description: string;
  location: string;
  reportedBy: string;
  status: 'open' | 'investigating' | 'resolved';
  correctiveAction?: string;
}

const mockCertifications: Certification[] = [
  {
    id: '1',
    name: 'OSHA 30-Hour Construction',
    issuer: 'OSHA',
    holder: 'Mike Johnson',
    holderId: 'emp-1',
    issueDate: new Date('2023-06-15'),
    expiryDate: new Date('2028-06-15'),
    status: 'valid',
    certificateNumber: 'OSHA-30-2023-12345',
  },
  {
    id: '2',
    name: 'CPR & First Aid',
    issuer: 'American Red Cross',
    holder: 'Mike Johnson',
    holderId: 'emp-1',
    issueDate: new Date('2023-09-01'),
    expiryDate: new Date('2025-09-01'),
    status: 'valid',
    certificateNumber: 'ARC-FA-2023-67890',
  },
  {
    id: '3',
    name: 'Electrical License',
    issuer: 'Texas TDLR',
    holder: 'Sarah Williams',
    holderId: 'emp-2',
    issueDate: new Date('2022-03-01'),
    expiryDate: new Date('2024-03-01'),
    status: 'expiring',
    certificateNumber: 'TX-ELEC-2022-11111',
  },
  {
    id: '4',
    name: 'HVAC Certification',
    issuer: 'EPA Section 608',
    holder: 'John Davis',
    holderId: 'emp-3',
    issueDate: new Date('2021-08-15'),
    expiryDate: new Date('2024-01-15'),
    status: 'expired',
    certificateNumber: 'EPA-608-2021-22222',
  },
  {
    id: '5',
    name: 'Forklift Operator',
    issuer: 'OSHA',
    holder: 'Tom Brown',
    holderId: 'emp-4',
    issueDate: new Date('2023-11-01'),
    expiryDate: new Date('2026-11-01'),
    status: 'valid',
    certificateNumber: 'OSHA-FL-2023-33333',
  },
];

const mockTraining: SafetyTraining[] = [
  {
    id: '1',
    name: 'Fall Protection Training',
    description: 'Proper use of fall protection equipment, anchor points, and rescue procedures',
    requiredFor: ['All field workers'],
    completedBy: [
      { name: 'Mike Johnson', completedDate: new Date('2024-01-15') },
      { name: 'Sarah Williams', completedDate: new Date('2024-01-15') },
      { name: 'Tom Brown', completedDate: new Date('2024-01-16') },
    ],
    duration: '4 hours',
    isRequired: true,
  },
  {
    id: '2',
    name: 'Hazard Communication (HazCom)',
    description: 'Understanding SDS sheets, chemical hazards, and proper PPE usage',
    requiredFor: ['All employees'],
    completedBy: [
      { name: 'Mike Johnson', completedDate: new Date('2024-01-10') },
      { name: 'Sarah Williams', completedDate: new Date('2024-01-10') },
    ],
    duration: '2 hours',
    isRequired: true,
  },
  {
    id: '3',
    name: 'Confined Space Entry',
    description: 'Safe entry procedures for confined spaces, atmospheric testing, and rescue',
    requiredFor: ['HVAC technicians', 'Plumbers'],
    completedBy: [
      { name: 'John Davis', completedDate: new Date('2023-12-01') },
    ],
    duration: '6 hours',
    isRequired: true,
  },
  {
    id: '4',
    name: 'Scaffolding Safety',
    description: 'Proper erection, inspection, and use of scaffolding systems',
    requiredFor: ['Carpenters', 'Painters'],
    completedBy: [],
    dueDate: new Date('2024-03-01'),
    duration: '4 hours',
    isRequired: true,
  },
];

const mockIncidents: IncidentReport[] = [
  {
    id: '1',
    date: new Date('2024-01-20'),
    type: 'near-miss',
    severity: 'medium',
    description: 'Ladder slipped on wet surface. No injury occurred.',
    location: '123 Main St, Austin',
    reportedBy: 'Mike Johnson',
    status: 'resolved',
    correctiveAction: 'Implemented mandatory ladder foot inspection and surface check before use',
  },
  {
    id: '2',
    date: new Date('2024-02-01'),
    type: 'injury',
    severity: 'low',
    description: 'Minor cut on hand while handling sheet metal. First aid applied on site.',
    location: '456 Oak Ave, Round Rock',
    reportedBy: 'Sarah Williams',
    status: 'resolved',
    correctiveAction: 'Reminded team about mandatory cut-resistant gloves for metal work',
  },
  {
    id: '3',
    date: new Date('2024-02-05'),
    type: 'safety-violation',
    severity: 'high',
    description: 'Worker observed without hard hat in active construction zone',
    location: '789 Pine Rd, Cedar Park',
    reportedBy: 'Tom Brown',
    status: 'investigating',
  },
];

const statusColors = {
  valid: 'bg-green-100 text-green-700',
  expiring: 'bg-yellow-100 text-yellow-700',
  expired: 'bg-red-100 text-red-700',
};

const incidentTypeColors = {
  injury: 'bg-red-100 text-red-700',
  'near-miss': 'bg-yellow-100 text-yellow-700',
  'property-damage': 'bg-orange-100 text-orange-700',
  'safety-violation': 'bg-purple-100 text-purple-700',
};

const severityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

export function SafetyCompliance() {
  const [activeTab, setActiveTab] = useState<'certifications' | 'training' | 'incidents'>('certifications');
  const [certifications] = useState<Certification[]>(mockCertifications);
  const [training] = useState<SafetyTraining[]>(mockTraining);
  const [incidents] = useState<IncidentReport[]>(mockIncidents);

  const stats = useMemo(() => {
    const validCerts = certifications.filter(c => c.status === 'valid').length;
    const expiringCerts = certifications.filter(c => c.status === 'expiring').length;
    const expiredCerts = certifications.filter(c => c.status === 'expired').length;
    const completedTraining = training.filter(t => t.completedBy.length > 0).length;
    const openIncidents = incidents.filter(i => i.status !== 'resolved').length;
    const daysWithoutIncident = Math.floor((Date.now() - new Date('2024-02-05').getTime()) / (1000 * 60 * 60 * 24));
    
    return { validCerts, expiringCerts, expiredCerts, completedTraining, openIncidents, daysWithoutIncident };
  }, [certifications, training, incidents]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const getDaysUntil = (date: Date) => {
    const diff = date.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Safety & Compliance</h1>
            <p className="text-gray-600 mt-1">Track certifications, training, and safety incidents</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Shield className="w-4 h-4 mr-2" />
            Safety Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Days Without Incident</p>
                  <p className="text-4xl font-bold">{stats.daysWithoutIncident}</p>
                </div>
                <Shield className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valid Certs</p>
                  <p className="text-xl font-bold text-green-600">{stats.validCerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.expiringCerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expired</p>
                  <p className="text-xl font-bold text-red-600">{stats.expiredCerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Open Incidents</p>
                  <p className="text-xl font-bold text-purple-600">{stats.openIncidents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'certifications' ? 'default' : 'outline'}
            onClick={() => setActiveTab('certifications')}
            className={activeTab === 'certifications' ? 'bg-blue-600' : ''}
          >
            <Award className="w-4 h-4 mr-2" />
            Certifications
          </Button>
          <Button
            variant={activeTab === 'training' ? 'default' : 'outline'}
            onClick={() => setActiveTab('training')}
            className={activeTab === 'training' ? 'bg-blue-600' : ''}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Training
          </Button>
          <Button
            variant={activeTab === 'incidents' ? 'default' : 'outline'}
            onClick={() => setActiveTab('incidents')}
            className={activeTab === 'incidents' ? 'bg-blue-600' : ''}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Incidents
          </Button>
        </div>

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Team Certifications</CardTitle>
                    <Button size="sm" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Add Certificate
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {certifications.map(cert => (
                      <div 
                        key={cert.id}
                        className={`p-4 rounded-xl border-l-4 ${
                          cert.status === 'valid' ? 'border-l-green-500 bg-green-50/50' :
                          cert.status === 'expiring' ? 'border-l-yellow-500 bg-yellow-50/50' :
                          'border-l-red-500 bg-red-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                              <Award className={`w-5 h-5 ${
                                cert.status === 'valid' ? 'text-green-600' :
                                cert.status === 'expiring' ? 'text-yellow-600' :
                                'text-red-600'
                              }`} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{cert.name}</p>
                              <p className="text-sm text-gray-600">{cert.holder}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {cert.issuer} • #{cert.certificateNumber}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={statusColors[cert.status]}>
                              {cert.status === 'valid' ? 'Valid' :
                               cert.status === 'expiring' ? 'Expiring Soon' : 'Expired'}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-2">
                              Expires: {formatDate(cert.expiryDate)}
                            </p>
                            {cert.status === 'expiring' && (
                              <p className="text-xs text-yellow-600 font-medium">
                                {getDaysUntil(cert.expiryDate)} days left
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Bell className="w-4 h-4" />
                    Renewal Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {certifications.filter(c => c.status !== 'valid').map(cert => (
                      <div key={cert.id} className={`p-3 rounded-lg ${
                        cert.status === 'expiring' ? 'bg-yellow-50' : 'bg-red-50'
                      }`}>
                        <p className="font-medium text-sm">{cert.name}</p>
                        <p className="text-xs text-gray-600">{cert.holder}</p>
                        <p className={`text-xs font-medium mt-1 ${
                          cert.status === 'expiring' ? 'text-yellow-700' : 'text-red-700'
                        }`}>
                          {cert.status === 'expiring' 
                            ? `Expires in ${getDaysUntil(cert.expiryDate)} days`
                            : `Expired ${Math.abs(getDaysUntil(cert.expiryDate))} days ago`
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base">Certification by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['OSHA', 'State License', 'EPA', 'First Aid'].map((type, i) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${[80, 60, 40, 100][i]}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{[2, 1, 1, 3][i]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Safety Training Programs</CardTitle>
                    <Button size="sm" variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Schedule Training
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {training.map(course => (
                      <div key={course.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{course.name}</p>
                              {course.isRequired && (
                                <Badge variant="outline" className="text-xs">Required</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs bg-gray-100">
                                <Clock className="w-3 h-3 mr-1" />
                                {course.duration}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-gray-100">
                                <Users className="w-3 h-3 mr-1" />
                                {course.requiredFor.join(', ')}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">
                              {course.completedBy.length} completed
                            </p>
                            {course.dueDate && (
                              <p className="text-xs text-yellow-600 mt-1">
                                Due: {formatDate(course.dueDate)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {course.completedBy.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-gray-500 mb-2">Completed by:</p>
                            <div className="flex flex-wrap gap-2">
                              {course.completedBy.map((person, i) => (
                                <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {person.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Training Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100">
                      <span className="text-3xl font-bold text-green-600">75%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Overall Completion</p>
                  </div>
                  <div className="space-y-3">
                    {training.map(course => {
                      const completion = course.completedBy.length > 0 ? 100 : 0;
                      return (
                        <div key={course.id}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600 truncate">{course.name}</span>
                            <span className="font-medium">{completion}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                completion === 100 ? 'bg-green-500' : 
                                completion > 0 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Incidents Tab */}
        {activeTab === 'incidents' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Incident Reports</CardTitle>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Report Incident
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {incidents.map(incident => (
                      <div key={incident.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className={incidentTypeColors[incident.type]}>
                                {incident.type.replace('-', ' ')}
                              </Badge>
                              <Badge className={severityColors[incident.severity]}>
                                {incident.severity} severity
                              </Badge>
                            </div>
                            <p className="font-medium mt-2">{incident.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{formatDate(incident.date)}</span>
                              <span>{incident.location}</span>
                              <span>Reported by: {incident.reportedBy}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            incident.status === 'resolved' ? 'bg-green-50 text-green-700' :
                            incident.status === 'investigating' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-gray-50 text-gray-700'
                          }>
                            {incident.status}
                          </Badge>
                        </div>
                        
                        {incident.correctiveAction && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-green-700 font-medium">Corrective Action:</p>
                            <p className="text-sm text-green-800">{incident.correctiveAction}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Incident Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-bold text-2xl">{incidents.length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>40% decrease from last month</span>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-3">By Type</p>
                      <div className="space-y-2">
                        {Object.entries(incidentTypeColors).map(([type, color]) => {
                          const count = incidents.filter(i => i.type === type).length;
                          return (
                            <div key={type} className="flex items-center justify-between">
                              <Badge className={color} variant="outline">
                                {type.replace('-', ' ')}
                              </Badge>
                              <span className="text-sm font-medium">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base">Safety Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600">
                      <span className="text-3xl font-bold text-white">A+</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">Excellent safety record</p>
                    <p className="text-xs text-gray-500 mt-1">Based on incidents, compliance, and training</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SafetyCompliance;
