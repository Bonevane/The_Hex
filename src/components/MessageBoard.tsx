
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

export function MessageBoard() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!messages_author_id_fkey(
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        // Fallback: fetch messages without profiles
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fallbackError) throw fallbackError;
        setMessages(fallbackData || []);
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="hex-title text-xl mb-2">
          &gt; MESSAGE_BOARD
        </h2>
        <p className="text-muted-foreground">
          {profile?.is_member 
            ? "You can see author information as a member"
            : "Anonymous messages from The Hex community"
          }
        </p>
      </div>

      <div className="grid gap-4">
        {messages.map((message) => (
          <Card key={message.id} className="terminal-border bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-primary text-lg">
                {message.title}
              </CardTitle>
              
              <div className="text-sm text-muted-foreground">
                {profile?.is_member && message.profiles ? (
                  <div className="flex justify-between">
                    <span>
                      By: {message.profiles.first_name} {message.profiles.last_name}
                    </span>
                    <span>{formatDate(message.created_at)}</span>
                  </div>
                ) : (
                  <span>Anonymous • {formatDate(message.created_at)}</span>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {message.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No messages found. Be the first to share something!
          </p>
        </div>
      )}
    </div>
  );
}
