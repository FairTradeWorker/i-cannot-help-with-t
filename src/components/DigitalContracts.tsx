import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { GlassSurface } from './GlassSurface';
import { getDefaultGlassContext } from '@/lib/glass-context-utils';
import {
  FileText,
  Signature,
  CheckCircle,
  Clock,
  DownloadSimple,
  Eye,
  PencilSimple,
  Warning,
  ShieldCheck,
  Calendar,
  User,
  ArrowRight,
  X,
} from '@phosphor-icons/react';

interface Contract {
  id: string;
  title: string;
  type: 'job' | 'territory' | 'partnership' | 'nda';
  status: 'draft' | 'pending_signature' | 'signed' | 'expired' | 'void';
  parties: { name: string; email: string; signed: boolean; signedAt?: Date }[];
  createdAt: Date;
  expiresAt?: Date;
  value?: number;
  jobId?: string;
}

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  usageCount: number;
}

const MOCK_CONTRACTS: Contract[] = [
  {
    id: '1',
    title: 'Roofing Project Agreement',
    type: 'job',
    status: 'pending_signature',
    parties: [
      { name: 'John Smith', email: 'john@example.com', signed: true, signedAt: new Date() },
      { name: 'ABC Roofing', email: 'contractor@abc.com', signed: false },
    ],
    createdAt: new Date(),
    value: 15000,
    jobId: 'job-123',
  },
  {
    id: '2',
    title: 'Territory License - Austin, TX',
    type: 'territory',
    status: 'signed',
    parties: [
      { name: 'Platform Inc', email: 'legal@platform.com', signed: true, signedAt: new Date(Date.now() - 86400000 * 30) },
      { name: 'Mike Johnson', email: 'mike@operator.com', signed: true, signedAt: new Date(Date.now() - 86400000 * 28) },
    ],
    createdAt: new Date(Date.now() - 86400000 * 30),
    expiresAt: new Date(Date.now() + 86400000 * 335),
    value: 45,
  },
  {
    id: '3',
    title: 'Subcontractor NDA',
    type: 'nda',
    status: 'signed',
    parties: [
      { name: 'XYZ Construction', email: 'legal@xyz.com', signed: true, signedAt: new Date(Date.now() - 86400000 * 60) },
      { name: 'Sub Pro LLC', email: 'info@subpro.com', signed: true, signedAt: new Date(Date.now() - 86400000 * 58) },
    ],
    createdAt: new Date(Date.now() - 86400000 * 60),
  },
];

const MOCK_TEMPLATES: ContractTemplate[] = [
  { id: '1', name: 'Standard Job Agreement', description: 'Basic contract for home improvement jobs', category: 'Job', usageCount: 1234 },
  { id: '2', name: 'Subcontractor Agreement', description: 'For hiring subcontractors on projects', category: 'Employment', usageCount: 567 },
  { id: '3', name: 'Change Order Form', description: 'Document scope changes during a project', category: 'Job', usageCount: 892 },
  { id: '4', name: 'Non-Disclosure Agreement', description: 'Protect confidential information', category: 'Legal', usageCount: 445 },
];

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: PencilSimple },
  pending_signature: { label: 'Awaiting Signature', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  signed: { label: 'Signed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  expired: { label: 'Expired', color: 'bg-red-100 text-red-700', icon: Warning },
  void: { label: 'Void', color: 'bg-gray-100 text-gray-500', icon: X },
};

export function DigitalContracts() {
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [templates] = useState<ContractTemplate[]>(MOCK_TEMPLATES);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signature, setSignature] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'signed'>('all');

  const filteredContracts = contracts.filter(c => {
    if (filter === 'pending') return c.status === 'pending_signature';
    if (filter === 'signed') return c.status === 'signed';
    return true;
  });

  const handleSign = useCallback(() => {
    if (!selectedContract || !signature.trim()) return;

    setContracts(prev =>
      prev.map(c => {
        if (c.id === selectedContract.id) {
          return {
            ...c,
            status: 'signed',
            parties: c.parties.map((p, i) =>
              i === c.parties.findIndex(party => !party.signed)
                ? { ...p, signed: true, signedAt: new Date() }
                : p
            ),
          };
        }
        return c;
      })
    );

    setShowSignModal(false);
    setSignature('');
    setSelectedContract(null);
  }, [selectedContract, signature]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-7 h-7" />
            Digital Contracts
          </h2>
          <p className="text-muted-foreground">Manage and sign contracts securely</p>
        </div>
        <Button>
          <PencilSimple className="w-4 h-4 mr-2" />
          Create Contract
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassSurface id="contracts-total" context={{...getDefaultGlassContext(), serviceCategory: 'contracts'}}>
          <Card className="p-4 border-0 bg-transparent">
            <p className="text-xs text-muted-foreground">Total Contracts</p>
            <p className="text-2xl font-bold">{contracts.length}</p>
          </Card>
        </GlassSurface>
        <GlassSurface id="contracts-pending" context={{...getDefaultGlassContext(), serviceCategory: 'contracts', urgency: 'high'}}>
          <Card className="p-4 border-0 bg-transparent">
            <p className="text-xs text-muted-foreground">Pending Signature</p>
            <p className="text-2xl font-bold text-yellow-600">
              {contracts.filter(c => c.status === 'pending_signature').length}
            </p>
          </Card>
        </GlassSurface>
        <GlassSurface id="contracts-signed" context={{...getDefaultGlassContext(), serviceCategory: 'contracts', completion: 1, confidence: 0.95}}>
          <Card className="p-4 border-0 bg-transparent">
            <p className="text-xs text-muted-foreground">Signed</p>
            <p className="text-2xl font-bold text-green-600">
              {contracts.filter(c => c.status === 'signed').length}
            </p>
          </Card>
        </GlassSurface>
        <GlassSurface id="contracts-value" context={{...getDefaultGlassContext(), serviceCategory: 'contracts', confidence: 0.9}}>
          <Card className="p-4 border-0 bg-transparent">
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">
              ${contracts.reduce((sum, c) => sum + (c.value || 0), 0).toLocaleString()}
            </p>
          </Card>
        </GlassSurface>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'signed'] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f === 'pending' ? 'Awaiting Signature' : f}
          </Button>
        ))}
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.map(contract => {
          const StatusIcon = STATUS_CONFIG[contract.status].icon;
          return (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
            >
              <GlassSurface
                id={`contract-${contract.id}`}
                context={{
                  ...getDefaultGlassContext(),
                  serviceCategory: 'contracts',
                  urgency: contract.status === 'pending_signature' ? 'high' : 'low',
                  completion: contract.status === 'signed' ? 1 : 0
                }}
              >
                <Card className="p-4 border-0 bg-transparent">
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{contract.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Created {contract.createdAt.toLocaleDateString()}
                        {contract.value && (
                          <>
                            <span>•</span>
                            <span>${contract.value.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className={STATUS_CONFIG[contract.status].color}>
                      <StatusIcon className="w-3 h-3 mr-1" weight="fill" />
                      {STATUS_CONFIG[contract.status].label}
                    </Badge>

                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <DownloadSimple className="w-4 h-4" />
                      </Button>
                      {contract.status === 'pending_signature' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedContract(contract);
                            setShowSignModal(true);
                          }}
                        >
                          <Signature className="w-4 h-4 mr-1" />
                          Sign
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Parties Progress */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">Signatures:</span>
                    <div className="flex-1 flex items-center gap-2">
                      {contract.parties.map((party, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              party.signed ? 'bg-green-100' : 'bg-gray-100'
                            }`}
                          >
                            {party.signed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                            ) : (
                              <User className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <span className="text-xs">{party.name}</span>
                          {i < contract.parties.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-muted-foreground mx-1" />
                          )}
                        </div>
                      ))}
                    </div>
                    <Progress
                      value={(contract.parties.filter(p => p.signed).length / contract.parties.length) * 100}
                      className="w-20 h-2"
                    />
                  </div>
                </div>
              </Card>
              </GlassSurface>
            </motion.div>
          );
        })}
      </div>

      {/* Templates Section */}
      <div>
        <h3 className="text-lg font-bold mb-4">Contract Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(template => (
            <GlassSurface
              key={template.id}
              id={`contract-template-${template.id}`}
              context={{
                ...getDefaultGlassContext(),
                serviceCategory: 'contracts',
                confidence: 0.9
              }}
            >
              <Card className="p-4 border-0 bg-transparent cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{template.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Used {template.usageCount.toLocaleString()} times
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Use
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </Card>
            </GlassSurface>
          ))}
        </div>
      </div>

      {/* Sign Modal */}
      <AnimatePresence>
        {showSignModal && selectedContract && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowSignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary">
                  <Signature className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Sign Contract</h3>
                  <p className="text-sm text-muted-foreground">{selectedContract.title}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm mb-2">
                    By signing, you agree to the terms outlined in this contract. This signature
                    is legally binding.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>Your signature is encrypted and securely stored</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Type your full legal name to sign
                  </label>
                  <Input
                    value={signature}
                    onChange={e => setSignature(e.target.value)}
                    placeholder="Enter your full name"
                    className="font-serif text-lg italic"
                  />
                </div>

                {signature && (
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <p className="font-serif text-2xl italic">{signature}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowSignModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSign}
                    disabled={!signature.trim()}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Sign Contract
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
