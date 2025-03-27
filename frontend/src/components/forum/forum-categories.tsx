import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getDestinationCategories } from "@/lib/forum-service"

export default async function ForumCategories() {
  const categories = await getDestinationCategories()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Destination Categories</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Link href={`/forum/category/${category.id}`} key={category.id}>
            <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {category.threadCount} threads
                  </Badge>
                  <span className="text-sm text-muted-foreground">{category.postCount} posts</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

