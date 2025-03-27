"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Bold, Italic, Link, List, Image } from "lucide-react"

interface CommentFormProps {
  threadId: string
  parentId?: string
  onCancel?: () => void
}

export default function CommentForm({ threadId, parentId, onCancel }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // This would be implemented with a server action or API call
      // For now, we'll just simulate a submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Your comment has been posted",
      })

      setContent("")
      if (onCancel) onCancel()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-2 pb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => setContent((prev) => `**${prev}**`)}
        >
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => setContent((prev) => `*${prev}*`)}
        >
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => {
            const url = prompt("Enter URL:")
            if (url) setContent((prev) => `[${prev}](${url})`)
          }}
        >
          <Link className="h-4 w-4" />
          <span className="sr-only">Link</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => setContent((prev) => `\n- ${prev}`)}
        >
          <List className="h-4 w-4" />
          <span className="sr-only">List</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => {
            const url = prompt("Enter image URL:")
            if (url) setContent((prev) => `![Image](${url})`)
          }}
        >
          <Image className="h-4 w-4" />
          <span className="sr-only">Image</span>
        </Button>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        className="min-h-32 resize-y"
      />

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : parentId ? "Reply" : "Post Comment"}
        </Button>
      </div>
    </form>
  )
}

