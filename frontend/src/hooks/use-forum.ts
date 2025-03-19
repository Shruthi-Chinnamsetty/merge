"use client"

import { useState, useEffect } from "react"
import type { Thread, Comment, Category, Destination } from "../types/forum"

// This would be replaced with actual API calls in a real application
// For now, we'll just simulate API responses

export function useRecentDiscussions() {
  const [discussions, setDiscussions] = useState<Thread[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockDiscussions: Thread[] = Array(5)
          .fill(0)
          .map((_, i) => ({
            id: `thread-${i + 1}`,
            title: `Exploring the hidden gems of ${["Paris", "Tokyo", "New York", "Barcelona", "Sydney"][i]}`,
            content: `<p>This is a detailed post about ${["Paris", "Tokyo", "New York", "Barcelona", "Sydney"][i]}...</p>`,
            excerpt: `I recently visited ${["Paris", "Tokyo", "New York", "Barcelona", "Sydney"][i]} and discovered some amazing places off the beaten path...`,
            author: {
              id: `user-${i + 1}`,
              name: `User ${i + 1}`,
              initials: `U${i + 1}`,
              tripCount: Math.floor(Math.random() * 20) + 1,
              postCount: Math.floor(Math.random() * 50) + 1,
            },
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
            categoryId: `category-${(i % 3) + 1}`,
            category: ["City Guides", "Adventure", "Food & Culture"][i % 3],
            destinationId: `destination-${i + 1}`,
            destination: ["Paris", "Tokyo", "New York", "Barcelona", "Sydney"][i],
            upvotes: Math.floor(Math.random() * 100),
            downvotes: Math.floor(Math.random() * 20),
            commentCount: Math.floor(Math.random() * 30),
            viewCount: Math.floor(Math.random() * 1000) + 100,
          }))

        setDiscussions(mockDiscussions)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiscussions()
  }, [])

  return { discussions, isLoading, error }
}

export function useComments(threadId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock data
        const mockComments: Comment[] = Array(4)
          .fill(0)
          .map((_, i) => ({
            id: `comment-${i + 1}`,
            content: `This is comment ${i + 1} for thread ${threadId}. I really enjoyed reading about this destination!`,
            author: {
              id: `user-${i + 10}`,
              name: `Commenter ${i + 1}`,
              initials: `C${i + 1}`,
            },
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
            upvotes: Math.floor(Math.random() * 50),
            downvotes: Math.floor(Math.random() * 10),
            replies:
              i === 0
                ? [
                    {
                      id: `reply-${i + 1}`,
                      content: `This is a reply to comment ${i + 1}. Thanks for sharing your thoughts!`,
                      author: {
                        id: `user-${i + 20}`,
                        name: `Replier ${i + 1}`,
                        initials: `R${i + 1}`,
                      },
                      createdAt: new Date(Date.now() - Math.floor(Math.random() * 2000000000)).toISOString(),
                      upvotes: Math.floor(Math.random() * 20),
                      downvotes: Math.floor(Math.random() * 5),
                    },
                  ]
                : undefined,
          }))

        setComments(mockComments)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [threadId])

  return { comments, isLoading, error }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data
        const mockCategories: Category[] = [
          {
            id: "category-1",
            name: "City Guides",
            description: "Explore urban destinations around the world",
            threadCount: 42,
            postCount: 156,
          },
          {
            id: "category-2",
            name: "Adventure",
            description: "Hiking, trekking, and outdoor activities",
            threadCount: 28,
            postCount: 97,
          },
          {
            id: "category-3",
            name: "Food & Culture",
            description: "Culinary experiences and cultural insights",
            threadCount: 35,
            postCount: 124,
          },
          {
            id: "category-4",
            name: "Budget Travel",
            description: "Tips and tricks for traveling on a budget",
            threadCount: 19,
            postCount: 83,
          },
        ]

        setCategories(mockCategories)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, isLoading, error }
}

export function useDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 700))

        // Mock data
        const mockDestinations: Destination[] = [
          {
            id: "destination-1",
            name: "Paris",
            country: "France",
            description: "The City of Light featuring iconic landmarks like the Eiffel Tower and Louvre Museum",
            visitorCount: 15000000,
            bestTimeToVisit: "Spring (April-June)",
          },
          {
            id: "destination-2",
            name: "Tokyo",
            country: "Japan",
            description: "A bustling metropolis blending ultramodern and traditional elements",
            visitorCount: 12000000,
            bestTimeToVisit: "Spring (March-May) or Fall (Sept-Nov)",
          },
          {
            id: "destination-3",
            name: "New York",
            country: "United States",
            description: "The Big Apple with iconic skyscrapers, Broadway shows, and diverse neighborhoods",
            visitorCount: 13500000,
            bestTimeToVisit: "Spring (April-June) or Fall (Sept-Nov)",
          },
          {
            id: "destination-4",
            name: "Barcelona",
            country: "Spain",
            description: "Known for stunning architecture, Mediterranean beaches, and vibrant culture",
            visitorCount: 9000000,
            bestTimeToVisit: "May to June or September to October",
          },
          {
            id: "destination-5",
            name: "Sydney",
            country: "Australia",
            description: "Harbor city known for its Opera House, beaches, and laid-back lifestyle",
            visitorCount: 8500000,
            bestTimeToVisit: "September to November or March to May",
          },
        ]

        setDestinations(mockDestinations)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  return { destinations, isLoading, error }
}

