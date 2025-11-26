import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlass, Users, Star, MapPin } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContractorCard } from './ContractorCard';
import { ContractorProfileModal } from './ContractorProfileModal';
import { dataStore } from '@/lib/store';
import type { User } from '@/lib/types';

export function ContractorBrowser() {
  const [contractors, setContractors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContractor, setSelectedContractor] = useState<User | null>(null);

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    setLoading(true);
    try {
      const allUsers = await dataStore.getUsers();
      const contractorUsers = allUsers.filter(u => u.role === 'contractor' && u.contractorProfile);
      setContractors(contractorUsers);
    } catch (error) {
      console.error('Failed to load contractors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContractors = contractors.filter(contractor =>
    contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.contractorProfile?.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    contractor.contractorProfile?.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const topRatedContractors = [...filteredContractors].sort((a, b) => 
    (b.contractorProfile?.rating || 0) - (a.contractorProfile?.rating || 0)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-sm font-bold">Loading contractors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-8 h-8 text-primary" weight="fill" />
            <div>
              <h1 className="text-3xl font-bold">Find Contractors</h1>
              <p className="text-sm text-muted-foreground">
                Browse verified professionals in your area
              </p>
            </div>
          </div>
          <div className="relative">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, skill, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-accent" weight="fill" />
            <h2 className="text-2xl font-bold">
              {searchTerm ? 'Search Results' : 'All Contractors'}
            </h2>
            <Badge variant="secondary">{filteredContractors.length}</Badge>
          </div>
        </div>

        {filteredContractors.length === 0 ? (
          <Card className="p-12 text-center">
            <MagnifyingGlass className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-xl font-bold mb-2">No Contractors Found</h4>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'No contractors available'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {topRatedContractors.map((contractor) => (
              <motion.div
                key={contractor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ContractorCard
                  contractor={{
                    id: contractor.id,
                    name: contractor.name,
                    avatar: contractor.avatar,
                    rating: contractor.contractorProfile?.rating || 0,
                    completedJobs: contractor.contractorProfile?.completedJobs || 0,
                    hourlyRate: contractor.contractorProfile?.hourlyRate,
                    specialties: contractor.contractorProfile?.specialties,
                    location: contractor.contractorProfile?.location.address,
                    verified: contractor.contractorProfile?.verified,
                  }}
                  onSelect={() => setSelectedContractor(contractor)}
                  showActions
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedContractor && (
        <ContractorProfileModal
          contractor={selectedContractor}
          open={!!selectedContractor}
          onClose={() => setSelectedContractor(null)}
          onContact={() => {
            console.log('Contact contractor:', selectedContractor.name);
          }}
        />
      )}
    </div>
  );
}
