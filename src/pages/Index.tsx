
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { AuthForm } from '../components/AuthForm';
import { MessageBoard } from '../components/MessageBoard';
import { CreateMessage } from '../components/CreateMessage';
import { MembershipForm } from '../components/MembershipForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { isAuthenticated, profile, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [refreshBoard, setRefreshBoard] = useState(0);

  const handleMessageCreated = () => {
    setRefreshBoard(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <AuthForm 
            mode={authMode} 
            onToggleMode={() => setAuthMode(prev => prev === 'login' ? 'signup' : 'login')} 
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="hex-title text-3xl mb-4">
            &gt; WELCOME_TO_THE_HEX
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            An exclusive digital clubhouse where thoughts flow freely in the shadows. 
            {profile?.is_member 
              ? " As a member, you can see behind the digital veil." 
              : " Become a member to unlock the full experience."
            }
          </p>
        </div>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-3 terminal-border bg-card/50">
            <TabsTrigger value="messages" className="data-[state=active]:bg-primary/20">
              Messages
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-primary/20">
              Create
            </TabsTrigger>
            <TabsTrigger value="membership" className="data-[state=active]:bg-primary/20">
              Access
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="mt-6">
            <MessageBoard key={refreshBoard} />
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <CreateMessage onMessageCreated={handleMessageCreated} />
          </TabsContent>

          <TabsContent value="membership" className="mt-6">
            <MembershipForm />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
