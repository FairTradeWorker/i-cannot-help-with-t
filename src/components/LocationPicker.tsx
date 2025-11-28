// Location Picker - Quick location selection with autocomplete
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, MagnifyingGlass, X, Crosshair, House } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Location {
  zipCode: string;
  city: string;
  state: string;
  stateCode: string;
}

interface LocationPickerProps {
  value?: string;
  onChange?: (location: Location | null) => void;
  placeholder?: string;
  showCurrentLocation?: boolean;
  recentLocations?: Location[];
}

// Sample US locations for autocomplete
const sampleLocations: Location[] = [
  { zipCode: '78701', city: 'Austin', state: 'Texas', stateCode: 'TX' },
  { zipCode: '85001', city: 'Phoenix', state: 'Arizona', stateCode: 'AZ' },
  { zipCode: '80202', city: 'Denver', state: 'Colorado', stateCode: 'CO' },
  { zipCode: '98101', city: 'Seattle', state: 'Washington', stateCode: 'WA' },
  { zipCode: '97201', city: 'Portland', state: 'Oregon', stateCode: 'OR' },
  { zipCode: '60601', city: 'Chicago', state: 'Illinois', stateCode: 'IL' },
  { zipCode: '30301', city: 'Atlanta', state: 'Georgia', stateCode: 'GA' },
  { zipCode: '75201', city: 'Dallas', state: 'Texas', stateCode: 'TX' },
  { zipCode: '77001', city: 'Houston', state: 'Texas', stateCode: 'TX' },
  { zipCode: '89101', city: 'Las Vegas', state: 'Nevada', stateCode: 'NV' },
  { zipCode: '84101', city: 'Salt Lake City', state: 'Utah', stateCode: 'UT' },
  { zipCode: '55401', city: 'Minneapolis', state: 'Minnesota', stateCode: 'MN' },
];

export function LocationPicker({
  value,
  onChange,
  placeholder = 'Enter city, state, or zip code',
  showCurrentLocation = true,
  recentLocations = [],
}: LocationPickerProps) {
  const [search, setSearch] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (search.length >= 2) {
      const filtered = sampleLocations.filter(
        (loc) =>
          loc.city.toLowerCase().includes(search.toLowerCase()) ||
          loc.zipCode.startsWith(search) ||
          loc.state.toLowerCase().includes(search.toLowerCase()) ||
          loc.stateCode.toLowerCase() === search.toLowerCase()
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(recentLocations.length > 0 ? recentLocations : []);
    }
  }, [search, recentLocations]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location: Location) => {
    setSearch(`${location.city}, ${location.stateCode} ${location.zipCode}`);
    onChange?.(location);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearch('');
    onChange?.(null);
    inputRef.current?.focus();
  };

  const handleCurrentLocation = () => {
    // Simulated current location
    const current = sampleLocations[0];
    handleSelect(current);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          ref={inputRef}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {search && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 w-full mt-1"
          >
            <Card className="p-1 max-h-64 overflow-y-auto shadow-lg">
              {showCurrentLocation && (
                <button
                  onClick={handleCurrentLocation}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted rounded-md"
                >
                  <Crosshair size={16} className="text-blue-500" />
                  <span>Use current location</span>
                </button>
              )}

              {suggestions.length > 0 && (
                <div className="py-1">
                  {search.length < 2 && recentLocations.length > 0 && (
                    <p className="px-3 py-1 text-xs text-muted-foreground">Recent</p>
                  )}
                  {suggestions.map((location, index) => (
                    <button
                      key={`${location.zipCode}-${index}`}
                      onClick={() => handleSelect(location)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted rounded-md"
                    >
                      <House size={16} className="text-muted-foreground flex-shrink-0" />
                      <div>
                        <span className="font-medium">{location.city}</span>
                        <span className="text-muted-foreground">
                          , {location.stateCode} {location.zipCode}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {search.length >= 2 && suggestions.length === 0 && (
                <p className="px-3 py-4 text-sm text-center text-muted-foreground">
                  No locations found
                </p>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
