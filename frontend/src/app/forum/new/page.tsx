import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PostCreationForm from "@/components/forum/post-creation-form"

export default function NewPostPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Discussion</CardTitle>
          <CardDescription>Share your travel experiences or ask questions about destinations</CardDescription>
        </CardHeader>
        <CardContent>
          <PostCreationForm />
        </CardContent>
      </Card>
    </div>
  )
}

