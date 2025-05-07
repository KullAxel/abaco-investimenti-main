import { BarChart3, MessageSquare, Shield, Users } from "lucide-react"

const features = [
  { icon: BarChart3, label: "Gestione portafoglio" },
  { icon: MessageSquare, label: "Consulenza AI" },
  { icon: Shield, label: "Sicurezza avanzata" },
  { icon: Users, label: "Supporto dedicato" },
]

export default function FeatureStrip() {
  return (
    <section className="w-full bg-primary py-6 flex justify-center">
      <div className="flex gap-10 w-full max-w-3xl justify-between">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-primary-foreground text-sm">
            <f.icon className="w-7 h-7 mb-2" strokeWidth={1.5} />
            <span>{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
