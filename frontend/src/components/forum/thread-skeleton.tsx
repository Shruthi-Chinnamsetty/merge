import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ThreadSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="opacity-70">
        <CardHeader className="space-y-4">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-5 w-20 bg-muted rounded animate-pulse" />
              <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex space-x-2">
              <div className="h-9 w-20 bg-muted rounded animate-pulse" />
              <div className="h-9 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          </div>

          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6 space-y-4">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
        </CardContent>

        <CardFooter className="flex justify-between pt-6">
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
          <div className="h-5 w-16 bg-muted rounded animate-pulse" />
        </CardFooter>
      </Card>

      <Separator />

      <div className="space-y-4">
        <div className="h-8 w-40 bg-muted rounded animate-pulse" />

        <Card className="opacity-70">
          <CardHeader>
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-24 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="opacity-70">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse mt-2" />
                </CardContent>
                <CardFooter>
                  <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

