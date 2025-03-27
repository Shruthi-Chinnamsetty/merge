import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ForumPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="opacity-70">
                <CardHeader>
                  <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>

        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="opacity-70">
              <CardHeader>
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse mt-2" />
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

