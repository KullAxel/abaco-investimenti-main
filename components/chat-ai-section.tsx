import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function ChatAISection() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-2xl font-semibold text-red-500">Chat AI Avanzata</h2>
            <p className="text-gray-600">
              La nostra chat AI ti consente di ottenere risposte immediate alle tue domande sugli investimenti e la gestione finanziaria.
            </p>
            <Button asChild className="rounded-md bg-red-500 hover:bg-red-600 mt-2">
              <Link href="/ai-chat-demo">Prova ora</Link>
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative h-[400px] w-[220px]">
              <Image
                src="/chat-ai-mockup.jpg"
                alt="Chat AI Avanzata"
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
