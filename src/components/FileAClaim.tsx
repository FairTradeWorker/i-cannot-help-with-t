import { useState } from 'react';
import { ShieldCheck, Upload, FileText, User, MapPin, Calendar, Phone } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export function FileAClaim() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    warrantyNumber: '',
    jobAddress: '',
    installDate: '',
    jobType: '',
    description: '',
  });
  
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Claim submitted successfully! We will review and contact you within 2 business days.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      warrantyNumber: '',
      jobAddress: '',
      installDate: '',
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
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-primary">
            <ShieldCheck className="w-7 h-7 text-white" weight="fill" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">File a Warranty Claim</h1>
            <p className="text-muted-foreground">Submit your claim and we'll review it within 2 business days</p>
          </div>
        </div>
      </motion.div>

      <Card className="glass-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold flex items-center">
                <User className="w-4 h-4 inline mr-2" />
                Your Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Smith"
                required
                className="border-2 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold flex items-center">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                required
                className="border-2 h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
              className="border-2 h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warrantyNumber" className="text-sm font-semibold flex items-center">
              <FileText className="w-4 h-4 inline mr-2" />
              Warranty Number
            </Label>
            <Input
              id="warrantyNumber"
              value={formData.warrantyNumber}
              onChange={(e) => setFormData({ ...formData, warrantyNumber: e.target.value })}
              placeholder="WRN-12345-ABCD"
              required
              className="border-2 h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobAddress" className="text-sm font-semibold flex items-center">
              <MapPin className="w-4 h-4 inline mr-2" />
              Job Address
            </Label>
            <Input
              id="jobAddress"
              value={formData.jobAddress}
              onChange={(e) => setFormData({ ...formData, jobAddress: e.target.value })}
              placeholder="123 Main St, City, State ZIP"
              required
              className="border-2 h-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="installDate" className="text-sm font-semibold flex items-center">
                <Calendar className="w-4 h-4 inline mr-2" />
                Installation Date
              </Label>
              <Input
                id="installDate"
                type="date"
                value={formData.installDate}
                onChange={(e) => setFormData({ ...formData, installDate: e.target.value })}
                required
                className="border-2 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobType" className="text-sm font-semibold">
                Job Type
              </Label>
              <Input
                id="jobType"
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                placeholder="Roofing, HVAC, etc."
                required
                className="border-2 h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
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
            <Label htmlFor="files" className="text-sm font-semibold flex items-center">
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
              <p className="text-sm text-muted-foreground">{files.length} file(s) selected</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
          >
            Submit Claim
          </Button>
        </form>
      </Card>
    </div>
  );
}
