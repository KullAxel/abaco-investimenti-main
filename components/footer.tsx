import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Abaco Investimenti</h3>
            <p className="text-sm text-muted-foreground">Educazione finanziaria e strumenti per investitori</p>
            <p className="text-sm text-muted-foreground mt-2">Torino, Italia</p>
            <div className="flex gap-4 mt-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
          {footerSections.map((section, index) => (
            <div key={index} className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border/40 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Abaco Investimenti. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  )
}

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
]

const footerSections = [
  {
    title: "Risorse",
    links: [
      { label: "Corsi", href: "/courses" },
      { label: "Blog", href: "/blog" },
      { label: "Guide", href: "/guides" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Azienda",
    links: [
      { label: "Chi Siamo", href: "/about" },
      { label: "Team", href: "/team" },
      { label: "Lavora con noi", href: "/careers" },
      { label: "Contatti", href: "/contact" },
    ],
  },
  {
    title: "Legale",
    links: [
      { label: "Termini di Servizio", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
]

