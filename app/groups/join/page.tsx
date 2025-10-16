"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function JoinGroupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [inviteCode, setInviteCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to join a group",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("id, name")
        .eq("invite_code", inviteCode.toUpperCase().trim())
        .maybeSingle()

      if (groupError) {
        console.error("[v0] Group lookup error:", groupError)
        throw new Error("Failed to find group. Please check the code and try again.")
      }

      if (!group) {
        toast({
          title: "Invalid invite code",
          description: "No group found with this code. Please check and try again.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const { data: existingMember } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", group.id)
        .eq("user_id", user.id)
        .maybeSingle()

      if (existingMember) {
        toast({
          title: "Already a member",
          description: `You're already in ${group.name}`,
        })
        router.push(`/groups/${group.id}`)
        return
      }

      const { error: memberError } = await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: user.id,
        role: "member",
      })

      if (memberError) {
        console.error("[v0] Join group error:", memberError)
        throw new Error("Failed to join group. Please try again.")
      }

      toast({
        title: "Joined group!",
        description: `You've successfully joined ${group.name}`,
      })

      router.push(`/groups/${group.id}`)
      router.refresh()
    } catch (err: any) {
      console.error("[v0] Join group error:", err)
      toast({
        title: "Failed to join group",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
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
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Join a group</h1>
              <p className="text-muted-foreground">Enter the invite code to join</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Enter invite code</CardTitle>
              <CardDescription>Ask your friend for the 6-character code</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinGroup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite code</Label>
                  <Input
                    id="inviteCode"
                    placeholder="ABC123"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    required
                    disabled={loading}
                    maxLength={6}
                    className="text-center text-2xl font-mono tracking-widest"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading || inviteCode.length !== 6} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join group"
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild disabled={loading}>
                    <Link href="/dashboard">Cancel</Link>
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
