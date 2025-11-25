import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PaperPlaneRight, Image as ImageIcon, File, Check, Checks } from '@phosphor-icons/react';
import type { Message, Job } from '@/lib/types';
import { dataStore } from '@/lib/store';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  job: Job;
  currentUserId: string;
  currentUserRole: 'homeowner' | 'contractor';
}

export function ChatInterface({ job, currentUserId, currentUserRole }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(job.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const message: Message = {
        id: `msg-${Date.now()}`,
        jobId: job.id,
        senderId: currentUserId,
        senderName: currentUserRole === 'homeowner' ? 'You' : 'You',
        senderRole: currentUserRole,
        content: newMessage.trim(),
        timestamp: new Date(),
        read: false,
      };

      await dataStore.addMessageToJob(job.id, message);
      setMessages([...messages, message]);
      setNewMessage('');
      toast.success('Message sent');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getOtherPartyName = () => {
    if (currentUserRole === 'homeowner') {
      return job.contractorId ? 'Contractor' : 'Waiting for contractor...';
    }
    return 'Homeowner';
  };

  return (
    <Card className="glass-card flex flex-col h-[600px]">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{getOtherPartyName()}</h3>
            <p className="text-sm text-muted-foreground">{job.title}</p>
          </div>
          <Badge variant="secondary">{job.status}</Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => {
            const isOwn = message.senderId === currentUserId;
            const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {showAvatar ? (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.senderName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-8" />
                )}

                <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                  {showAvatar && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{message.senderName}</span>
                      <Badge variant="outline" className="text-xs">
                        {message.senderRole}
                      </Badge>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted text-foreground rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isOwn && (
                      <span className="text-xs text-muted-foreground">
                        {message.read ? (
                          <Checks className="w-3 h-3 text-primary" weight="bold" />
                        ) : (
                          <Check className="w-3 h-3" weight="bold" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <Separator />

      <div className="p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            size="icon"
          >
            <PaperPlaneRight className="w-5 h-5" weight="fill" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
