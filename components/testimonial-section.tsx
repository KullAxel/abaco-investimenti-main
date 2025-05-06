import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export default function TestimonialSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Cosa Dicono i Nostri Clienti
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Scopri le esperienze di chi ha già scelto Abaco Investimenti
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 fill-primary text-primary" />
            <Star className="h-5 w-5 fill-primary text-primary" />
            <Star className="h-5 w-5 fill-primary text-primary" />
            <Star className="h-5 w-5 fill-primary text-primary" />
            <Star className="h-5 w-5 text-muted-foreground" />
            <span className="ml-2 text-sm font-medium">4.0 su TrustScore</span>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border border-border/40 bg-card/60 hover:border-primary/40 transition-all duration-200 hover-scale"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={testimonial.name} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">"{testimonial.text}"</p>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.status}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const testimonials = [
  {
    name: "Marco B.",
    initials: "MB",
    rating: 5,
    text: "Grazie ad Abaco Investimenti ho finalmente capito come funzionano gli investimenti. I corsi sono chiari e la piattaforma è intuitiva.",
    status: "Cliente da 2 anni",
  },
  {
    name: "Laura T.",
    initials: "LT",
    rating: 4,
    text: "L'AI Investor Chat è fantastico! Mi ha aiutato a prendere decisioni più consapevoli e a diversificare meglio il mio portafoglio.",
    status: "Cliente da 1 anno",
  },
  {
    name: "Giovanni R.",
    initials: "GR",
    rating: 3,
    text: "La Portfolio Web App è uno strumento potente per monitorare i miei investimenti. Vorrei solo che avesse più opzioni di personalizzazione.",
    status: "Cliente da 6 mesi",
  },
]

