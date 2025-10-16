"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function NewActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const [groupId, setGroupId] = useState<string>("")
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [activityDate, setActivityDate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const initPage = async () => {
      const resolvedParams = await params
      setGroupId(resolvedParams.id)
    }

    initPage()
  }, [params])

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error: activityError } = await supabase.from("activities").insert({
        group_id: groupId,
        name,
        description: description || null,
        activity_date: activityDate || null,
        created_by: user.id,
      })

      if (activityError) throw activityError

      router.push(`/groups/${groupId}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to create activity")
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
              <h1 className="text-3xl font-bold">Add activity</h1>
              <p className="text-muted-foreground">Create a new activity to organize expenses</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity details</CardTitle>
              <CardDescription>Activities help you organize expenses by event or occasion</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateActivity} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Activity name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Day 1 - Tokyo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What's happening during this activity?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityDate">Date (optional)</Label>
                  <Input
                    id="activityDate"
                    type="date"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create activity"
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
