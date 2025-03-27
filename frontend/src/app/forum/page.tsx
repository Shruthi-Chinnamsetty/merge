import { Suspense } from "react"
import ForumCategories from "@/components/forum/forum-categories"
import RecentDiscussions from "@/components/forum/recent-discussions"
import ForumSidebar from "@/components/forum/forum-sidebar"
import { Separator } from "@/components/ui/separator"
import ForumPageSkeleton from "@/components/forum/forum-page-skeleton"

export default function ForumPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pocket Map Community</h1>
        <p className="text-muted-foreground">Connect with fellow travelers and share your experiences</p>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Suspense fallback={<ForumPageSkeleton />}>
            <ForumCategories />
            <Separator className="my-6" />
            <RecentDiscussions />
          </Suspense>
        </div>
        <div className="md:col-span-1">
          <ForumSidebar />
        </div>
      </div>
    </div>
  )
}

