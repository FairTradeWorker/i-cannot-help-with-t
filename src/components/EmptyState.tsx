// Empty State - Consistent empty/no-data states across the app
import { motion } from 'framer-motion';
import {
  MagnifyingGlass,
  FolderOpen,
  ClipboardText,
  UserCircle,
  ChatCircle,
  Bell,
  MapPin,
  Briefcase,
  Image,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

type EmptyStateType = 
  | 'search' 
  | 'folder' 
  | 'tasks' 
  | 'users' 
  | 'messages' 
  | 'notifications' 
  | 'locations' 
  | 'jobs'
  | 'images'
  | 'custom';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const typeConfig: Record<EmptyStateType, { icon: React.ReactNode; title: string; description: string }> = {
  search: {
    icon: <MagnifyingGlass size={48} weight="light" />,
    title: 'No results found',
    description: 'Try adjusting your search or filter to find what you\'re looking for.',
  },
  folder: {
    icon: <FolderOpen size={48} weight="light" />,
    title: 'No files yet',
    description: 'Upload files to get started.',
  },
  tasks: {
    icon: <ClipboardText size={48} weight="light" />,
    title: 'No tasks',
    description: 'Create your first task to get started.',
  },
  users: {
    icon: <UserCircle size={48} weight="light" />,
    title: 'No users found',
    description: 'Invite team members to collaborate.',
  },
  messages: {
    icon: <ChatCircle size={48} weight="light" />,
    title: 'No messages',
    description: 'Start a conversation to connect with others.',
  },
  notifications: {
    icon: <Bell size={48} weight="light" />,
    title: 'All caught up!',
    description: 'You have no new notifications.',
  },
  locations: {
    icon: <MapPin size={48} weight="light" />,
    title: 'No locations',
    description: 'Add a location to begin.',
  },
  jobs: {
    icon: <Briefcase size={48} weight="light" />,
    title: 'No jobs available',
    description: 'Check back later for new opportunities.',
  },
  images: {
    icon: <Image size={48} weight="light" />,
    title: 'No images',
    description: 'Upload images to your gallery.',
  },
  custom: {
    icon: <FolderOpen size={48} weight="light" />,
    title: 'Nothing here',
    description: 'This section is empty.',
  },
};

const sizeClasses = {
  sm: { wrapper: 'py-6', icon: 32, title: 'text-sm', desc: 'text-xs' },
  md: { wrapper: 'py-10', icon: 48, title: 'text-base', desc: 'text-sm' },
  lg: { wrapper: 'py-16', icon: 64, title: 'text-lg', desc: 'text-base' },
};

export function EmptyState({
  type = 'custom',
  title,
  description,
  actionLabel,
  onAction,
  icon,
  size = 'md',
}: EmptyStateProps) {
  const config = typeConfig[type];
  const sizes = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center ${sizes.wrapper}`}
    >
      <div className="text-muted-foreground/50 mb-4">
        {icon || config.icon}
      </div>
      <h3 className={`font-semibold text-foreground ${sizes.title}`}>
        {title || config.title}
      </h3>
      <p className={`text-muted-foreground mt-1 max-w-sm ${sizes.desc}`}>
        {description || config.description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size={size === 'sm' ? 'sm' : 'default'}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
