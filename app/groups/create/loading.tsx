import { Skeleton } from "@/components/ui/skeleton"

export default function CreateGroupLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Skeleton className="h-8 w-48 mx-auto" />
        <div className="space-y-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-32" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
