import { redirect } from "next/navigation"
import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { BalanceSummary } from "@/components/summary/balance-summary"
import { SettlementSuggestions } from "@/components/summary/settlement-suggestions"

interface Balance {
  userId: string
  userName: string
  totalPaid: number
  totalOwed: number
  balance: number
}

export default async function GroupSummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch group details
  const { data: group } = await supabase.from("groups").select("*").eq("id", id).single()

  if (!group) {
    redirect("/dashboard")
  }

  // Check if user is a member
  const { data: membership } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", id)
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    redirect("/dashboard")
  }

  // Fetch all members
  const { data: members } = await supabase
    .from("group_members")
    .select(
      `
      profiles (
        id,
        email,
        full_name
      )
    `,
    )
    .eq("group_id", id)

  // Fetch all expenses with splits
  const { data: expenses } = await supabase
    .from("expenses")
    .select(
      `
      id,
      amount,
      paid_by,
      expense_splits (
        user_id,
        amount
      )
    `,
    )
    .eq("group_id", id)

  // Calculate balances
  const balances: Record<string, Balance> = {}

  // Initialize balances for all members
  members?.forEach((member) => {
    if (member.profiles) {
      const profile = member.profiles
      balances[profile.id] = {
        userId: profile.id,
        userName: profile.full_name || profile.email.split("@")[0],
        totalPaid: 0,
        totalOwed: 0,
        balance: 0,
      }
    }
  })

  // Calculate total paid and total owed for each member
  expenses?.forEach((expense) => {
    // Add to total paid
    if (expense.paid_by && balances[expense.paid_by]) {
      balances[expense.paid_by].totalPaid += Number(expense.amount)
    }

    // Add to total owed for each split
    expense.expense_splits?.forEach((split) => {
      if (balances[split.user_id]) {
        balances[split.user_id].totalOwed += Number(split.amount)
      }
    })
  })

  // Calculate net balance (positive = owed money, negative = owes money)
  Object.values(balances).forEach((balance) => {
    balance.balance = balance.totalPaid - balance.totalOwed
  })

  const balanceArray = Object.values(balances).sort((a, b) => b.balance - a.balance)

  // Calculate settlement suggestions
  const settlements: Array<{ from: string; to: string; amount: number }> = []
  const creditors = balanceArray.filter((b) => b.balance > 0.01).map((b) => ({ ...b }))
  const debtors = balanceArray.filter((b) => b.balance < -0.01).map((b) => ({ ...b }))

  let i = 0
  let j = 0

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i]
    const debtor = debtors[j]
    const amount = Math.min(creditor.balance, Math.abs(debtor.balance))

    if (amount > 0.01) {
      settlements.push({
        from: debtor.userName,
        to: creditor.userName,
        amount: Number(amount.toFixed(2)),
      })

      creditor.balance -= amount
      debtor.balance += amount
    }

    if (Math.abs(creditor.balance) < 0.01) i++
    if (Math.abs(debtor.balance) < 0.01) j++
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/groups/${id}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Summary</h1>
              <p className="text-muted-foreground">{group.name}</p>
            </div>
          </div>

          <BalanceSummary balances={balanceArray} currentUserId={user.id} />

          <SettlementSuggestions settlements={settlements} />
        </div>
      </div>
    </div>
  )
}
