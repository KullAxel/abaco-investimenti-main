"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestPage() {
  return (
    <div className="container py-16 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">Test Page for Dark Mode</h1>
      <p className="text-card-foreground mb-6">This is a test page to check dark mode styling.</p>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Standard Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card uses bg-card and text-card-foreground.</p>
            <Button className="mt-4 rounded-full">Standard Button</Button>
          </CardContent>
        </Card>
        
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>Primary Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card uses bg-primary and text-primary-foreground.</p>
            <Button variant="secondary" className="mt-4 rounded-full">Secondary Button</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mt-4">
        <Card className="bg-secondary text-secondary-foreground">
          <CardHeader>
            <CardTitle>Secondary Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card uses bg-secondary and text-secondary-foreground.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-muted text-muted-foreground">
          <CardHeader>
            <CardTitle>Muted Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card uses bg-muted and text-muted-foreground.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-accent text-accent-foreground">
          <CardHeader>
            <CardTitle>Accent Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card uses bg-accent and text-accent-foreground.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 p-6 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Text Color Tests</h2>
        <p className="mb-2">Default text color (text-foreground)</p>
        <p className="text-primary mb-2">Primary text color (text-primary)</p>
        <p className="text-secondary mb-2">Secondary text color (text-secondary)</p>
        <p className="text-muted-foreground mb-2">Muted text color (text-muted-foreground)</p>
        <p className="text-accent mb-2">Accent text color (text-accent)</p>
        <p className="text-destructive mb-2">Destructive text color (text-destructive)</p>
      </div>
    </div>
  );
} 