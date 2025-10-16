import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, QrCode } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1" size="lg">
            <Link href="/groups/create">
              <Plus className="mr-2 h-5 w-5" />
              Create group
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-transparent" size="lg">
            <Link href="/groups/join">
              <QrCode className="mr-2 h-5 w-5" />
              Join group
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
