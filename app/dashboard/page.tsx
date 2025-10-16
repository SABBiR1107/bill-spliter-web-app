import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Navbar } from "@/components/layout/navbar"
import { GroupsList } from "@/components/dashboard/groups-list"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: groupMemberships } = await supabase
    .from("group_members")
    .select("groups(id, name, description, created_at)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false })

  const groups = groupMemberships?.map((gm: any) => gm.groups).filter(Boolean) || []

  let recentExpenses = []
  if (groups.length > 0) {
    const { data } = await supabase
      .from("expenses")
      .select(
        `
        *,
        groups (name),
        profiles!expenses_paid_by_fkey (full_name, email)
      `,
      )
      .in(
        "group_id",
        groups.map((g: any) => g.id),
      )
      .order("created_at", { ascending: false })
      .limit(5)

    recentExpenses = data || []
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your groups and track expenses</p>
        </div>

        <QuickActions />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GroupsList groups={groups} />
          </div>

          <div>
            <RecentActivity expenses={recentExpenses} />
          </div>
        </div>
      </main>
    </div>
  )
}
