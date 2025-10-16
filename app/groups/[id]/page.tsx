import { redirect } from "next/navigation"
import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, PieChart } from "lucide-react"
import { GroupMembers } from "@/components/groups/group-members"
import { GroupExpenses } from "@/components/groups/group-expenses"
import { GroupActivities } from "@/components/groups/group-activities"
import { ShareGroupDialog } from "@/components/groups/share-group-dialog"

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Fetch members
  const { data: members } = await supabase
    .from("group_members")
    .select(
      `
      *,
      profiles (
        id,
        email,
        full_name
      )
    `,
    )
    .eq("group_id", id)

  // Fetch activities
  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("group_id", id)
    .order("activity_date", { ascending: false })

  // Fetch expenses
  const { data: expenses } = await supabase
    .from("expenses")
    .select(
      `
      *,
      profiles!expenses_paid_by_fkey (
        id,
        email,
        full_name
      ),
      activities (
        name
      )
    `,
    )
    .eq("group_id", id)
    .order("expense_date", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{group.name}</h1>
                {group.description && <p className="text-muted-foreground">{group.description}</p>}
              </div>
            </div>
            <ShareGroupDialog inviteCode={group.invite_code} groupName={group.name} />
          </div>

          <div className="flex gap-3">
            <Button asChild>
              <Link href={`/groups/${id}/expenses/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Add expense
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/groups/${id}/activities/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Add activity
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/groups/${id}/summary`}>
                <PieChart className="mr-2 h-4 w-4" />
                Summary
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="expenses" className="space-y-4">
            <TabsList>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-4">
              <GroupExpenses expenses={expenses || []} groupId={id} />
            </TabsContent>

            <TabsContent value="activities" className="space-y-4">
              <GroupActivities activities={activities || []} groupId={id} />
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <GroupMembers members={members || []} currentUserId={user.id} isAdmin={membership.role === "admin"} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
