import type { Category, Thread, Destination, DestinationInfo } from "../types/forum"

// This would be replaced with actual API calls in a real application
// For now, we'll just simulate API responses

export async function getDestinationCategories(): Promise<Category[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock data
  return [
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
}

export async function getTrendingDestinations(): Promise<Destination[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Mock data
  return [
    {
      id: "destination-1",
      name: "Kyoto",
      country: "Japan",
      description: "Ancient temples, traditional gardens, and geisha districts",
      trendingScore: 95,
      visitorCount: 8000000,
      bestTimeToVisit: "Spring or Fall",
    },
    {
      id: "destination-2",
      name: "Santorini",
      country: "Greece",
      description: "Stunning white buildings with blue domes overlooking the sea",
      trendingScore: 87,
      visitorCount: 2000000,
      bestTimeToVisit: "May to October",
    },
    {
      id: "destination-3",
      name: "Bali",
      country: "Indonesia",
      description: "Tropical paradise with beaches, rice terraces, and temples",
      trendingScore: 82,
      visitorCount: 6500000,
      bestTimeToVisit: "April to October",
    },
    {
      id: "destination-4",
      name: "Marrakech",
      country: "Morocco",
      description: "Vibrant markets, palaces, and gardens in North Africa",
      trendingScore: 78,
      visitorCount: 3000000,
      bestTimeToVisit: "March to May or September to November",
    },
  ]
}

export async function getActiveDiscussions(): Promise<Thread[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Mock data
  return Array(5)
    .fill(0)
    .map((_, i) => ({
      id: `active-thread-${i + 1}`,
      title: `${["Best time to visit", "Hidden gems in", "Food recommendations for", "Safety tips for", "Transportation in"][i]} ${["Iceland", "Thailand", "Peru", "Portugal", "Vietnam"][i]}`,
      content: "",
      excerpt: "",
      author: {
        id: `user-${i + 5}`,
        name: `Active User ${i + 1}`,
        initials: `A${i + 1}`,
      },
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 2000000000)).toISOString(),
      categoryId: `category-${(i % 4) + 1}`,
      category: ["City Guides", "Adventure", "Food & Culture", "Budget Travel"][i % 4],
      destinationId: `destination-${i + 6}`,
      destination: ["Iceland", "Thailand", "Peru", "Portugal", "Vietnam"][i],
      upvotes: Math.floor(Math.random() * 100) + 50,
      downvotes: Math.floor(Math.random() * 10),
      commentCount: Math.floor(Math.random() * 50) + 20,
      viewCount: Math.floor(Math.random() * 2000) + 500,
    }))
}

export async function getThreadById(id: string): Promise<Thread | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 900))

  // Mock data
  return {
    id,
    title: "My unforgettable experience in Kyoto during cherry blossom season",
    content: `
      <p>I recently had the opportunity to visit Kyoto during cherry blossom season, and it was truly a magical experience that I'll never forget.</p>
      
      <h2>Best Viewing Spots</h2>
      <p>The Philosopher's Path was absolutely stunning with cherry trees lining the canal. I'd recommend going early in the morning to avoid the crowds.</p>
      
      <p>Maruyama Park was another highlight, especially in the evening when the trees are illuminated. The atmosphere was festive with food stalls and locals celebrating hanami (cherry blossom viewing).</p>
      
      <h2>Travel Tips</h2>
      <ul>
        <li>Book accommodations at least 6 months in advance if you're planning to visit during peak season</li>
        <li>Get a bus pass for easy transportation around the city</li>
        <li>Consider visiting some temples early in the morning before the tourist crowds arrive</li>
      </ul>
      
      <p>Has anyone else visited Kyoto during cherry blossom season? I'd love to hear about your experiences!</p>
    `,
    excerpt:
      "I recently had the opportunity to visit Kyoto during cherry blossom season, and it was truly a magical experience that I'll never forget.",
    author: {
      id: "user-123",
      name: "Sakura Traveler",
      initials: "ST",
      avatar: "/placeholder.svg?height=40&width=40",
      tripCount: 12,
      postCount: 34,
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    categoryId: "category-3",
    category: "Food & Culture",
    destinationId: "destination-kyoto",
    destination: "Kyoto, Japan",
    upvotes: 128,
    downvotes: 3,
    commentCount: 24,
    viewCount: 1542,
  }
}

export async function getDestinationInfo(id: string): Promise<DestinationInfo> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data
  return {
    id,
    name: "Kyoto",
    country: "Japan",
    description:
      "Kyoto, once the capital of Japan, is a city on the island of Honshu. It's famous for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
    imageUrl: "/placeholder.svg?height=180&width=320",
    visitorCount: 8000000,
    bestTimeToVisit: "Spring (March-April) or Fall (Nov)",
    latitude: 35.0116,
    longitude: 135.7681,
  }
}

export async function getRelatedThreads(destinationId: string): Promise<Thread[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Mock data
  return Array(4)
    .fill(0)
    .map((_, i) => ({
      id: `related-thread-${i + 1}`,
      title: `${["Best temples to visit in", "Food guide for", "Transportation tips for", "Hidden gems in"][i]} Kyoto`,
      content: "",
      excerpt: "",
      author: {
        id: `user-${i + 30}`,
        name: `Japan Expert ${i + 1}`,
        initials: `J${i + 1}`,
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30000000000)).toISOString(),
      categoryId: `category-${(i % 4) + 1}`,
      category: ["City Guides", "Adventure", "Food & Culture", "Budget Travel"][i % 4],
      destinationId,
      destination: "Kyoto, Japan",
      upvotes: Math.floor(Math.random() * 50) + 10,
      downvotes: Math.floor(Math.random() * 5),
      commentCount: Math.floor(Math.random() * 20) + 5,
      viewCount: Math.floor(Math.random() * 1000) + 200,
    }))
}

