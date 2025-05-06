"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    // Log the error details for debugging (server-side only)
    console.error("Auth error:", {
      error,
      searchParams: Object.fromEntries(searchParams.entries()),
    });
  }, [error, searchParams]);

  // Map error codes to user-friendly messages
  let errorMessage = "Si è verificato un errore durante l'autenticazione.";
  let errorDetails = "Per favore riprova più tardi o contatta il supporto.";
  
  // Show user-friendly error messages based on error code
  if (error === "OAuthSignin") {
    errorMessage = "Errore nell'avvio del processo di accesso.";
  } else if (error === "OAuthCallback") {
    errorMessage = "Errore durante il processo di accesso.";
  } else if (error === "OAuthCreateAccount") {
    errorMessage = "Impossibile creare un account.";
  } else if (error === "EmailCreateAccount") {
    errorMessage = "Impossibile creare un account con email.";
  } else if (error === "Callback") {
    errorMessage = "Errore durante il processo di accesso.";
  } else if (error === "AccessDenied") {
    errorMessage = "Accesso negato.";
    errorDetails = "Non hai i permessi per accedere a questa risorsa.";
  } else if (error === "Configuration") {
    errorMessage = "Errore di configurazione.";
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-destructive">Errore di Autenticazione</CardTitle>
          <CardDescription className="text-base mt-2">{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{errorDetails}</p>
          
          <div className="mt-6 text-sm">
            <p>Puoi provare a:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Effettuare nuovamente l'accesso</li>
              <li>Utilizzare un altro metodo di accesso</li>
              <li>Cancellare i cookie e riprovare</li>
              <li>Contattare il supporto se il problema persiste</li>
            </ul>
          </div>

          {/* Generate a random error ID to help with support without revealing details */}
          <div className="mt-4 p-3 bg-muted rounded text-xs">
            <p className="font-medium">ID Errore:</p>
            <p className="mt-1">{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Torna alla Home</Link>
          </Button>
          <Button asChild>
            <Link href="/accedi">Riprova</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 