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
import { useToast } from "@/hooks/use-toast"

export default function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string; activityId: string }>
}) {
  const [groupId, setGroupId] = useState<string>("")
  const [activityId, setActivityId] = useState<string>("")
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [activityDate, setActivityDate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const initPage = async () => {
      const resolvedParams = await params
      setGroupId(resolvedParams.id)
      setActivityId(resolvedParams.activityId)

      const supabase = getSupabaseBrowserClient()

      // Fetch activity data
      const { data: activityData, error: activityError } = await supabase
        .from("activities")
        .select("*")
        .eq("id", resolvedParams.activityId)
        .single()

      if (activityError) {
        toast({
          title: "Error",
          description: "Failed to load activity data",
          variant: "destructive",
        })
        router.push(`/groups/${resolvedParams.id}`)
        return
      }

      // Set form values
      setName(activityData.name)
      setDescription(activityData.description || "")
      setActivityDate(activityData.activity_date || "")

      setInitialLoading(false)
    }

    initPage()
  }, [params, router, toast])

  const handleUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error: updateError } = await supabase
        .from("activities")
        .update({
          name,
          description: description || null,
          activity_date: activityDate || null,
        })
        .eq("id", activityId)

      if (updateError) throw updateError

      toast({
        title: "Success",
        description: "Activity updated successfully",
      })

      router.push(`/groups/${groupId}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to update activity")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
              <h1 className="text-3xl font-bold">Edit activity</h1>
              <p className="text-muted-foreground">Update activity details</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity details</CardTitle>
              <CardDescription>Modify the activity information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateActivity} className="space-y-4">
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
                        Updating...
                      </>
                    ) : (
                      "Update activity"
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
