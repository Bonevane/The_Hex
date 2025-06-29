
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function MembershipForm() {
  const { profile, joinClub } = useAuth();
  const { toast } = useToast();
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinClub = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await joinClub(passcode);
    
    if (success) {
      toast({
        title: "Welcome to The Club!",
        description: "You are now a verified member of The Hex."
      });
      setPasscode('');
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid passcode. Try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  if (!profile || profile.is_member) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {profile?.is_member 
            ? "You are already a verified member of The Hex." 
            : "Please log in to access membership options."
          }
        </p>
      </div>
    );
  }

  return (
    <Card className="terminal-border bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="hex-title">
          &gt; JOIN_THE_CLUB
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter the secret passcode to become a verified member
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleJoinClub} className="space-y-4">
          <div>
            <Label htmlFor="passcode" className="text-primary">Member Passcode</Label>
            <Input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              className="terminal-border bg-input/50"
              placeholder="Enter secret passcode..."
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || !passcode.trim()}
            className="w-full terminal-border bg-primary/20 hover:bg-primary/30 text-primary"
          >
            {isLoading ? 'Verifying...' : 'Join Club'}
          </Button>
        </form>
        
        <div className="mt-4 p-3 bg-muted/20 rounded border border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Hint:</strong> The passcode is "ENTER_THE_HEX"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
