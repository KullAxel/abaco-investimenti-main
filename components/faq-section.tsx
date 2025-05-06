import React from 'react'

const faqItems = [
  {
    question: "Come funziona l'abbonamento gratuito?",
    answer: "L'abbonamento gratuito ti offre accesso alle funzionalità base della piattaforma. Potrai monitorare i tuoi investimenti e utilizzare la chat AI con alcune limitazioni."
  },
  {
    question: "Posso cancellare l'abbonamento in qualsiasi momento?",
    answer: "Sì, puoi cancellare l'abbonamento in qualsiasi momento. Il servizio rimarrà attivo fino alla fine del periodo di fatturazione."
  },
  {
    question: "La Chat AI fornisce consigli personalizzati?",
    answer: "Sì, la nostra Chat AI è progettata per fornire risposte e consigli personalizzati in base alle tue esigenze e al tuo profilo di investimento."
  },
  {
    question: "Quanto è sicuro salvare i dati del mio portafoglio?",
    answer: "La sicurezza dei tuoi dati è la nostra priorità. Utilizziamo avanzati sistemi di crittografia e seguiamo le migliori pratiche di sicurezza per proteggere tutte le tue informazioni."
  }
]

export default function FAQSection() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-semibold text-black mb-4">Domande frequenti</h2>
        </div>
        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-gray-200 py-4 last:border-0">
              <h3 className="text-lg font-medium text-black mb-2">{item.question}</h3>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
