"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useCategories, useDestinations } from "@/hooks/use-forum"
import { Bold, Italic, LinkIcon, List, Image, Heading, Quote } from "lucide-react"

export default function PostCreationForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [destinationId, setDestinationId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { categories, isLoading: categoriesLoading } = useCategories()
  const { destinations, isLoading: destinationsLoading } = useDestinations()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !categoryId || !destinationId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // This would be implemented with a server action or API call
      // For now, we'll just simulate a submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Success",
        description: "Your discussion has been posted",
      })

      // Redirect to the forum home page
      router.push("/forum")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create discussion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatText = (format: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let formattedText = ""
    let cursorPosition = 0

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        cursorPosition = start + 2
        break
      case "italic":
        formattedText = `*${selectedText}*`
        cursorPosition = start + 1
        break
      case "heading":
        formattedText = `## ${selectedText}`
        cursorPosition = start + 3
        break
      case "list":
        formattedText = `\n- ${selectedText}`
        cursorPosition = start + 3
        break
      case "quote":
        formattedText = `> ${selectedText}`
        cursorPosition = start + 2
        break
      case "link":
        const url = prompt("Enter URL:", "https://")
        if (url) {
          formattedText = `[${selectedText || "Link text"}](${url})`
          cursorPosition = start + 1
        }
        break
      case "image":
        const imageUrl = prompt("Enter image URL:", "https://")
        if (imageUrl) {
          formattedText = `![${selectedText || "Image description"}](${imageUrl})`
          cursorPosition = start + 2
        }
        break
    }

    if (formattedText) {
      const newContent = content.substring(0, start) + formattedText + content.substring(end)

      setContent(newContent)

      // Set cursor position after formatting
      setTimeout(() => {
        textarea.focus()
        if (selectedText) {
          textarea.selectionStart = start + formattedText.length
          textarea.selectionEnd = start + formattedText.length
        } else {
          textarea.selectionStart = cursorPosition
          textarea.selectionEnd = cursorPosition
        }
      }, 0)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your discussion a descriptive title"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesLoading ? (
                <SelectItem value="loading" disabled>
                  Loading categories...
                </SelectItem>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Select value={destinationId} onValueChange={setDestinationId} required>
            <SelectTrigger id="destination">
              <SelectValue placeholder="Select a destination" />
            </SelectTrigger>
            <SelectContent>
              {destinationsLoading ? (
                <SelectItem value="loading" disabled>
                  Loading destinations...
                </SelectItem>
              ) : (
                destinations.map((destination) => (
                  <SelectItem key={destination.id} value={destination.id}>
                    {destination.name}, {destination.country}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <div className="flex flex-wrap gap-2 pb-2">
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => formatText("bold")}>
            <Bold className="h-4 w-4" />
            <span className="sr-only">Bold</span>
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => formatText("italic")}>
            <Italic className="h-4 w-4" />
            <span className="sr-only">Italic</span>
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => formatText("heading")}>
            <Heading className="h-4 w-4" />
            <span className="sr-only">Heading</span>
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => formatText("list")}>
            <List className="h-4 w-4" />
            <span className="sr-only">List</span>
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => formatText("quote")}>
            <Quote className="h-4 w-4" />
            <span className="sr-only">Quote</span>
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => formatText("link")}>
            <LinkIcon className="h-4 w-4" />
            <span className="sr-only">Link</span>
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => formatText("image")}>
            <Image className="h-4 w-4" />
            <span className="sr-only">Image</span>
          </Button>
        </div>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your travel experiences or ask questions..."
          className="min-h-[300px] font-mono text-sm resize-y"
          required
        />
        <p className="text-xs text-muted-foreground">
          Supports Markdown formatting. Use the toolbar above to format your text.
        </p>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Discussion"}
        </Button>
      </div>
    </form>
  )
}

