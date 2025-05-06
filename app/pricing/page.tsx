import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Piani di Abbonamento</h1>
              <p className="text-muted-foreground md:text-xl">
                Scegli il piano più adatto alle tue esigenze e inizia a migliorare i tuoi investimenti oggi stesso.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`flex flex-col border border-border/40 transition-all duration-200 hover-scale ${
                  plan.popular ? "border-primary" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    {plan.popular && (
                      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Consigliato
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Gratuito" && <span className="text-muted-foreground">/mese</span>}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className={`w-full rounded-full ${plan.popular ? "" : "bg-secondary hover:bg-secondary/80"}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link href={plan.href}>{plan.buttonText}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Domande Frequenti</h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Risposte alle domande più comuni sui nostri abbonamenti
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl space-y-4 mt-12">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-border/40 p-4 transition-all duration-200 hover:border-primary/40"
              >
                <h3 className="text-lg font-bold">{faq.question}</h3>
                <p className="mt-2 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const pricingPlans = [
  {
    name: "Base",
    description: "Per chi vuole iniziare",
    price: "Gratuito",
    features: ["Accesso a corsi base", "Guide introduttive", "Newsletter mensile"],
    buttonText: "Registrati",
    href: "/register",
    popular: false,
  },
  {
    name: "Premium",
    description: "Il nostro piano più popolare",
    price: "€19.99",
    features: [
      "Tutto del piano Base",
      "Accesso alla Portfolio Web App",
      "AI Investor Chat (50 domande/mese)",
      "Corsi avanzati",
      "Webinar mensili",
    ],
    buttonText: "Inizia Ora",
    href: "/register?plan=premium",
    popular: true,
  },
  {
    name: "Pro",
    description: "Per investitori seri",
    price: "€39.99",
    features: [
      "Tutto del piano Premium",
      "AI Investor Chat (illimitato)",
      "Analisi avanzate del portafoglio",
      "Consulenza personalizzata",
      "Accesso prioritario ai nuovi corsi",
    ],
    buttonText: "Inizia Ora",
    href: "/register?plan=pro",
    popular: false,
  },
]

const faqs = [
  {
    question: "Posso annullare il mio abbonamento in qualsiasi momento?",
    answer:
      "Sì, puoi annullare il tuo abbonamento in qualsiasi momento. L'abbonamento rimarrà attivo fino alla fine del periodo di fatturazione corrente.",
  },
  {
    question: "Come funziona l'AI Investor Chat?",
    answer:
      "L'AI Investor Chat è un assistente virtuale alimentato da intelligenza artificiale che risponde alle tue domande sugli investimenti in tempo reale. È addestrato su dati finanziari e strategie di investimento per fornirti consigli personalizzati.",
  },
  {
    question: "Posso accedere alla Portfolio Web App da dispositivi mobili?",
    answer:
      "Sì, la Portfolio Web App è completamente responsive e può essere utilizzata su desktop, tablet e smartphone.",
  },
  {
    question: "I consigli dell'AI sono personalizzati?",
    answer:
      "Sì, l'AI Investor Chat tiene conto delle informazioni che fornisci e del contesto delle tue domande per darti risposte personalizzate. Tuttavia, ricorda che non sostituisce la consulenza finanziaria professionale.",
  },
  {
    question: "Ci sono sconti per abbonamenti annuali?",
    answer: "Sì, offriamo uno sconto del 20% per gli abbonamenti annuali. Contattaci per maggiori informazioni.",
  },
]

