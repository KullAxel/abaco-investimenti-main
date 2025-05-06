import { MessageSquare, Wallet, BarChart3, MessagesSquare } from "lucide-react"

export default function FeatureSection() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-semibold text-black mb-4">I nostri servizi</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 text-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-red-100 mb-4">
                <feature.icon className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-black">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const features = [
  {
    icon: Wallet,
    title: "Conto",
  },
  {
    icon: BarChart3, 
    title: "Portafolio Tracker",
  },
  {
    icon: MessageSquare,
    title: "Chat AI Avanzata",
  },
  {
    icon: MessagesSquare,
    title: "Supporto Dedicato",
  }
]

