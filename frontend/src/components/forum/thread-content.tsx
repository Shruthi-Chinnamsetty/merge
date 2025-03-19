import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Flag, Share2, Bookmark } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import type { Thread } from "@/types/forum"

interface ThreadContentProps {
  thread: Thread
}

export default function ThreadContent({ thread }: ThreadContentProps) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <Link href={`/forum/category/${thread.categoryId}`}>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {thread.category}
              </Badge>
            </Link>
            <CardTitle className="text-2xl">{thread.title}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Bookmark className="mr-1 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Flag className="mr-1 h-4 w-4" />
              Report
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4 text-primary" />
            <Link href={`/destinations/${thread.destinationId}`} className="hover:text-primary">
              {thread.destination}
            </Link>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <time dateTime={thread.createdAt}>
              {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
            </time>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={thread.author.avatar} alt={thread.author.name} />
            <AvatarFallback>{thread.author.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{thread.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {thread.author.tripCount} trips · {thread.author.postCount} posts
            </p>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="prose prose-green max-w-none" dangerouslySetInnerHTML={{ __html: thread.content }} />
      </CardContent>

      <CardFooter className="flex flex-wrap justify-between gap-2 pt-6">
        <div className="flex items-center space-x-2">
          <ThreadVoteButtons threadId={thread.id} initialUpvotes={thread.upvotes} initialDownvotes={thread.downvotes} />
        </div>
        <div className="text-sm text-muted-foreground">{thread.viewCount} views</div>
      </CardFooter>
    </Card>
  )
}

interface ThreadVoteButtonsProps {
  threadId: string
  initialUpvotes: number
  initialDownvotes: number
}

function ThreadVoteButtons({ threadId, initialUpvotes, initialDownvotes }: ThreadVoteButtonsProps) {
  // This would be implemented with a server action or API call
  // For now, we'll just show the UI
  return (
    <div className="flex items-center space-x-1 rounded-md border bg-background p-1">
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span className="sr-only">Upvote</span>
      </Button>
      <div className="min-w-10 px-2 text-center text-sm font-medium">{initialUpvotes - initialDownvotes}</div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="m12 5 7 7-7 7" />
          <path d="M5 12h14" />
        </svg>
        <span className="sr-only">Downvote</span>
      </Button>
    </div>
  )
}

