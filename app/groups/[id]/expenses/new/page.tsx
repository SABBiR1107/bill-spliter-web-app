"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2 } from "lucide-react"

interface Member {
  id: string
  profiles: {
    id: string
    email: string
    full_name: string | null
  }
}

interface Activity {
  id: string
  name: string
}

export default function NewExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const [groupId, setGroupId] = useState<string>("")
  const router = useRouter()
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [paidBy, setPaidBy] = useState("")
  const [activityId, setActivityId] = useState<string>("")
  const [splitWith, setSplitWith] = useState<string[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState("")

  useEffect(() => {
    const initPage = async () => {
      const resolvedParams = await params
      setGroupId(resolvedParams.id)

      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setCurrentUserId(user.id)
        setPaidBy(user.id)
      }

      // Fetch group members
      const { data: membersData } = await supabase
        .from("group_members")
        .select(
          `
        id,
        profiles (
          id,
          email,
          full_name
        )
      `,
        )
        .eq("group_id", resolvedParams.id)

      if (membersData) {
        setMembers(membersData as Member[])
        setSplitWith(membersData.map((m) => m.profiles.id))
      }

      // Fetch activities
      const { data: activitiesData } = await supabase
        .from("activities")
        .select("id, name")
        .eq("group_id", resolvedParams.id)
        .order("activity_date", { ascending: false })

      if (activitiesData) {
        setActivities(activitiesData)
      }
    }

    initPage()
  }, [params])

  const toggleSplitMember = (memberId: string) => {
    setSplitWith((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (splitWith.length === 0) {
      setError("Please select at least one person to split with")
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // Create expense
      const { data: expense, error: expenseError } = await supabase
        .from("expenses")
        .insert({
          group_id: groupId,
          activity_id: activityId || null,
          description,
          amount: Number.parseFloat(amount),
          paid_by: paidBy,
        })
        .select()
        .single()

      if (expenseError) throw expenseError

      // Calculate split amounts
      const splitAmount = Number.parseFloat(amount) / splitWith.length

      // Create expense splits
      const splits = splitWith.map((userId) => ({
        expense_id: expense.id,
        user_id: userId,
        amount: splitAmount,
      }))

      const { error: splitsError } = await supabase.from("expense_splits").insert(splits)

      if (splitsError) throw splitsError

      router.push(`/groups/${groupId}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to add expense")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/groups/${groupId}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add expense</h1>
              <p className="text-muted-foreground">Record a new expense for the group</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Expense details</CardTitle>
              <CardDescription>Enter the expense information and split it among members</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddExpense} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Dinner at restaurant"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paidBy">Paid by</Label>
                  <Select value={paidBy} onValueChange={setPaidBy} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select who paid" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.profiles.id} value={member.profiles.id}>
                          {member.profiles.full_name || member.profiles.email.split("@")[0]}
                          {member.profiles.id === currentUserId && " (You)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {activities.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="activity">Activity (optional)</Label>
                    <Select value={activityId} onValueChange={setActivityId} disabled={loading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {activities.map((activity) => (
                          <SelectItem key={activity.id} value={activity.id}>
                            {activity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-3">
                  <Label>Split equally with</Label>
                  <div className="space-y-2 border rounded-lg p-4">
                    {members.map((member) => {
                      const displayName = member.profiles.full_name || member.profiles.email.split("@")[0]
                      return (
                        <div key={member.profiles.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={member.profiles.id}
                            checked={splitWith.includes(member.profiles.id)}
                            onCheckedChange={() => toggleSplitMember(member.profiles.id)}
                            disabled={loading}
                          />
                          <label
                            htmlFor={member.profiles.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {displayName}
                            {member.profiles.id === currentUserId && " (You)"}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                  {amount && splitWith.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Each person pays: ${(Number.parseFloat(amount) / splitWith.length).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add expense"
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild disabled={loading}>
                    <Link href={`/groups/${groupId}`}>Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
