import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Upload, FileText, User, MapPin, Calendar, Phone } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function FileAClaim() {
  const [formData, setFormData] = useState({
    claimantName: '',
    email: '',
    phone: '',
    warrantyNumber: '',
    jobAddress: '',
    issueDate: '',
    jobType: '',
    description: '',
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Claim submitted successfully! We\'ll review within 24 hours.');
    setFormData({
      claimantName: '',
      email: '',
      phone: '',
      warrantyNumber: '',
      jobAddress: '',
      issueDate: '',
      jobType: '',
      description: '',
    });
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-black rounded-lg">
            <ShieldCheck className="w-8 h-8 text-white" weight="fill" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">FILE A CLAIM</h1>
            <p className="text-muted-foreground">Submit your warranty claim in minutes</p>
          </div>
        </div>
      </motion.div>

      <Card className="border-2 border-border p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="claimantName" className="text-sm font-bold uppercase">
                <User className="w-4 h-4 inline mr-2" />
                Your Name
              </Label>
              <Input
                id="claimantName"
                value={formData.claimantName}
                onChange={(e) => setFormData({ ...formData, claimantName: e.target.value })}
                required
                className="border-2 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-bold uppercase">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="border-2 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold uppercase">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border-2 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyNumber" className="text-sm font-bold uppercase">
                <FileText className="w-4 h-4 inline mr-2" />
                Warranty Number
              </Label>
              <Input
                id="warrantyNumber"
                value={formData.warrantyNumber}
                onChange={(e) => setFormData({ ...formData, warrantyNumber: e.target.value })}
                required
                className="border-2 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobAddress" className="text-sm font-bold uppercase">
                <MapPin className="w-4 h-4 inline mr-2" />
                Job Address
              </Label>
              <Input
                id="jobAddress"
                value={formData.jobAddress}
                onChange={(e) => setFormData({ ...formData, jobAddress: e.target.value })}
                required
                className="border-2 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueDate" className="text-sm font-bold uppercase">
                <Calendar className="w-4 h-4 inline mr-2" />
                Issue Date
              </Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                required
                className="border-2 h-12"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="jobType" className="text-sm font-bold uppercase">
                Job Type
              </Label>
              <Input
                id="jobType"
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                placeholder="e.g., Roofing, HVAC, Plumbing"
                required
                className="border-2 h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold uppercase">
              Description of Issue
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please describe the issue in detail..."
              required
              className="border-2 min-h-32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="files" className="text-sm font-bold uppercase">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Photos/Documents
            </Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={handleFileChange}
              className="border-2 h-12"
            />
            {files.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {files.length} file(s) selected
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-black hover:bg-black/90 text-white font-black uppercase h-14 text-base"
          >
            Submit Claim
          </Button>
        </form>
      </Card>
    </div>
  );
}
