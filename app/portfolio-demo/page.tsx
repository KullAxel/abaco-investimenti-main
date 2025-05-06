"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight, Plus, Bell, Settings } from "lucide-react"

export default function PortfolioDemoPage() {
  // Sample data for demonstration
  const performanceData = [
    { date: "Gen", value: 10000 },
    { date: "Feb", value: 10200 },
    { date: "Mar", value: 10150 },
    { date: "Apr", value: 10400 },
    { date: "Mag", value: 10600 },
    { date: "Giu", value: 10550 },
    { date: "Lug", value: 10800 },
    { date: "Ago", value: 11000 },
    { date: "Set", value: 11200 },
    { date: "Ott", value: 11400 },
    { date: "Nov", value: 11600 },
    { date: "Dic", value: 11800 },
  ]

  const allocationData = [
    { name: "Azioni", value: 45 },
    { name: "Obbligazioni", value: 30 },
    { name: "ETF", value: 15 },
    { name: "Liquidità", value: 10 },
  ]

  const assets = [
    { name: "AAPL", type: "Azione", value: 3200, change: 2.5 },
    { name: "MSFT", type: "Azione", value: 2800, change: 1.8 },
    { name: "AMZN", type: "Azione", value: 2400, change: -0.7 },
    { name: "BTP 2030", type: "Obbligazione", value: 2000, change: 0.3 },
    { name: "VWCE", type: "ETF", value: 1800, change: 1.2 },
  ]

  const summaryCards = [
    {
      title: "Valore Totale",
      value: "€11,800.00",
      change: 18,
      changeText: "+18% YTD",
    },
    {
      title: "Rendimento Mensile",
      value: "€200.00",
      change: 1.7,
      changeText: "+1.7% MTD",
    },
    {
      title: "Rischio",
      value: "Moderato",
      change: 0,
      changeText: "Volatilità: 12%",
    },
  ]

  const features = [
    {
      title: "Gestione Asset:",
      description: "Aggiungi e categorizza facilmente i tuoi investimenti.",
    },
    {
      title: "Tracking Performance:",
      description: "Monitora in tempo reale l'andamento dei tuoi investimenti.",
    },
    {
      title: "Analisi Portafoglio:",
      description: "Ricevi insights dettagliati sulla diversificazione e il rischio.",
    },
    {
      title: "Personalizzazione:",
      description: "Imposta avvisi per eventi significativi e personalizza la dashboard.",
    },
    {
      title: "Reportistica:",
      description: "Genera report dettagliati sulle performance del tuo portafoglio.",
    },
  ]

  return (
    <div className="flex flex-col">
      <section className="w-full py-16 md:py-24 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Portfolio Web App</h1>
              <p className="text-muted-foreground md:text-xl">
                Gestisci e monitora i tuoi investimenti con la nostra app intuitiva e potente.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-4xl mt-12">
            <Card className="border border-primary/40 bg-card/60 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle>Demo della Portfolio Web App</CardTitle>
                <CardDescription>
                  Questa è una demo delle funzionalità disponibili con l'abbonamento Premium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    {summaryCards.map((card, index) => (
                      <Card
                        key={index}
                        className="flex-1 border border-border/40 bg-card/60 hover:border-primary/40 transition-all duration-200"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{card.value}</div>
                          <div
                            className={`flex items-center text-sm ${card.change >= 0 ? "text-primary" : "text-red-500"} mt-1`}
                          >
                            {card.change >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            <span>{card.changeText}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Tabs defaultValue="performance" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 rounded-full bg-secondary p-1">
                      <TabsTrigger value="performance" className="rounded-full">
                        Performance
                      </TabsTrigger>
                      <TabsTrigger value="allocation" className="rounded-full">
                        Allocazione
                      </TabsTrigger>
                      <TabsTrigger value="assets" className="rounded-full">
                        Asset
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="performance" className="p-4 animate-fade-in">
                      <div className="h-[300px] w-full border border-muted rounded-lg flex items-center justify-center">
                        <div className="text-center p-6">
                          <p className="text-lg font-semibold mb-2">Grafico Performance</p>
                          <p className="text-muted-foreground">
                            Visualizzazione grafica disabilitata per compatibilità con React 19.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="allocation" className="p-4 animate-fade-in">
                      <div className="h-[300px] w-full border border-muted rounded-lg flex items-center justify-center">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-8">
                          {allocationData.map((item, i) => (
                            <Card key={i} className="text-center p-4">
                              <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
                              <p className="text-2xl font-bold">{item.value}%</p>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="assets" className="p-4 animate-fade-in">
                      <div className="rounded-md border border-border/40">
                        <div className="grid grid-cols-5 gap-4 p-4 font-medium">
                          <div>Nome</div>
                          <div>Tipo</div>
                          <div className="text-right">Valore (€)</div>
                          <div className="text-right">Variazione</div>
                          <div className="text-right">Azioni</div>
                        </div>
                        <div className="divide-y divide-border/40">
                          {assets.map((asset, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-5 gap-4 p-4 hover:bg-secondary/40 transition-colors duration-200"
                            >
                              <div>{asset.name}</div>
                              <div className="text-muted-foreground">{asset.type}</div>
                              <div className="text-right">{asset.value.toLocaleString()}</div>
                              <div className={`text-right ${asset.change >= 0 ? "text-primary" : "text-red-500"}`}>
                                {asset.change >= 0 ? (
                                  <span className="flex items-center justify-end">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    {asset.change}%
                                  </span>
                                ) : (
                                  <span className="flex items-center justify-end">
                                    <ArrowDownRight className="h-4 w-4 mr-1" />
                                    {Math.abs(asset.change)}%
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                                  <Bell className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-center mt-4">
                        <Button className="rounded-full btn-hover">
                          <Plus className="h-4 w-4 mr-2" />
                          Aggiungi Asset
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Funzionalità Principali</h2>
                <p className="text-muted-foreground">
                  La nostra Portfolio Web App offre tutto ciò di cui hai bisogno per gestire i tuoi investimenti in modo
                  efficace.
                </p>
              </div>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 translate-y-2 rounded-full bg-primary"></div>
                    <p>
                      <span className="font-bold">{feature.title}</span> {feature.description}
                    </p>
                  </li>
                ))}
              </ul>
              <div>
                <Button asChild className="rounded-full btn-hover">
                  <Link href="/pricing">Abbonati Ora</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/20 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center p-6 bg-card/80 backdrop-blur-sm rounded-lg shadow-lg max-w-[80%] border border-border/40">
                    <h3 className="text-xl font-bold mb-2">Prova la Demo</h3>
                    <p className="mb-4 text-muted-foreground">
                      Esplora tutte le funzionalità della nostra Portfolio Web App con un abbonamento Premium.
                    </p>
                    <Button asChild className="rounded-full btn-hover">
                      <Link href="/pricing">Inizia Ora</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

