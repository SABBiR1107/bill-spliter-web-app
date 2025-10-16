import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, Receipt, PieChart, QrCode } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
              Split expenses with friends, <span className="text-primary">effortlessly</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Track group expenses, split bills fairly, and settle up with ease. Perfect for trips, dinners, and shared
              living.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/register">Get started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-16">
            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Create groups</h3>
              <p className="text-muted-foreground">
                Organize expenses by trip, event, or household. Invite friends with a simple code or QR.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Receipt className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Track expenses</h3>
              <p className="text-muted-foreground">
                Log who paid what and split costs fairly among group members automatically.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <PieChart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">View summaries</h3>
              <p className="text-muted-foreground">
                See who owes whom at a glance with clear breakdowns and balance calculations.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Easy sharing</h3>
              <p className="text-muted-foreground">
                Share group invites via QR code or simple invite link. No complicated setup required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
