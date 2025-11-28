// Contractor Mini Card - Compact contractor display for lists
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle, Clock } from '@phosphor-icons/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ContractorMiniCardProps {
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  specialty: string;
  location: string;
  verified?: boolean;
  available?: boolean;
  onClick?: () => void;
}

export function ContractorMiniCard({
  name,
  avatar,
  rating,
  reviewCount,
  specialty,
  location,
  verified = false,
  available = true,
  onClick,
}: ContractorMiniCardProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center gap-3 p-3 rounded-lg border bg-card cursor-pointer
        hover:shadow-md hover:border-primary/20 transition-all
      `}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        {verified && (
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-0.5">
            <CheckCircle size={14} weight="fill" className="text-blue-500" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm truncate">{name}</h4>
          {available && (
            <Badge variant="secondary" className="h-5 text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Available
            </Badge>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground truncate">{specialty}</p>
        
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-0.5">
            <Star size={12} weight="fill" className="text-amber-400" />
            <span className="text-xs font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
          <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <MapPin size={12} />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
