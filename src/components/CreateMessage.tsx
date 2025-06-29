
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreateMessageProps {
  onMessageCreated: () => void;
}

export function CreateMessage({ onMessageCreated }: CreateMessageProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            title: formData.title,
            content: formData.content,
            author_id: user.id
          }
        ]);

      if (error) throw error;

      setFormData({ title: '', content: '' });
      
      toast({
        title: "Message Posted",
        description: "Your message has been added to The Hex board."
      });
      
      onMessageCreated();
    } catch (error) {
      console.error('Error creating message:', error);
      toast({
        title: "Error",
        description: "Failed to post message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) return null;

  return (
    <Card className="terminal-border bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="hex-title text-primary neon-text">
          &gt; CREATE_MESSAGE
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-primary">Message Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="terminal-border bg-input/50"
              placeholder="Enter your message title..."
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="text-primary">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              className="terminal-border bg-input/50 resize-none"
              placeholder="Share your thoughts with The Hex community..."
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
            className="w-full terminal-border bg-primary/20 hover:bg-primary/30 text-primary"
          >
            {isSubmitting ? 'Posting...' : 'Post Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
