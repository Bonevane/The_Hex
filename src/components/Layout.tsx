
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { profile, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="hex-title text-2xl">
            &gt; THE_HEX
          </h1>
          
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  &gt; welcome, {profile?.first_name}
                  {profile?.is_member && <span className="text-primary ml-2">[MEMBER]</span>}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="terminal-border hover:bg-primary/20"
                >
                  logout
                </Button>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">
                &gt; unauthorized_access
              </span>
            )}
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="border-t border-border bg-card/30 mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          &gt; secure_connection_established | the_hex_network_v1.0
        </div>
      </footer>
    </div>
  );
}
