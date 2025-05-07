"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleRegister = () => {
    setIsLoading(true);
    // Direct approach: redirect to Google's OAuth page
    window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent('/')}`;
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la registrazione');
      }

      // Registration successful, redirect to login
      router.push("/accedi?registered=true");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Si è verificato un errore durante la registrazione. Riprova più tardi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 bg-[#FAF6F0]">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <CardHeader className="text-center pt-8 pb-4">
          <CardTitle className="text-3xl font-bold text-gray-800">Registrati</CardTitle>
          <CardDescription className="text-gray-600 pt-1">
            Crea un account per accedere a tutti i nostri servizi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 py-6">
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Nome</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Il tuo nome" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-md border-gray-300 focus:border-[#EE6352] focus:ring-[#EE6352]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@esempio.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-md border-gray-300 focus:border-[#EE6352] focus:ring-[#EE6352]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-md border-gray-300 focus:border-[#EE6352] focus:ring-[#EE6352]"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button 
              type="submit" 
              className="w-full rounded-full bg-[#EE6352] hover:bg-[#d95341] text-white py-3 text-base font-semibold" 
              disabled={isLoading}
            >
              {isLoading ? "Caricamento..." : "Registrati"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Oppure continua con</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 rounded-full border-gray-300 hover:border-gray-400 text-gray-700 py-3"
            onClick={handleGoogleRegister}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            <span className="text-sm font-medium">{isLoading ? "Caricamento..." : "Registrati con Google"}</span>
          </Button>
        </CardContent>
        <Separator className="my-0 bg-gray-200" />
        <CardFooter className="flex justify-center py-6">
          <p className="text-sm text-gray-600">
            Hai già un account?{" "}
            <Link href="/accedi" className="text-[#EE6352] hover:text-[#d95341] font-medium">
              Accedi
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 