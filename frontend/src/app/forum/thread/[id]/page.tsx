import { Suspense } from "react"
import { notFound } from "next/navigation"
import ThreadContent from "@/components/forum/thread-content"
import CommentSection from "@/components/forum/comment-section"
import ThreadSidebar from "@/components/forum/thread-sidebar"
import ThreadSkeleton from "@/components/forum/thread-skeleton"
import { Separator } from "@/components/ui/separator"
import { getThreadById } from "@/lib/forum-service"

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const threadId = params.id

  // This is a server component, so we can fetch the thread data directly
  const thread = await getThreadById(threadId)

  if (!thread) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Suspense fallback={<ThreadSkeleton />}>
            <ThreadContent thread={thread} />
            <Separator className="my-6" />
            <CommentSection threadId={threadId} />
          </Suspense>
        </div>
        <div className="md:col-span-1">
          <ThreadSidebar destinationId={thread.destinationId} />
        </div>
      </div>
    </div>
  )
}

