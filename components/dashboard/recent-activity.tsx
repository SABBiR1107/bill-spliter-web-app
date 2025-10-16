import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt } from "lucide-react"

interface Expense {
  id: string
  description: string
  amount: number
  expense_date: string
  groups: {
    name: string
  } | null
  profiles: {
    full_name: string | null
    email: string
  } | null
}

interface RecentActivityProps {
  expenses: Expense[]
}

export function RecentActivity({ expenses }: RecentActivityProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>No recent expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Receipt className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Start adding expenses to see activity here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Latest expenses across your groups</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Receipt className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{expense.description}</p>
                <p className="text-xs text-muted-foreground">
                  {expense.groups?.name} • {expense.profiles?.full_name || expense.profiles?.email?.split("@")[0]}
                </p>
              </div>
              <div className="text-sm font-semibold text-primary">${expense.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
