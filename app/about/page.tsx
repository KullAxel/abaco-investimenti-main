import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Chi Siamo</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Abaco Investimenti è un'azienda di educazione finanziaria con sede a Torino, Italia, dedicata a
                  rendere l'investimento accessibile a tutti.
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">La Nostra Missione</h2>
                <p className="text-muted-foreground">
                  Educare e supportare gli individui nel navigare il mondo degli investimenti, con un focus su risorse
                  adatte ai principianti.
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">I Nostri Valori</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Educazione accessibile e comprensibile</li>
                  <li>Trasparenza nelle informazioni finanziarie</li>
                  <li>Supporto continuo agli investitori</li>
                  <li>Innovazione negli strumenti di investimento</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center">
                  <div className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg max-w-[80%]">
                    <h3 className="text-xl font-bold mb-2">Abaco Investimenti</h3>
                    <p className="mb-4 text-muted-foreground">Fondata nel 2015 a Torino</p>
                    <p className="text-muted-foreground">
                      Con un TrustScore di 4 stelle, siamo orgogliosi di aver aiutato migliaia di investitori a
                      raggiungere i loro obiettivi finanziari.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Il Nostro Team</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Professionisti appassionati di finanza ed educazione
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 mt-8">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 text-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full">
                <Image src="/placeholder.svg?height=128&width=128" alt="CEO" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Marco Rossi</h3>
              <p className="text-sm text-primary">CEO & Fondatore</p>
              <p className="text-muted-foreground">
                Esperto di finanza con oltre 15 anni di esperienza nel settore degli investimenti.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 text-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full">
                <Image src="/placeholder.svg?height=128&width=128" alt="CFO" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Laura Bianchi</h3>
              <p className="text-sm text-primary">Direttrice Corsi</p>
              <p className="text-muted-foreground">
                Specialista in educazione finanziaria con un background in economia e pedagogia.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 text-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full">
                <Image src="/placeholder.svg?height=128&width=128" alt="CTO" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Alessandro Verdi</h3>
              <p className="text-sm text-primary">CTO</p>
              <p className="text-muted-foreground">
                Ingegnere informatico responsabile dello sviluppo della Portfolio Web App e dell'AI Investor Chat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">La Nostra Storia</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Dal 2015 aiutiamo gli investitori a prendere decisioni finanziarie consapevoli
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl space-y-6 mt-8">
            <div className="flex flex-col gap-2 rounded-lg border p-4 md:p-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <h3 className="text-xl font-bold">2015</h3>
              </div>
              <p className="text-muted-foreground">
                Fondazione di Abaco Investimenti a Torino con l'obiettivo di rendere l'educazione finanziaria
                accessibile a tutti.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border p-4 md:p-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <h3 className="text-xl font-bold">2018</h3>
              </div>
              <p className="text-muted-foreground">
                Lancio della prima piattaforma online di corsi di investimento, raggiungendo oltre 5.000 studenti nel
                primo anno.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border p-4 md:p-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <h3 className="text-xl font-bold">2021</h3>
              </div>
              <p className="text-muted-foreground">
                Sviluppo della Portfolio Web App, uno strumento innovativo per aiutare gli investitori a monitorare e
                ottimizzare i loro portafogli.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border p-4 md:p-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <h3 className="text-xl font-bold">2023</h3>
              </div>
              <p className="text-muted-foreground">
                Introduzione dell'AI Investor Chat, un assistente virtuale alimentato da intelligenza artificiale per
                rispondere alle domande degli investitori.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border p-4 md:p-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <h3 className="text-xl font-bold">Oggi</h3>
              </div>
              <p className="text-muted-foreground">
                Continuiamo a innovare e migliorare i nostri servizi per offrire la migliore esperienza possibile ai
                nostri clienti.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Contattaci</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hai domande o vuoi saperne di più sui nostri servizi? Siamo qui per aiutarti.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Button asChild className="w-full" size="lg">
                <Link href="/contact">Contattaci</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

