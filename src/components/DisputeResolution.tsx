import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Scales,
  ShieldCheck,
  ChatCircle,
  FileText,
  Clock,
  CheckCircle,
  Warning,
  ArrowRight,
  Upload,
  User,
  CurrencyDollar,
  CalendarBlank,
  Camera,
  Gavel,
  Handshake,
  Info,
  Phone,
  EnvelopeSimple,
} from '@phosphor-icons/react';

interface Dispute {
  id: string;
  jobId: string;
  jobTitle: string;
  status: 'open' | 'under-review' | 'mediation' | 'resolved' | 'escalated';
  type: 'quality' | 'payment' | 'timeline' | 'communication' | 'other';
  filedBy: 'homeowner' | 'contractor';
  filedDate: string;
  amount: number;
  description: string;
  evidence: string[];
  timeline: { date: string; action: string; actor: string }[];
  resolution?: { type: string; amount?: number; description: string; date: string };
}

const sampleDisputes: Dispute[] = [
  {
    id: 'DSP-001',
    jobId: 'JOB-12345',
    jobTitle: 'Kitchen Remodel - Full Renovation',
    status: 'mediation',
    type: 'quality',
    filedBy: 'homeowner',
    filedDate: '2024-01-15',
    amount: 15000,
    description: 'Cabinet installation does not meet agreed specifications.',
    evidence: ['photo1.jpg', 'photo2.jpg', 'contract.pdf'],
    timeline: [
      { date: '2024-01-15', action: 'Dispute filed', actor: 'Homeowner' },
      { date: '2024-01-16', action: 'Contractor notified', actor: 'System' },
      { date: '2024-01-18', action: 'Mediation initiated', actor: 'Platform' },
    ],
  },
  {
    id: 'DSP-002',
    jobId: 'JOB-12346',
    jobTitle: 'Roof Repair - Storm Damage',
    status: 'resolved',
    type: 'payment',
    filedBy: 'contractor',
    filedDate: '2024-01-10',
    amount: 8500,
    description: 'Work completed but payment not released after 7 days.',
    evidence: ['completion_photos.zip', 'signed_off.pdf'],
    timeline: [
      { date: '2024-01-10', action: 'Dispute filed', actor: 'Contractor' },
      { date: '2024-01-12', action: 'Dispute resolved', actor: 'System' },
    ],
    resolution: { type: 'work-completion', amount: 8500, description: 'Full payment released.', date: '2024-01-12' },
  },
];

const disputeTypes = [
  { value: 'quality', label: 'Work Quality', icon: ShieldCheck },
  { value: 'payment', label: 'Payment Issues', icon: CurrencyDollar },
  { value: 'timeline', label: 'Timeline Delays', icon: Clock },
  { value: 'communication', label: 'Communication', icon: ChatCircle },
  { value: 'other', label: 'Other', icon: FileText },
];

export function DisputeResolution() {
  const [activeTab, setActiveTab] = useState<'my-disputes' | 'file-new'>('my-disputes');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [newDispute, setNewDispute] = useState({ jobId: '', type: '', description: '', amount: 0 });

  const getStatusColor = (status: Dispute['status']) => {
    const colors: Record<string, string> = {
      'open': 'bg-yellow-100 text-yellow-800',
      'under-review': 'bg-blue-100 text-blue-800',
      'mediation': 'bg-purple-100 text-purple-800',
      'resolved': 'bg-green-100 text-green-800',
      'escalated': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: Dispute['status']) => {
    const icons: Record<string, React.ReactNode> = {
      'open': <Warning className="w-4 h-4" />,
      'under-review': <Clock className="w-4 h-4" />,
      'mediation': <Handshake className="w-4 h-4" />,
      'resolved': <CheckCircle className="w-4 h-4" />,
      'escalated': <Gavel className="w-4 h-4" />,
    };
    return icons[status] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Scales className="w-6 h-6 text-blue-600" weight="fill" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dispute Resolution Center</h1>
              <p className="text-gray-500">Fair and transparent conflict resolution</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { icon: Warning, color: 'yellow', value: '2', label: 'Open Disputes' },
            { icon: Handshake, color: 'purple', value: '1', label: 'In Mediation' },
            { icon: CheckCircle, color: 'green', value: '12', label: 'Resolved' },
            { icon: Clock, color: 'blue', value: '3.2 days', label: 'Avg. Resolution' },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <Button variant={activeTab === 'my-disputes' ? 'default' : 'outline'} onClick={() => { setActiveTab('my-disputes'); setSelectedDispute(null); }}>
            <FileText className="w-4 h-4 mr-2" />My Disputes
          </Button>
          <Button variant={activeTab === 'file-new' ? 'default' : 'outline'} onClick={() => { setActiveTab('file-new'); setSelectedDispute(null); }}>
            <Warning className="w-4 h-4 mr-2" />File New Dispute
          </Button>
        </div>

        {activeTab === 'my-disputes' && !selectedDispute && (
          <div className="grid gap-4">
            {sampleDisputes.map((dispute) => (
              <Card key={dispute.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedDispute(dispute)}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-gray-500">{dispute.id}</span>
                        <Badge className={getStatusColor(dispute.status)}>{getStatusIcon(dispute.status)}<span className="ml-1 capitalize">{dispute.status.replace('-', ' ')}</span></Badge>
                        <Badge variant="outline" className="capitalize">{dispute.type}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{dispute.jobTitle}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{dispute.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><CalendarBlank className="w-4 h-4" />Filed {new Date(dispute.filedDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><CurrencyDollar className="w-4 h-4" />${dispute.amount.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><User className="w-4 h-4" />Filed by {dispute.filedBy}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedDispute && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">{selectedDispute.jobTitle}<Badge className={getStatusColor(selectedDispute.status)}>{getStatusIcon(selectedDispute.status)}<span className="ml-1 capitalize">{selectedDispute.status.replace('-', ' ')}</span></Badge></CardTitle>
                      <CardDescription className="mt-1">{selectedDispute.id} • {selectedDispute.jobId}</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedDispute(null)}>Back to List</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div><h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4><p className="text-gray-900">{selectedDispute.description}</p></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl"><p className="text-sm text-gray-500 mb-1">Amount in Dispute</p><p className="text-xl font-bold text-gray-900">${selectedDispute.amount.toLocaleString()}</p></div>
                      <div className="p-4 bg-gray-50 rounded-xl"><p className="text-sm text-gray-500 mb-1">Filed By</p><p className="text-xl font-bold text-gray-900 capitalize">{selectedDispute.filedBy}</p></div>
                      <div className="p-4 bg-gray-50 rounded-xl"><p className="text-sm text-gray-500 mb-1">Type</p><p className="text-xl font-bold text-gray-900 capitalize">{selectedDispute.type}</p></div>
                    </div>
                    <div><h4 className="text-sm font-medium text-gray-500 mb-3">Evidence</h4><div className="flex flex-wrap gap-2">{selectedDispute.evidence.map((file, i) => (<div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"><FileText className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-700">{file}</span></div>))}</div></div>
                    {selectedDispute.resolution && (<div className="p-4 bg-green-50 border border-green-200 rounded-xl"><h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5" weight="fill" />Resolution</h4><p className="text-green-700">{selectedDispute.resolution.description}</p>{selectedDispute.resolution.amount && <p className="text-lg font-bold text-green-800 mt-2">Amount: ${selectedDispute.resolution.amount.toLocaleString()}</p>}</div>)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Timeline</CardTitle></CardHeader>
                <CardContent>
                  <div className="relative"><div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" /><div className="space-y-6">{selectedDispute.timeline.map((event, i) => (<div key={i} className="relative flex gap-4 pl-10"><div className="absolute left-2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full" /><div className="flex-1 pb-4"><div className="flex items-center justify-between mb-1"><span className="font-medium text-gray-900">{event.action}</span><span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span></div><span className="text-sm text-gray-500">by {event.actor}</span></div></div>))}</div></div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-lg">Actions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="default"><ChatCircle className="w-4 h-4 mr-2" />Send Message</Button>
                  <Button className="w-full" variant="outline"><Upload className="w-4 h-4 mr-2" />Upload Evidence</Button>
                  <Button className="w-full" variant="outline"><Phone className="w-4 h-4 mr-2" />Request Call</Button>
                  {selectedDispute.status !== 'resolved' && <Button className="w-full text-red-600 border-red-200 hover:bg-red-50" variant="outline"><Gavel className="w-4 h-4 mr-2" />Escalate</Button>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Contact Support</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm"><Phone className="w-5 h-5 text-gray-400" /><div><p className="font-medium text-gray-900">1-800-FAIR-TRADE</p><p className="text-gray-500">Mon-Fri, 9am-6pm EST</p></div></div>
                  <div className="flex items-center gap-3 text-sm"><EnvelopeSimple className="w-5 h-5 text-gray-400" /><div><p className="font-medium text-gray-900">disputes@fairtradeworker.com</p><p className="text-gray-500">Response within 24 hours</p></div></div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6"><div className="flex items-start gap-3"><Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /><div><h4 className="font-medium text-blue-900 mb-1">Escrow Protection</h4><p className="text-sm text-blue-700">All funds are held in escrow until disputes are resolved.</p></div></div></CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'file-new' && (
          <Card>
            <CardHeader><CardTitle>File a New Dispute</CardTitle><CardDescription>Provide details about your dispute. Review within 24-48 hours.</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Job ID</label><Input placeholder="JOB-12345" value={newDispute.jobId} onChange={(e) => setNewDispute(prev => ({ ...prev, jobId: e.target.value }))} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Dispute Type</label><div className="grid grid-cols-5 gap-3">{disputeTypes.map((type) => { const Icon = type.icon; const isSelected = newDispute.type === type.value; return (<button key={type.value} onClick={() => setNewDispute(prev => ({ ...prev, type: type.value }))} className={`p-4 rounded-xl border-2 transition-all text-center ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}><Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} /><span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>{type.label}</span></button>); })}</div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount in Dispute</label><div className="relative"><CurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="number" placeholder="0.00" className="pl-10" value={newDispute.amount || ''} onChange={(e) => setNewDispute(prev => ({ ...prev, amount: Number(e.target.value) }))} /></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea className="w-full border rounded-lg px-4 py-3 min-h-[150px] resize-none" placeholder="Describe the issue in detail..." value={newDispute.description} onChange={(e) => setNewDispute(prev => ({ ...prev, description: e.target.value }))} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Evidence</label><div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center"><Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" /><p className="text-gray-600 mb-2">Drag and drop files or click to upload</p><p className="text-xs text-gray-400">Photos, contracts, messages (PDF, JPG, PNG up to 10MB)</p><Button variant="outline" className="mt-4"><Camera className="w-4 h-4 mr-2" />Upload Files</Button></div></div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl"><div className="flex items-start gap-3"><Warning className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" /><div><h4 className="font-medium text-yellow-900 mb-1">Before Filing</h4><p className="text-sm text-yellow-700">We encourage direct communication first. Many issues can be resolved through messaging.</p></div></div></div>
                <div className="flex gap-4"><Button className="flex-1" size="lg">Submit Dispute<ArrowRight className="w-5 h-5 ml-2" /></Button><Button variant="outline" size="lg" onClick={() => setActiveTab('my-disputes')}>Cancel</Button></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default DisputeResolution;
