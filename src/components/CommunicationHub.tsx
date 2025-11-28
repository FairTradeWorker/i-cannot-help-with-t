// Customer Communication Hub - In-app messaging with history
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatCircle,
  MagnifyingGlass,
  PaperPlaneRight,
  Paperclip,
  Phone,
  VideoCamera,
  DotsThree,
  CheckCircle,
  Check,
  Checks,
  Image as ImageIcon,
  File,
  Clock,
  Star,
  ArrowLeft,
  Info,
  X,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file' | 'system';
  attachments?: {
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    role: 'homeowner' | 'contractor';
    rating?: number;
  };
  jobTitle?: string;
  jobId?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

// Sample conversations
const generateConversations = (): Conversation[] => [
  {
    id: 'conv1',
    participant: {
      id: 'p1',
      name: 'Sarah Johnson',
      role: 'homeowner',
    },
    jobTitle: 'Kitchen Remodel',
    jobId: 'job1',
    lastMessage: 'That sounds great! When can you start?',
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        senderId: 'p1',
        content: 'Hi, I saw your profile and would like to get a quote for my kitchen remodel.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm2',
        senderId: 'me',
        content: 'Hello Sarah! Thank you for reaching out. I would be happy to help with your kitchen remodel. Can you tell me more about what you are looking for?',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm3',
        senderId: 'p1',
        content: 'I want to completely renovate the kitchen - new cabinets, countertops, and appliances. The space is about 250 sq ft.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm4',
        senderId: 'me',
        content: 'Great! Based on the scope, I estimate this would take about 3-4 weeks and cost between $25,000-$35,000 depending on materials chosen.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm5',
        senderId: 'p1',
        content: 'That sounds great! When can you start?',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'delivered',
        type: 'text',
      },
    ],
  },
  {
    id: 'conv2',
    participant: {
      id: 'p2',
      name: 'Mike Williams',
      role: 'homeowner',
    },
    jobTitle: 'Roof Repair',
    jobId: 'job2',
    lastMessage: 'I have attached photos of the damage',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: 'm6',
        senderId: 'p2',
        content: 'We had some storm damage to our roof. Need an inspection and repair quote.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm7',
        senderId: 'me',
        content: 'I am sorry to hear about the damage. Can you send me some photos so I can assess the situation?',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm8',
        senderId: 'p2',
        content: 'I have attached photos of the damage',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
        attachments: [
          { name: 'roof-damage-1.jpg', url: '#', type: 'image' },
          { name: 'roof-damage-2.jpg', url: '#', type: 'image' },
        ],
      },
    ],
  },
  {
    id: 'conv3',
    participant: {
      id: 'p3',
      name: 'Premier Renovations',
      role: 'contractor',
      rating: 96,
    },
    jobTitle: 'Bathroom Renovation',
    jobId: 'job3',
    lastMessage: 'The materials have been ordered and will arrive Monday',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: 'm9',
        senderId: 'me',
        content: 'Hi, I accepted your bid for the bathroom renovation. Excited to get started!',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm10',
        senderId: 'p3',
        content: 'Great to hear! I will come by tomorrow to take final measurements.',
        timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 'm11',
        senderId: 'p3',
        content: 'The materials have been ordered and will arrive Monday',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
    ],
  },
];

interface CommunicationHubProps {
  userId?: string;
}

export function CommunicationHub({ userId }: CommunicationHubProps) {
  const [conversations, setConversations] = useState<Conversation[]>(generateConversations());
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const filteredConversations = conversations.filter(c =>
    c.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      content: newMessage,
      timestamp: new Date(),
      status: 'sent',
      type: 'text',
    };

    setConversations(conversations.map(c => {
      if (c.id === selectedConversation.id) {
        return {
          ...c,
          messages: [...c.messages, message],
          lastMessage: newMessage,
          lastMessageTime: new Date(),
        };
      }
      return c;
    }));

    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
      lastMessage: newMessage,
      lastMessageTime: new Date(),
    });

    setNewMessage('');

    // Simulate message delivery
    setTimeout(() => {
      setConversations(prev => prev.map(c => {
        if (c.id === selectedConversation.id) {
          return {
            ...c,
            messages: c.messages.map(m => 
              m.id === message.id ? { ...m, status: 'delivered' as const } : m
            ),
          };
        }
        return c;
      }));
    }, 1000);
  };

  const markAsRead = (conversationId: string) => {
    setConversations(conversations.map(c => {
      if (c.id === conversationId) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    }));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getMessageStatus = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-muted-foreground" />;
      case 'delivered':
        return <Checks className="w-4 h-4 text-muted-foreground" />;
      case 'read':
        return <Checks className="w-4 h-4 text-primary" />;
    }
  };

  const showConversationList = !isMobileView || !selectedConversation;
  const showMessageView = !isMobileView || selectedConversation;

  return (
    <div className="h-[calc(100vh-200px)] min-h-[600px]">
      <Card className="h-full overflow-hidden">
        <div className="flex h-full">
          {/* Conversation List */}
          <AnimatePresence>
            {showConversationList && (
              <motion.div
                initial={isMobileView ? { x: -300 } : false}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className={`${isMobileView ? 'w-full' : 'w-80'} border-r flex flex-col`}
              >
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <ChatCircle className="w-6 h-6" weight="fill" />
                      Messages
                      {totalUnread > 0 && (
                        <Badge variant="destructive">{totalUnread}</Badge>
                      )}
                    </h2>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search conversations..."
                      className="pl-9"
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-2">
                    {filteredConversations.map(conversation => (
                      <div
                        key={conversation.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id
                            ? 'bg-primary/10'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => {
                          setSelectedConversation(conversation);
                          markAsRead(conversation.id);
                        }}
                      >
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={conversation.participant.avatar} />
                            <AvatarFallback>
                              {conversation.participant.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold truncate ${conversation.unreadCount > 0 ? 'text-foreground' : ''}`}>
                              {conversation.participant.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conversation.lastMessageTime)}
                            </span>
                          </div>
                          {conversation.jobTitle && (
                            <p className="text-xs text-primary truncate">{conversation.jobTitle}</p>
                          )}
                          <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium' : 'text-muted-foreground'}`}>
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    ))}

                    {filteredConversations.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <ChatCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No conversations found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message View */}
          <AnimatePresence>
            {showMessageView && (
              <motion.div
                initial={isMobileView ? { x: 300 } : false}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                className="flex-1 flex flex-col"
              >
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isMobileView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedConversation(null)}
                          >
                            <ArrowLeft className="w-5 h-5" />
                          </Button>
                        )}
                        <Avatar>
                          <AvatarImage src={selectedConversation.participant.avatar} />
                          <AvatarFallback>
                            {selectedConversation.participant.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {selectedConversation.participant.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {selectedConversation.participant.rating && (
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500" weight="fill" />
                                {selectedConversation.participant.rating}
                              </span>
                            )}
                            {selectedConversation.jobTitle && (
                              <Badge variant="secondary" className="text-xs">
                                {selectedConversation.jobTitle}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <VideoCamera className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Info className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {selectedConversation.messages.map((message, index) => {
                          const isMe = message.senderId === 'me';
                          const showTimestamp = index === 0 || 
                            new Date(selectedConversation.messages[index - 1].timestamp).getTime() < 
                            message.timestamp.getTime() - 30 * 60 * 1000;

                          return (
                            <div key={message.id}>
                              {showTimestamp && (
                                <div className="text-center text-xs text-muted-foreground my-4">
                                  {message.timestamp.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                              )}
                              <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div
                                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                    isMe
                                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                                      : 'bg-muted rounded-bl-sm'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  
                                  {/* Attachments */}
                                  {message.attachments && message.attachments.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      {message.attachments.map((att, i) => (
                                        <div 
                                          key={i}
                                          className="flex items-center gap-2 p-2 bg-black/10 rounded"
                                        >
                                          {att.type === 'image' ? (
                                            <ImageIcon className="w-4 h-4" />
                                          ) : (
                                            <File className="w-4 h-4" />
                                          )}
                                          <span className="text-xs truncate">{att.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div className={`flex items-center gap-1 mt-1 ${
                                    isMe ? 'justify-end' : 'justify-start'
                                  }`}>
                                    <span className={`text-[10px] ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                      {message.timestamp.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                    {isMe && getMessageStatus(message.status)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 border-t">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Paperclip className="w-5 h-5" />
                        </Button>
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                        />
                        <Button
                          size="icon"
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <PaperPlaneRight className="w-5 h-5" weight="fill" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <ChatCircle className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Select a Conversation</h3>
                      <p className="text-muted-foreground">
                        Choose a conversation from the list to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
