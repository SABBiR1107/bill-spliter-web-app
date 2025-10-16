import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface Balance {
  userId: string
  userName: string
  totalPaid: number
  totalOwed: number
  balance: number
}

interface BalanceSummaryProps {
  balances: Balance[]
  currentUserId: string
}

export function BalanceSummary({ balances, currentUserId }: BalanceSummaryProps) {
  const totalExpenses = balances.reduce((sum, b) => sum + b.totalPaid, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance summary</CardTitle>
        <CardDescription>Total expenses: ${totalExpenses.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {balances.map((balance) => {
            const isCurrentUser = balance.userId === currentUserId
            const isPositive = balance.balance > 0.01
            const isNegative = balance.balance < -0.01
            const isSettled = !isPositive && !isNegative

            return (
              <div
                key={balance.userId}
                className={`p-4 rounded-lg border ${isCurrentUser ? "bg-primary/5 border-primary/20" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {balance.userName}
                        {isCurrentUser && <span className="text-muted-foreground ml-2">(You)</span>}
                      </p>
                      {isPositive && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {isNegative && <TrendingDown className="w-4 h-4 text-red-600" />}
                      {isSettled && <Minus className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Paid: ${balance.totalPaid.toFixed(2)}</span>
                      <span>Owes: ${balance.totalOwed.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {isPositive && (
                      <div>
                        <p className="text-sm text-muted-foreground">Gets back</p>
                        <p className="text-xl font-bold text-green-600">${balance.balance.toFixed(2)}</p>
                      </div>
                    )}
                    {isNegative && (
                      <div>
                        <p className="text-sm text-muted-foreground">Owes</p>
                        <p className="text-xl font-bold text-red-600">${Math.abs(balance.balance).toFixed(2)}</p>
                      </div>
                    )}
                    {isSettled && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Settled up</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
