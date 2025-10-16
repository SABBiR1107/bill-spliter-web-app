import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Member {
  id: string
  role: string
  joined_at: string
  profiles: {
    id: string
    email: string
    full_name: string | null
  } | null
}

interface GroupMembersProps {
  members: Member[]
  currentUserId: string
  isAdmin: boolean
}

export function GroupMembers({ members, currentUserId, isAdmin }: GroupMembersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>{members.length} member(s) in this group</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => {
            const profile = member.profiles
            if (!profile) return null

            const displayName = profile.full_name || profile.email.split("@")[0]
            const initials = displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)

            return (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {displayName}
                      {profile.id === currentUserId && <span className="text-muted-foreground ml-2">(You)</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                {member.role === "admin" && <Badge variant="secondary">Admin</Badge>}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
