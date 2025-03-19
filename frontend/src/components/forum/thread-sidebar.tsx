import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Users, Calendar, Info } from "lucide-react"
import Link from "next/link"
import { getDestinationInfo, getRelatedThreads } from "@/lib/forum-service"

interface ThreadSidebarProps {
  destinationId: string
}

export default async function ThreadSidebar({ destinationId }: ThreadSidebarProps) {
  const [destinationInfo, relatedThreads] = await Promise.all([
    getDestinationInfo(destinationId),
    getRelatedThreads(destinationId),
  ])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <MapPin className="mr-2 h-5 w-5 text-primary" />
            About {destinationInfo.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-md">
            <img
              src={destinationInfo.imageUrl || "/placeholder.svg?height=180&width=320"}
              alt={destinationInfo.name}
              className="h-full w-full object-cover"
            />
          </div>

          <p className="text-sm text-muted-foreground">{destinationInfo.description}</p>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span>{destinationInfo.visitorCount} visitors</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              <span>Best time: {destinationInfo.bestTimeToVisit}</span>
            </div>
          </div>

          <Button asChild className="w-full bg-primary hover:bg-primary/90">
            <Link href={`/destinations/${destinationId}`}>View Destination</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <Info className="mr-2 h-5 w-5 text-primary" />
            Related Discussions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {relatedThreads.map((thread) => (
            <Link href={`/forum/thread/${thread.id}`} key={thread.id} className="flex items-start space-x-3 group">
              <Avatar className="h-8 w-8">
                <AvatarImage src={thread.author.avatar} alt={thread.author.name} />
                <AvatarFallback>{thread.author.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="line-clamp-2 text-sm font-medium group-hover:text-primary">{thread.title}</p>
                <p className="text-xs text-muted-foreground">{thread.commentCount} comments</p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

