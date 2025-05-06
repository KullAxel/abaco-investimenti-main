"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Info, Shield, Clock, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AIChatDemoPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Ciao! Sono l'assistente AI di Abaco Investimenti. Come posso aiutarti con i tuoi investimenti oggi?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false)

  // Sample questions for demo
  const sampleQuestions = [
    "Cosa sono gli ETF?",
    "Come posso diversificare il mio portafoglio?",
    "Qual è la differenza tra azioni e obbligazioni?",
    "Quali azioni dovrei considerare per un portafoglio diversificato?",
  ]

  // Demo responses
  const demoResponses: Record<string, string> = {
    "Cosa sono gli ETF?":
      "Gli ETF (Exchange Traded Funds) sono fondi d'investimento quotati in borsa che replicano l'andamento di un indice, come ad esempio l'S&P 500 o il FTSE MIB. Offrono diversi vantaggi:\n\n1. Diversificazione: con un solo acquisto, investi in numerosi titoli\n2. Costi contenuti: hanno commissioni generalmente più basse rispetto ai fondi comuni\n3. Liquidità: possono essere comprati e venduti durante l'orario di borsa\n4. Trasparenza: la composizione del portafoglio è nota e aggiornata quotidianamente\n\nGli ETF sono particolarmente adatti per investitori che desiderano un'esposizione diversificata a un mercato o settore specifico con costi contenuti.",
    "Come posso diversificare il mio portafoglio?":
      "La diversificazione è fondamentale per ridurre il rischio del tuo portafoglio. Ecco alcune strategie efficaci:\n\n1. Diversificazione per asset class: investi in diverse categorie come azioni, obbligazioni, immobili, materie prime\n2. Diversificazione geografica: distribuisci gli investimenti in diversi paesi e regioni\n3. Diversificazione settoriale: investi in vari settori economici (tecnologia, salute, finanza, ecc.)\n4. Diversificazione temporale: utilizza il PAC (Piano di Accumulo Capitale) per entrare gradualmente nel mercato\n\nUn portafoglio ben diversificato potrebbe includere ETF globali, alcune obbligazioni di qualità, e forse una piccola allocazione in asset alternativi in base al tuo profilo di rischio e orizzonte temporale.",
    "Qual è la differenza tra azioni e obbligazioni?":
      "Azioni e obbligazioni rappresentano due diverse modalità di investimento con caratteristiche distinte:\n\nAzioni:\n- Rappresentano quote di proprietà di una società\n- Offrono potenzialmente rendimenti più elevati\n- Comportano maggiori rischi e volatilità\n- Possono generare guadagni attraverso l'apprezzamento del prezzo e i dividendi\n\nObbligazioni:\n- Sono prestiti che fai a governi o aziende\n- Offrono generalmente rendimenti più stabili ma inferiori\n- Presentano un rischio minore rispetto alle azioni\n- Generano guadagni principalmente attraverso gli interessi (cedole)\n\nUn portafoglio bilanciato contiene solitamente entrambi gli strumenti, con proporzioni che variano in base al tuo profilo di rischio e ai tuoi obiettivi finanziari.",
    "Quali azioni dovrei considerare per un portafoglio diversificato?":
      "Per un portafoglio azionario diversificato, considera questi principi:\n\n1. Diversificazione geografica: include aziende di diverse regioni (USA, Europa, mercati emergenti)\n2. Diversificazione settoriale: seleziona titoli da vari settori (tecnologia, salute, finanza, beni di consumo)\n3. Equilibrio rischio-rendimento: bilancia azioni growth (crescita) con azioni value (valore)\n\nEcco alcuni esempi di settori da considerare:\n• Tecnologia: aziende con solide fondamenta e vantaggi competitivi\n• Salute: settore difensivo con prospettive di crescita a lungo termine\n• Finanza: banche e assicurazioni con bilanci solidi\n• Beni di consumo: aziende con marchi forti e flussi di cassa stabili\n\nVuoi di più? Abbonati per accesso completo e consigli personalizzati.",
  }

  const handleSend = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      let responseContent = "Questa è una demo. Per risposte complete, abbonati al piano Premium."
      let shouldShowPrompt = true

      // Check if the question matches one of our prepared responses
      for (const question of Object.keys(demoResponses)) {
        if (input.toLowerCase().includes(question.toLowerCase())) {
          responseContent = demoResponses[question]
          shouldShowPrompt = question === "Quali azioni dovrei considerare per un portafoglio diversificato?"
          break
        }
      }

      const aiMessage = { role: "assistant", content: responseContent }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
      
      if (shouldShowPrompt) {
        setTimeout(() => {
          setShowSubscriptionPrompt(true)
        }, 1000)
      }
    }, 1500)
  }

  const handleSampleQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <div className="flex flex-col">
      <section className="w-full py-16 md:py-24 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">AI Investor Chat</h1>
              <p className="text-muted-foreground md:text-xl">
                Il tuo consulente finanziario personale, disponibile 24/7 per rispondere alle tue domande.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-4xl mt-12">
            <Card className="border border-primary/40 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Demo dell'AI Investor Chat</CardTitle>
                <CardDescription>
                  Prova una domanda di esempio per vedere l'AI in azione
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <Card className="border border-border/40 bg-secondary/40">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">Prova queste domande</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {sampleQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSampleQuestion(question)}
                            className="rounded-full border-primary/40 hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <ScrollArea className="h-[400px] rounded-md border border-border/40 p-4 bg-card/30">
                    <div className="flex flex-col gap-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                        >
                          <div className="flex gap-3 max-w-[80%] animate-slide-up">
                            {message.role === "assistant" && (
                              <Avatar>
                                <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
                                <AvatarImage>
                                  <Bot className="h-10 w-10 text-primary" />
                                </AvatarImage>
                              </Avatar>
                            )}
                            <div>
                              <div
                                className={`rounded-lg p-4 ${
                                  message.role === "assistant" ? "bg-secondary" : "bg-primary text-primary-foreground"
                                }`}
                              >
                                <p className="whitespace-pre-line">{message.content}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {message.role === "assistant" ? "AI Investor" : "Tu"}
                              </p>
                            </div>
                            {message.role === "user" && (
                              <Avatar>
                                <AvatarFallback className="bg-secondary">TU</AvatarFallback>
                                <AvatarImage>
                                  <User className="h-10 w-10" />
                                </AvatarImage>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex gap-3 max-w-[80%] animate-slide-up">
                            <Avatar>
                              <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
                              <AvatarImage>
                                <Bot className="h-10 w-10 text-primary" />
                              </AvatarImage>
                            </Avatar>
                            <div>
                              <div className="rounded-lg p-4 bg-secondary">
                                <div className="flex space-x-2">
                                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]"></div>
                                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.4s]"></div>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">AI Investor</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {showSubscriptionPrompt && (
                        <div className="flex justify-center">
                          <div className="bg-primary/10 rounded-lg p-4 border border-primary/30 text-center max-w-[90%] animate-fade-in">
                            <p className="font-medium mb-2">Vuoi di più? Abbonati per accesso completo e consigli personalizzati.</p>
                            <Button 
                              asChild 
                              size="lg" 
                              className="mt-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                            >
                              <Link href="/pricing">Inizia Ora</Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Fai una domanda sugli investimenti..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSend()
                        }
                      }}
                      className="rounded-full bg-secondary border-border/40 focus-visible:ring-primary"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={isLoading || input.trim() === ""}
                      className="rounded-full btn-hover"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    I tuoi dati sono protetti con crittografia avanzata
                  </p>
                </div>
                <Button 
                  asChild 
                  size="lg"
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                >
                  <Link href="/pricing">Prova Gratis per 7 Giorni</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Caratteristiche dell'AI Investor
                </h2>
                <p className="text-muted-foreground">
                  Il nostro assistente AI è progettato per aiutarti a prendere decisioni di investimento più informate.
                </p>
              </div>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="font-bold">{feature.title}</p>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Button 
                  asChild 
                  size="lg"
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                >
                  <Link href="/pricing">Inizia Ora</Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="rounded-lg overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm">
                <div className="aspect-video relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Button className="rounded-full h-16 w-16 bg-primary/90 hover:bg-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </Button>
                    <span className="sr-only">Play demo video</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">Guarda l'AI Investor in azione</h3>
                  <p className="text-muted-foreground">Scopri come l'AI può trasformare le tue decisioni d'investimento</p>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                <h3 className="text-lg font-bold mb-4">Cosa dicono i nostri utenti</h3>
                <div className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-background rounded-lg p-4 border border-border/40">
                      <div className="flex items-center gap-1 text-amber-500 mb-2">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                      <p className="italic mb-2">{testimonial.text}</p>
                      <p className="text-sm font-medium">{testimonial.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-16 md:py-24 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-8 sm:text-4xl">
              Domande Frequenti
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="border border-border/40">
                  <CardHeader>
                    <CardTitle className="text-xl">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Pronto a provare l'AI Investor?</p>
              <Button 
                asChild 
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              >
                <Link href="/pricing">Prova Gratis per 7 Giorni</Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-2">Soddisfatti o rimborsati entro 30 giorni</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Ottieni risposte immediate 24/7, ovunque ti trovi",
    description: "Accedi a consigli finanziari in qualsiasi momento, senza attese o appuntamenti.",
  },
  {
    icon: <User className="h-5 w-5" />,
    title: "Ricevi consigli su misura per massimizzare i tuoi guadagni",
    description: "Suggerimenti personalizzati in base al tuo profilo di rischio e obiettivi.",
  },
  {
    icon: <Info className="h-5 w-5" />,
    title: "Capisci tutto facilmente con spiegazioni semplici e chiare",
    description: "Concetti finanziari complessi spiegati in modo comprensibile, senza gergo tecnico.",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    title: "Rimani aggiornato sulle strategie vincenti del momento",
    description: "Informazioni sempre al passo con le ultime tendenze e opportunità di mercato.",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
    title: "Ottimizza il tuo portafoglio con analisi personalizzate",
    description: "Valutazioni e suggerimenti specifici basati sui tuoi investimenti attuali.",
  },
]

const testimonials = [
  {
    text: "Grazie all'AI Investor Chat, ho diversificato il mio portafoglio e aumentato i rendimenti del 15% in tre mesi!",
    author: "Marco R."
  },
  {
    text: "Le risposte immediate mi hanno aiutato a prendere decisioni rapide e informate in momenti critici del mercato.",
    author: "Laura B."
  },
  {
    text: "Finalmente posso capire il mondo degli investimenti senza sentirmi sopraffatto dal gergo tecnico.",
    author: "Paolo M."
  }
]

const faqs = [
  {
    question: "Come funziona l'AI Investor Chat?",
    answer: "Basta fare una domanda, e l'AI ti fornisce risposte rapide e personalizzate basate sui tuoi obiettivi di investimento e sul tuo profilo di rischio."
  },
  {
    question: "Quali tipi di investimenti copre?",
    answer: "L'AI Investor copre un'ampia gamma di strumenti finanziari: azioni, obbligazioni, ETF, fondi comuni, criptovalute e altro ancora."
  },
  {
    question: "I miei dati sono al sicuro?",
    answer: "Sì, utilizziamo crittografia di livello bancario per proteggere le tue informazioni personali e finanziarie. I tuoi dati non vengono mai condivisi con terze parti."
  },
  {
    question: "Posso usare l'AI Investor anche se sono un principiante?",
    answer: "Assolutamente! L'AI è progettata per adattarsi al tuo livello di conoscenza, spiegando concetti complessi in modo semplice per i principianti e fornendo analisi dettagliate per investitori più esperti."
  }
]

