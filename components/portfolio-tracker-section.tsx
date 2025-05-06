import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function PortfolioTrackerSection() {
  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-2xl font-semibold text-red-500">Portfolio Tracker</h2>
            <p className="text-gray-600">
              Monitora facilmente i tuoi investimenti e ottieni una visione chiara del tuo portafoglio in tempo reale.
            </p>
            <Button asChild className="rounded-md bg-red-500 hover:bg-red-600 mt-2">
              <Link href="/portfolio-demo">Prova ora</Link>
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative h-[300px] w-[500px]">
              <Image
                src="/portfolio-tracker.jpg"
                alt="Portfolio Tracker"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
