import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatCircle, 
  MagnifyingGlass, 
  PaperPlaneRight,
  Smiley,
  Paperclip,
  DotsThree,
  Plus
} from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  online: boolean;
}

interface MessagesViewProps {
  userId: string;
}

export function MessagesView({ userId }: MessagesViewProps) {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(0);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [
    {
      id: 0,
      name: 'Elite Home Services',
      lastMessage: 'We can start the project next Monday',
      timestamp: '2m ago',
      unread: 2,
      avatar: 'E',
      online: true,
    },
    {
      id: 1,
      name: 'Quick Fix Plumbing',
      lastMessage: 'Thanks for choosing us!',
      timestamp: '1h ago',
      unread: 0,
      avatar: 'Q',
      online: false,
    },
    {
      id: 2,
      name: 'ColorCraft Painters',
      lastMessage: 'Color samples are ready',
      timestamp: '3h ago',
      unread: 1,
      avatar: 'C',
      online: true,
    },
  ]);

  const [messages, setMessages] = useKV<Record<number, Message[]>>('messages', {
    0: [
      { id: '1', text: 'Hi! I saw your project posting', sender: 'them', time: '10:30 AM' },
      { id: '2', text: 'Hello! Yes, I need help with kitchen remodeling', sender: 'me', time: '10:32 AM' },
      { id: '3', text: 'We can start the project next Monday', sender: 'them', time: '10:35 AM' },
      { id: '4', text: 'That works perfectly! What time?', sender: 'me', time: '10:36 AM' },
    ],
    1: [
      { id: '1', text: 'Thank you for your quote', sender: 'me', time: '9:15 AM' },
      { id: '2', text: 'Thanks for choosing us!', sender: 'them', time: '9:20 AM' },
    ],
    2: [
      { id: '1', text: 'What colors do you recommend?', sender: 'me', time: '8:00 AM' },
      { id: '2', text: 'Color samples are ready', sender: 'them', time: '8:30 AM' },
    ],
  });

  const currentMessages = selectedConversation !== null ? ((messages || {})[selectedConversation] || []) : [];

  const handleSend = () => {
    if (messageInput.trim() && selectedConversation !== null) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      
      const newMessage: Message = {
        id: `${Date.now()}`,
        text: messageInput.trim(),
        sender: 'me',
        time: timeStr,
      };

      setMessages((currentMessages) => ({
        ...(currentMessages || {}),
        [selectedConversation]: [...((currentMessages || {})[selectedConversation] || []), newMessage],
      }));

      setConversations((currentConvos) => 
        (currentConvos || []).map(conv => 
          conv.id === selectedConversation 
            ? { ...conv, lastMessage: messageInput.trim(), timestamp: 'Just now' }
            : conv
        )
      );

      setMessageInput('');
      toast.success('Message sent');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="md:col-span-1"
      >
        <Card className="glass-card rounded-3xl h-full flex flex-col">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Messages</h2>
              <Button size="sm" onClick={() => toast.info('New message feature coming soon')}>
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 bg-background/50 border-border/50 rounded-2xl"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {(conversations || []).map((conv, index) => (
                <motion.button
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    selectedConversation === conv.id
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-background/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                          {conv.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-background" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold truncate">{conv.name}</p>
                        <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <span className="ml-2 w-5 h-5 bg-accent rounded-full text-xs text-white flex items-center justify-center flex-shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="md:col-span-2"
      >
        <Card className="glass-card rounded-3xl h-full flex flex-col">
          {selectedConversation !== null ? (
            <>
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                      {(conversations || [])[selectedConversation]?.avatar || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{(conversations || [])[selectedConversation]?.name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">
                      {(conversations || [])[selectedConversation]?.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon">
                    <DotsThree className="w-6 h-6" weight="bold" />
                  </Button>
                </motion.div>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  <AnimatePresence>
                    {currentMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            message.sender === 'me'
                              ? 'bg-primary text-primary-foreground'
                              : 'glass'
                          } rounded-2xl px-4 py-3`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'me' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-border/50">
                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                  </motion.div>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-background/50 border-border/50 rounded-2xl"
                  />
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Smiley className="w-5 h-5" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={handleSend} className="rounded-full">
                      <PaperPlaneRight className="w-5 h-5" weight="fill" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-12">
              <div>
                <ChatCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Conversation Selected</h3>
                <p className="text-muted-foreground">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
