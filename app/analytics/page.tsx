import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Navbar } from "@/components/layout/navbar"
import { ExpenseChart } from "@/components/analytics/expense-chart"
import { ExpenseStats } from "@/components/analytics/expense-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AnalyticsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get all groups user is part of
  const { data: groupMemberships } = await supabase.from("group_members").select("group_id").eq("user_id", user.id)

  const groupIds = groupMemberships?.map((gm) => gm.group_id) || []

  // Get all expenses from user's groups
  const { data: expenses } = await supabase
    .from("expenses")
    .select(
      `
      *,
      groups (name),
      profiles!expenses_paid_by_fkey (full_name, email)
    `,
    )
    .in("group_id", groupIds)
    .order("created_at", { ascending: false })

  const allExpenses = expenses || []

  // Calculate statistics
  const totalExpenses = allExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0)
  const userPaidExpenses = allExpenses.filter((exp) => exp.paid_by === user.id)
  const totalPaid = userPaidExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0)

  // Get expense splits for user
  const { data: splits } = await supabase
    .from("expense_splits")
    .select("amount, expenses!inner(group_id)")
    .eq("user_id", user.id)
    .in("expenses.group_id", groupIds.length > 0 ? groupIds : ["00000000-0000-0000-0000-000000000000"])

  const totalOwed = splits?.reduce((sum, split) => sum + Number(split.amount), 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Visualize your spending patterns</p>
          </div>

          <ExpenseStats
            totalExpenses={totalExpenses}
            totalPaid={totalPaid}
            totalOwed={totalOwed}
            expenseCount={allExpenses.length}
          />

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Trends</CardTitle>
                <CardDescription>Your spending over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseChart expenses={allExpenses} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Groups by Spending</CardTitle>
                <CardDescription>Groups with the most expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    allExpenses.reduce(
                      (acc, exp) => {
                        const groupName = exp.groups?.name || "Unknown"
                        acc[groupName] = (acc[groupName] || 0) + Number(exp.amount)
                        return acc
                      },
                      {} as Record<string, number>,
                    ),
                  )
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([group, amount]) => (
                      <div key={group} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{group}</span>
                        <span className="text-sm text-muted-foreground">${amount.toFixed(2)}</span>
                      </div>
                    ))}
                  {allExpenses.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No expenses yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
