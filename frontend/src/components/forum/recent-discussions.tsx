"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { useRecentDiscussions } from "@/hooks/use-forum"
import { formatDistanceToNow } from "date-fns"

export default function RecentDiscussions() {
  const { discussions, isLoading, error } = useRecentDiscussions()
  const [page, setPage] = useState(1)

  if (isLoading) {
    return <DiscussionsSkeleton />
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error loading discussions</CardTitle>
          <CardDescription>Please try again later or contact support if the problem persists.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Recent Discussions</h2>
        <Link href="/forum/new">
          <Button className="bg-primary hover:bg-primary/90">Start Discussion</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <Link href={`/forum/thread/${discussion.id}`} key={discussion.id}>
            <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{discussion.title}</CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {discussion.category}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {discussion.destination}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm">{discussion.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                      <AvatarFallback>{discussion.author.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{discussion.author.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  <span>{discussion.commentCount}</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={() => setPage(page + 1)} disabled={discussions.length < 10}>
          Load More
        </Button>
      </div>
    </div>
  )
}

function DiscussionsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
      </div>

      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="opacity-70">
              <CardHeader className="pb-2">
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse mt-2" />
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center space-x-4">
                  <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-4 w-8 bg-muted rounded animate-pulse" />
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  )
}

