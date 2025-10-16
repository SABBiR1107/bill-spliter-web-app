import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Receipt, MoreVertical, Pencil } from "lucide-react"
import Link from "next/link"

interface Expense {
  id: string
  description: string
  amount: number
  expense_date: string
  profiles: {
    id: string
    email: string
    full_name: string | null
  } | null
  activities: {
    name: string
  } | null
}

interface GroupExpensesProps {
  expenses: Expense[]
  groupId: string
}

export function GroupExpenses({ expenses, groupId }: GroupExpensesProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>No expenses yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Add your first expense to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <CardDescription>
          {expenses.length} expense(s) • Total: ${totalAmount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenses.map((expense) => {
            const paidBy = expense.profiles?.full_name || expense.profiles?.email.split("@")[0] || "Unknown"

            return (
              <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Paid by {paidBy}
                      {expense.activities && ` • ${expense.activities.name}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-primary">${Number(expense.amount).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(expense.expense_date).toLocaleDateString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/groups/${groupId}/expenses/${expense.id}/edit`} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
