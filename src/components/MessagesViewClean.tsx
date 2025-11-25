import { useState } from 'react';
import { 
  MagnifyingGlass, 
  PaperPlaneRight
} from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface MessagesViewProps {
  userId: string;
}

export function MessagesViewClean({ userId }: MessagesViewProps) {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(0);
  const [messageInput, setMessageInput] = useState('');

  const conversations = [
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
      online: false,
    },
  ];

  const messages = selectedConversation !== null ? [
    { id: 1, text: 'Hi! I saw your project posting', sender: 'them', time: '10:30 AM' },
    { id: 2, text: 'Hello! Yes, I need help with kitchen remodeling', sender: 'me', time: '10:32 AM' },
    { id: 3, text: 'We can start the project next Monday', sender: 'them', time: '10:35 AM' },
    { id: 4, text: 'That works perfectly! What time?', sender: 'me', time: '10:36 AM' },
  ] : [];

  const handleSend = () => {
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      <div className="md:col-span-1">
        <Card className="border-2 border-border h-full flex flex-col">
          <div className="p-6 border-b-2 border-border">
            <h2 className="text-2xl font-bold mb-4 uppercase">Messages</h2>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="bold" />
              <Input
                placeholder="Search..."
                className="pl-10 border-2 border-border font-semibold"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 rounded-md text-left transition-all duration-200 border-2 ${
                    selectedConversation === conv.id
                      ? 'bg-primary/10 border-primary'
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12 border-2 border-border">
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                          {conv.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold truncate">{conv.name}</p>
                        <p className="text-xs text-muted-foreground font-semibold">{conv.timestamp}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <Badge className="ml-2 bg-primary text-primary-foreground font-bold">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="border-2 border-border h-full flex flex-col">
          {selectedConversation !== null ? (
            <>
              <div className="p-6 border-b-2 border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-border">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                      {conversations[selectedConversation].avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg">{conversations[selectedConversation].name}</p>
                    <p className="text-sm text-muted-foreground font-semibold">
                      {conversations[selectedConversation].online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-4 border-2 ${
                          message.sender === 'me'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card border-border'
                        }`}
                      >
                        <p className="font-semibold">{message.text}</p>
                        <p className={`text-xs mt-1 font-semibold ${
                          message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-6 border-t-2 border-border">
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border-2 border-border font-semibold"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider active:scale-95 transition-all duration-200"
                  >
                    <PaperPlaneRight className="w-5 h-5" weight="bold" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p className="font-semibold">Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
