"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { useMobile } from "@/hooks/use-mobile";

export function AuthStatus() {
  const { data: session, status } = useSession();
  const isMobile = useMobile();

  if (status === "loading") {
    return <div className="animate-pulse h-10 w-10 rounded-full bg-muted"></div>;
  }

  if (status === "unauthenticated") {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2">
          <Button
            asChild
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/10"
          >
            <Link href="/accedi">Accedi</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/registrati">Registrati</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="outline"
          className="rounded-full border-primary text-primary hover:bg-primary/10"
        >
          <Link href="/accedi">Accedi</Link>
        </Button>
        <Button asChild className="rounded-full">
          <Link href="/registrati">Registrati</Link>
        </Button>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name ?? "User avatar"} />
            <AvatarFallback>
              <UserIcon className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{session?.user?.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="border-destructive text-destructive hover:bg-destructive/10"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Esci
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name ?? "User avatar"} />
            <AvatarFallback>
              <UserIcon className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium">{session?.user?.name}</p>
          <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 