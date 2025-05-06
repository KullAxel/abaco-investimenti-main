import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-16 bg-white overflow-hidden relative">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">
              Gestisci e investi con trasparenza
            </h1>
            <p className="max-w-[600px] text-gray-600 md:text-lg">
              La piattaforma che ti permette di gestire e monitorare i tuoi investimenti in modo semplice e trasparente.
            </p>
            <div className="flex flex-row gap-3 pt-2">
              <Button asChild size="lg" className="rounded-md bg-red-500 hover:bg-red-600">
                <Link href="/registrati">Inizia ora</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-md border-black text-black hover:bg-gray-100"
              >
                <Link href="/pricing">Scopri di più</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full md:h-[350px]">
              <Image
                src="/investment-dashboard.jpg"
                alt="Investment Dashboard"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

