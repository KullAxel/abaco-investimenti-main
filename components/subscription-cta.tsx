import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SubscriptionCTA() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 z-0"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Pronto a Migliorare i Tuoi Investimenti?
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Iscriviti oggi al nostro abbonamento premium e accedi a strumenti esclusivi per ottimizzare il tuo
              portafoglio.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
            <Button asChild size="lg" className="rounded-full btn-hover">
              <Link href="/pricing">Scopri i Piani</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-primary text-primary hover:bg-primary/10"
            >
              <Link href="/contact">Contattaci</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

