import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle2 } from "lucide-react"

interface Settlement {
  from: string
  to: string
  amount: number
}

interface SettlementSuggestionsProps {
  settlements: Settlement[]
}

export function SettlementSuggestions({ settlements }: SettlementSuggestionsProps) {
  if (settlements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Settlement</CardTitle>
          <CardDescription>How to settle up</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="font-semibold text-lg mb-2">All settled up!</p>
            <p className="text-muted-foreground">Everyone has paid their fair share</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settlement suggestions</CardTitle>
        <CardDescription>Simplified payments to settle all balances</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {settlements.map((settlement, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-semibold">{settlement.from}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">{settlement.to}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">${settlement.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
