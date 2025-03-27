"use client"

import { useState } from "react"
import { useComments } from "@/hooks/use-forum"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronUp, ChevronDown, Reply, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import CommentForm from "./comment-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CommentSectionProps {
  threadId: string
}

export default function CommentSection({ threadId }: CommentSectionProps) {
  const { comments, isLoading, error } = useComments(threadId)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  if (isLoading) {
    return <CommentsSkeleton />
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error loading comments</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please try again later or contact support if the problem persists.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Comments ({comments.length})</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add a comment</CardTitle>
        </CardHeader>
        <CardContent>
          <CommentForm threadId={threadId} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback>{comment.author.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Report</DropdownMenuItem>
                      <DropdownMenuItem>Copy Link</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{comment.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 rounded-md border bg-background p-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronUp className="h-4 w-4" />
                      <span className="sr-only">Upvote</span>
                    </Button>
                    <div className="min-w-8 px-2 text-center text-xs font-medium">
                      {comment.upvotes - comment.downvotes}
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">Downvote</span>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <Reply className="mr-1 h-3 w-3" />
                    Reply
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {replyingTo === comment.id && (
              <div className="ml-8">
                <CommentForm threadId={threadId} parentId={comment.id} onCancel={() => setReplyingTo(null)} />
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-8 space-y-4">
                {comment.replies.map((reply) => (
                  <Card key={reply.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                            <AvatarFallback>{reply.author.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{reply.author.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Report</DropdownMenuItem>
                            <DropdownMenuItem>Copy Link</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{reply.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 rounded-md border bg-background p-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ChevronUp className="h-4 w-4" />
                            <span className="sr-only">Upvote</span>
                          </Button>
                          <div className="min-w-8 px-2 text-center text-xs font-medium">
                            {reply.upvotes - reply.downvotes}
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ChevronDown className="h-4 w-4" />
                            <span className="sr-only">Downvote</span>
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function CommentsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-muted rounded animate-pulse" />
      </div>

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
  )
}

