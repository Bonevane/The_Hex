
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const { login, signup, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validation for signup
      if (mode === 'signup') {
        if (formData.password.length < 6) {
          toast({
            title: "Password too short",
            description: "Password must be at least 6 characters long",
            variant: "destructive"
          });
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: "Please make sure both passwords are the same",
            variant: "destructive"
          });
          return;
        }
      }
      
      let success = false;
      
      if (mode === 'login') {
        success = await login(formData.email, formData.password);
        if (!success) {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive"
          });
        }
      } else {
        success = await signup(formData);
        if (success) {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account before logging in."
          });
        } else {
          toast({
            title: "Signup failed",
            description: "Unable to create account. Please try again or contact support.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto terminal-border bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="hex-title text-primary neon-text">
          {mode === 'login' ? '&gt; ACCESS_TERMINAL' : '&gt; NEW_USER_REGISTRATION'}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {mode === 'login' 
            ? 'Enter your credentials to access The Hex' 
            : 'Create an account to join The Hex network'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-primary">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="terminal-border bg-input/50"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-primary">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="terminal-border bg-input/50"
                  />
                </div>
              </div>
            </>
          )}
          
          <div>
            <Label htmlFor="email" className="text-primary">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="terminal-border bg-input/50"
              placeholder="user@thehex.com"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-primary">
              Password {mode === 'signup' && <span className="text-xs text-muted-foreground">(min. 6 characters)</span>}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={mode === 'signup' ? 6 : undefined}
              className="terminal-border bg-input/50"
            />
          </div>
          
          {mode === 'signup' && (
            <div>
              <Label htmlFor="confirmPassword" className="text-primary">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="terminal-border bg-input/50"
              />
            </div>
          )}
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full terminal-border bg-primary/20 hover:bg-primary/30 text-primary"
          >
            {isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={onToggleMode}
            className="text-accent hover:text-primary"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Login"
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
