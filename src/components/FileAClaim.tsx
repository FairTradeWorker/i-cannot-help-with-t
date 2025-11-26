import { useState } from 'react';
import { ShieldCheck, Upload, FileText,
import { ShieldCheck, Upload, FileText, User, MapPin, Calendar, Phone } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

    warrantyNumber: '',
  const [formData, setFormData] = useState({
    jobType: '',
    email: '',

    warrantyNumber: '',
      jobAddress: '
      jobType: '',
    });
  };
  con

  };

      <motion.div
        animate={{ opac
      >
          <div cl
          </div>
            <h1 
          </div>
      </motion.div>
      <Card className
          <div class
              <Lab
                Your N
       
                v
    


              <Label html
                Phone Number
     
    

          
            </div>
            <div 
                Email
              <Input
                type="email"
       
                className="border-2 h-12"
            </div>
            <div className="space-y-2">
                
              <
                id="warrantyNumber"
                onChange={(e) => setFormData({ ...formData, warrantyNumber: e.target.value
                
            </
            <div cl

              </Label>
                id="jobAddress"
                onChange={(e) => setFormData({ ...formData, jobAd
            <div className="space-y-2">
            </div>
            <div className="space-y-2">
                <Calendar
              </Label>
                id="
                value={formData.i
                required
              />

              <Label htmlFor="jobType" cl
              </
                id

                required
              />
          </div>
          <div className="sp
              Descript
            <Textare
              value={formD
              placeholder=
              className="border-2 min-
          </div>
          <div className
              <Upload className="w-4 h-4 
            </La
              id="

              className="border-2 h-12"
            {files.length > 0 && (
                {file
            )}

            type="submit"
            className="w-ful
            Submit Claim
        </form>
    </div>
}



















                <MapPin className="w-4 h-4 inline mr-2" />
                Job Address
              </Label>




















































































