"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"
import { AuthStatus } from "@/components/auth-status"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSession } from "next-auth/react"

export default function Header() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="w-full bg-transparent">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <span className="font-bold text-xl">Abaco Investimenti</span>
          </Link>
        </div>

        {isMobile ? (
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-l border-border/40 bg-background">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/"
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === "/" && "text-primary",
                    )}
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === "/about" && "text-primary",
                    )}
                  >
                    Chi Siamo
                  </Link>
                  <div className="flex flex-col gap-2">
                    <span className="text-lg font-medium">Prodotti</span>
                    <div className="flex flex-col gap-2 pl-4">
                      <Link
                        href="/portfolio-demo"
                        className={cn(
                          "text-md font-medium transition-colors hover:text-primary",
                          pathname === "/portfolio-demo" && "text-primary",
                        )}
                      >
                        Portfolio Demo
                      </Link>
                      <Link
                        href="/ai-chat-demo"
                        className={cn(
                          "text-md font-medium transition-colors hover:text-primary",
                          pathname === "/ai-chat-demo" && "text-primary",
                        )}
                      >
                        AI Chat Demo
                      </Link>
                      <Link
                        href="/courses"
                        className={cn(
                          "text-md font-medium transition-colors hover:text-primary",
                          pathname === "/courses" && "text-primary",
                        )}
                      >
                        Corsi
                      </Link>
                    </div>
                  </div>
                  <Link
                    href="/pricing"
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === "/pricing" && "text-primary",
                    )}
                  >
                    Abbonamento
                  </Link>
                  <div className="mt-4">
                    <AuthStatus />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/" && "text-primary",
                )}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/about" && "text-primary",
                )}
              >
                Chi Siamo
              </Link>
              <div className="relative">
                <button
                  className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
                  onBlur={(e) => {
                    // Only close if focus doesn't move to an element within the dropdown
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setTimeout(() => setIsProductMenuOpen(false), 100);
                    }
                  }}
                >
                  Prodotti <ChevronDown className="h-4 w-4" />
                </button>
                {isProductMenuOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-md border border-border/40 bg-card p-2 shadow-lg animate-in">
                    <Link
                      href="/portfolio-demo"
                      className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      Portfolio Demo
                    </Link>
                    <Link
                      href="/ai-chat-demo"
                      className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      AI Chat Demo
                    </Link>
                    <Link
                      href="/courses"
                      className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      Corsi
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/pricing"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/pricing" && "text-primary",
                )}
              >
                Abbonamento
              </Link>
            </nav>
            {!session ? (
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
            ) : (
              <AuthStatus />
            )}
          </div>
        )}
      </div>
    </header>
  )
}
