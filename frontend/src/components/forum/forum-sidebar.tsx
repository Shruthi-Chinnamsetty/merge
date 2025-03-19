import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Flame, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { getTrendingDestinations, getActiveDiscussions } from "@/lib/forum-service"

export default async function ForumSidebar() {
  const [trendingDestinations, activeDiscussions] = await Promise.all([
    getTrendingDestinations(),
    getActiveDiscussions(),
  ])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Trending Destinations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingDestinations.map((destination) => (
            <Link
              href={`/destinations/${destination.id}`}
              key={destination.id}
              className="flex items-start space-x-3 group"
            >
              <div className="w-12 h-12 rounded-md overflow-hidden">
                <img
                  src={destination.imageUrl || "/placeholder.svg?height=48&width=48"}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-medium group-hover:text-primary transition-colors">{destination.name}</h4>
                <p className="text-xs text-muted-foreground">{destination.country}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Flame className="mr-1 h-3 w-3 text-primary" />
                  <span>{destination.trendingScore} activity points</span>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Active Discussions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeDiscussions.map((discussion) => (
            <Link href={`/forum/thread/${discussion.id}`} key={discussion.id} className="block group">
              <div className="space-y-1">
                <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                  {discussion.title}
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                      <AvatarFallback>{discussion.author.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{discussion.author.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                    {discussion.commentCount} replies
                  </Badge>
                </div>
              </div>
              <Separator className="mt-3" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

