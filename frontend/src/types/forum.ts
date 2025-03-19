export interface Author {
  id: string
  name: string
  avatar?: string
  initials: string
  tripCount?: number
  postCount?: number
}

export interface Comment {
  id: string
  content: string
  author: Author
  createdAt: string
  upvotes: number
  downvotes: number
  replies?: Comment[]
}

export interface Thread {
  id: string
  title: string
  content: string
  excerpt: string
  author: Author
  createdAt: string
  categoryId: string
  category: string
  destinationId: string
  destination: string
  upvotes: number
  downvotes: number
  commentCount: number
  viewCount: number
}

export interface Category {
  id: string
  name: string
  description: string
  threadCount: number
  postCount: number
}

export interface Destination {
  id: string
  name: string
  country: string
  description: string
  imageUrl?: string
  visitorCount: number
  bestTimeToVisit: string
  trendingScore?: number
}

export interface DestinationInfo extends Destination {
  latitude: number
  longitude: number
}

