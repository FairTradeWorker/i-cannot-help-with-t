import { useState } from 'react';
import { VideoCamera, CurrencyDollar, TrendUp } from '@phosphor-icons/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoUploader } from '@/components/VideoUploader';
import { LearningDashboard } from '@/components/LearningDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('analyzer');

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Home Services Platform</h1>
              <p className="text-muted-foreground mt-1">AI-powered video analysis, job scoping, and pricing optimization</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-2 mb-8">
            <TabsTrigger value="analyzer" className="flex items-center gap-2">
              <VideoCamera className="w-4 h-4" weight="fill" />
              Video Analyzer
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <TrendUp className="w-4 h-4" weight="fill" />
              Learning Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer">
            <VideoUploader />
          </TabsContent>

          <TabsContent value="learning">
            <LearningDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;