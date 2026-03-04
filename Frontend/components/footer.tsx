import { Shield } from "lucide-react"

const footerLinks = [
  {
    title: "Platform",
    links: ["Features", "How It Works", "Tech Stack", "Applications"],
  },
  {
    title: "Resources",
    links: ["Documentation", "API Reference", "Research Papers", "Changelog"],
  },
  {
    title: "Project",
    links: ["About", "Team", "License", "Contact"],
  },
]

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Trust<span className="text-primary">Lens</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              An automated system for auditing machine learning models,
              contributing towards responsible and reliable AI deployment.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider + bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            TrustLens — Automated ML Model Auditing System. A research project promoting responsible AI.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Python, FastAPI, SHAP, and React.
          </p>
        </div>
      </div>
    </footer>
  )
}
