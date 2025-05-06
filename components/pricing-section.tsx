import React from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PricingSection() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-semibold text-black mb-4">Trova il piano migliore</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="bg-red-500 text-white rounded-2xl p-6 md:w-64 relative">
            <div className="text-center mb-4">
              <p className="text-sm opacity-80">Piano mensile</p>
              <h3 className="text-3xl font-bold mt-2">10,50€</h3>
              <p className="text-sm opacity-80 mt-1">Prezzo per mese</p>
            </div>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Monitoraggio investimenti
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Chat AI avanzata
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Supporto prioritario
              </li>
            </ul>
            <Button asChild className="w-full bg-white text-red-500 hover:bg-gray-100">
              <Link href="/registrati">Inizia ora</Link>
            </Button>
          </div>
          
          <div className="border border-gray-200 rounded-2xl p-6 md:w-64 bg-white">
            <div className="bg-gray-100 rounded-xl p-4 text-center mb-4">
              <p className="font-semibold text-lg">Gratis</p>
              <p className="text-sm text-gray-600">Per sempre</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Monitoraggio base
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Chat AI limitata
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Supporto via email
              </li>
            </ul>
            <Button asChild variant="outline" className="w-full">
              <Link href="/registrati">Crea account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
