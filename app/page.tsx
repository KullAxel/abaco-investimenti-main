import Image from "next/image"
import FeatureStrip from "@/components/feature-strip"

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center bg-[#FCFCF7]">
      {/* HERO */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 pb-10 px-6 md:px-0">
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-2xl md:text-2xl font-bold mb-2">Gestisci e investi<br/>con trasparenza</h1>
          <p className="text-base text-[#222] mb-2">Abaco ti aiuta a gestire e monitorare i tuoi investimenti in modo semplice e chiaro.</p>
          <div className="flex gap-2 mt-2">
            <a href="/registrati" className="rounded-full bg-[#F44C3B] text-white text-sm font-medium px-5 py-2 transition hover:bg-[#d43d2f]">Inizia ora</a>
            <a href="/pricing" className="rounded-full border border-[#F44C3B] text-[#F44C3B] text-sm font-medium px-5 py-2 transition hover:bg-[#fbe6e3]">Scopri di più</a>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Image src="/dashboard-hero.jpg" alt="Dashboard" width={260} height={180} className="rounded-lg w-[260px] h-[180px] object-cover" />
        </div>
      </section>

      {/* FEATURE STRIP */}
      <FeatureStrip />

      {/* SERVICES */}
      <section className="w-full max-w-3xl mx-auto mt-8 px-4">
        <h2 className="text-lg font-semibold mb-4">I nostri servizi</h2>
        <div className="flex flex-col gap-4">
          {/* Chat AI Avanzata Card */}
          <div className="flex bg-white rounded-xl shadow-sm p-4 items-center gap-4">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[#F44C3B] mb-1">Chat AI Avanzata</h3>
              <p className="text-sm text-[#444]">Ottieni risposte e consigli personalizzati per i tuoi investimenti, 24/7.</p>
            </div>
            <Image src="/chat-ai-mockup.jpg" alt="Chat AI" width={90} height={180} className="rounded-lg w-[90px] h-[180px] object-contain" />
          </div>
          {/* Portfolio Tracker Card */}
          <div className="flex bg-white rounded-xl shadow-sm p-4 items-center gap-4">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[#F44C3B] mb-1">Portfolio Tracker</h3>
              <p className="text-sm text-[#444]">Monitora i tuoi investimenti e analizza la performance del tuo portafoglio.</p>
            </div>
            <Image src="/portfolio-tracker.jpg" alt="Portfolio Tracker" width={120} height={80} className="rounded-lg w-[120px] h-[80px] object-contain" />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="w-full max-w-3xl mx-auto mt-12 px-4">
        <h2 className="text-lg font-semibold mb-4">Trova il piano migliore</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* Premium Card */}
          <div className="bg-[#F44C3B] rounded-2xl p-6 w-full md:w-1/2 flex flex-col items-center text-white relative shadow-md">
            <span className="absolute -top-4 left-4 bg-white text-[#F44C3B] text-xs font-bold px-3 py-1 rounded-full shadow">Consigliato</span>
            <div className="text-3xl font-bold mb-2">10,50€</div>
            <div className="mb-2 text-sm">al mese</div>
            <ul className="mb-6 text-sm space-y-1">
              <li>✓ Chat AI Avanzata</li>
              <li>✓ Portfolio Tracker</li>
              <li>✓ Supporto prioritario</li>
            </ul>
            <a href="/registrati" className="w-full rounded-full bg-white text-[#F44C3B] text-sm font-semibold px-5 py-2 text-center transition hover:bg-[#fbe6e3]">Inizia ora</a>
          </div>
          {/* Free Card */}
          <div className="bg-[#F3F3F3] rounded-2xl p-6 w-full md:w-1/2 flex flex-col items-center text-[#222] shadow-md">
            <div className="text-2xl font-bold mb-2">Gratis</div>
            <div className="mb-2 text-sm">Per sempre</div>
            <ul className="mb-6 text-sm space-y-1">
              <li>✓ Chat AI base</li>
              <li>✓ Portfolio Tracker base</li>
              <li>✓ Supporto via email</li>
            </ul>
            <a href="/registrati" className="w-full rounded-full bg-white border border-[#F44C3B] text-[#F44C3B] text-sm font-semibold px-5 py-2 text-center transition hover:bg-[#fbe6e3]">Crea account</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-3xl mx-auto mt-12 mb-16 px-4">
        <h2 className="text-lg font-semibold mb-4">Domande frequenti</h2>
        <div className="divide-y divide-[#E2E2E2]">
          <div className="py-4">
            <div className="font-bold mb-1">Come funziona il piano mese gratis?</div>
            <div className="text-sm text-[#444]">Il piano gratuito ti permette di provare tutte le funzionalità base senza costi. Puoi passare al piano premium in qualsiasi momento.</div>
          </div>
          <div className="py-4">
            <div className="font-bold mb-1">Posso cancellare l’abbonamento in qualsiasi momento?</div>
            <div className="text-sm text-[#444]">Sì, puoi annullare quando vuoi dalla tua area personale senza penali o costi aggiuntivi.</div>
          </div>
          <div className="py-4">
            <div className="font-bold mb-1">La Chat AI fornisce consigli personalizzati?</div>
            <div className="text-sm text-[#444]">Sì, la chat AI analizza il tuo profilo e ti offre risposte su misura per te.</div>
          </div>
          <div className="py-4">
            <div className="font-bold mb-1">Quanto è sicuro salvare i dati per il mio portafoglio?</div>
            <div className="text-sm text-[#444]">I tuoi dati sono protetti con crittografia avanzata e non vengono mai condivisi con terze parti.</div>
          </div>
          <div className="py-4">
            <div className="font-bold mb-1">Serve un supporto umano alla disiscrizione?</div>
            <div className="text-sm text-[#444]">No, puoi gestire tutto in autonomia dalla piattaforma.</div>
          </div>
        </div>
      </section>
    </main>
  )
}

