"use client"

import { useEffect, useState } from "react"
import axios from "axios"

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Simplified types
type Hotel = {
  id: number
  name: string
  location: string
  rating: number
}

type Room = {
  id: number
  type: string
  price: number
}

type Booking = {
  id: number
  guestName: string
  checkInDate: string
  checkOutDate: string
  email: string
  hotel: Hotel
  room: Room
}

export default function BookingsPage() {
  // States for search
  const [location, setLocation] = useState("")
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null)
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)

  // Form data
  const [guestName, setGuestName] = useState("")
  const [email, setEmail] = useState("")
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")

  // Booking management
  const [bookings, setBookings] = useState<Booking[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch all bookings on component mount
  useEffect(() => {
    fetchBookings()
  }, [])

  // Fetch available rooms when hotel is selected
  useEffect(() => {
    if (selectedHotelId) {
      getAvailableRooms(selectedHotelId)
    }
  }, [selectedHotelId])

  // API functions
  const fetchBookings = async () => {
    try {
      const response = await api.get("/api/bookings")
      setBookings(response.data)
      setError(null)
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Failed to load bookings. Please check if the backend server is running.")
      setBookings([])
    }
  }

  const searchHotels = async () => {
    if (!location) {
      setError("Please enter a location to search")
      return
    }

    try {
      const response = await api.get("/api/hotels/search", {
        params: { location },
      })
      setHotels(response.data)
      setError(null)
    } catch (err) {
      console.error("Search failed:", err)
      setError("Failed to search hotels")
      setHotels([])
    }
  }

  const getAvailableRooms = async (hotelId: number) => {
    try {
      const response = await api.get("/api/rooms/available", {
        params: { hotelId },
      })
      setAvailableRooms(response.data)
      setError(null)
    } catch (err) {
      console.error("Failed to get rooms:", err)
      setError("Failed to get available rooms")
      setAvailableRooms([])
    }
  }

  const handleCreateBooking = async () => {
    if (!guestName || !email || !selectedHotelId || !selectedRoomId || !checkInDate || !checkOutDate) {
      setError("Please fill in all required fields")
      return
    }

    const payload = {
      guestName,
      email,
      checkInDate,
      checkOutDate,
      hotel: { id: selectedHotelId },
      room: { id: selectedRoomId },
    }

    try {
      await api.post("/api/bookings", payload)
      clearForm()
      fetchBookings()
      setError(null)
    } catch (err) {
      console.error("Booking failed:", err)
      setError("Failed to create booking")
    }
  }

  const handleUpdateBooking = async () => {
    if (!editingId) return

    const payload = {
      guestName,
      email,
      checkInDate,
      checkOutDate,
      hotel: { id: selectedHotelId },
      room: { id: selectedRoomId },
    }

    try {
      await api.put(`/api/bookings/${editingId}`, payload)
      clearForm()
      fetchBookings()
      setError(null)
    } catch (err) {
      console.error("Update failed:", err)
      setError("Failed to update booking")
    }
  }

  const handleDeleteBooking = async (id: number) => {
    try {
      await api.delete(`/api/bookings/${id}`)
      fetchBookings()
      setError(null)
    } catch (err) {
      console.error("Delete failed:", err)
      setError("Failed to delete booking")
    }
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingId(booking.id)
    setGuestName(booking.guestName)
    setEmail(booking.email)
    setCheckInDate(booking.checkInDate)
    setCheckOutDate(booking.checkOutDate)
    setSelectedHotelId(booking.hotel.id)
    setSelectedRoomId(booking.room.id)
  }

  const clearForm = () => {
    setGuestName("")
    setEmail("")
    setCheckInDate("")
    setCheckOutDate("")
    setSelectedHotelId(null)
    setSelectedRoomId(null)
    setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg hotel-booking-container">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">Hotel Booking</h1>

        {/* Error display */}
        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

        {/* Search section */}
        <div className="mb-6 p-5 bg-BLACK-100 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-Black-900">Search for Hotels</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location..."
              className="flex-1 p-3 border border-BLACK-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <button
              onClick={searchHotels}
              className="bg-BLACK-600 hover:bg-BLACK-700 text-BLACK px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
            >
              🔍 Search
            </button>
          </div>

          {/* Hotels list */}
          {hotels.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2 text-indigo-800">Available Hotels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    onClick={() => setSelectedHotelId(hotel.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedHotelId === hotel.id
                        ? "bg-indigo-200 border-indigo-400 shadow-md"
                        : "bg-white border-gray-200 hover:bg-indigo-50 hover:border-indigo-300"
                    }`}
                  >
                    <p className="font-bold text-indigo-900">{hotel.name}</p>
                    <p className="text-gray-700">Location: {hotel.location}</p>
                    <p className="text-gray-700">Rating: {hotel.rating}⭐</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rooms list */}
          {availableRooms.length > 0 && (
            <div>
              <h3 className="font-medium mb-2 text-indigo-800">Available Rooms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedRoomId === room.id
                        ? "bg-indigo-200 border-indigo-400 shadow-md"
                        : "bg-white border-gray-200 hover:bg-indigo-50 hover:border-indigo-300"
                    }`}
                  >
                    <p className="font-bold text-indigo-900">{room.type}</p>
                    <p className="text-gray-700">Price: £{room.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking form */}
        <div className="mb-6 p-5 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
          <h2 className="text-xl font-semibold mb-3 text-blue-900">
            {editingId ? "Edit Booking" : "Create New Booking"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Guest Name</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter guest name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-black-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Check-in Date</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Check-out Date</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {editingId ? (
              <>
                <button
                  onClick={handleUpdateBooking}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                >
                  ✓ Update Booking
                </button>
                <button
                  onClick={clearForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleCreateBooking}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                ✓ Create Booking
              </button>
            )}
          </div>
        </div>

        {/* Existing bookings */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Your Bookings</h2>

          {bookings.length === 0 ? (
            <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-gray-200">No bookings found</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{booking.guestName}</p>
                      <p className="text-gray-600">{booking.email}</p>
                      <p className="text-gray-700 mt-2">
                        <span className="font-medium">Hotel:</span> {booking.hotel.name} ({booking.hotel.location})
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Room:</span> {booking.room.type} – £{booking.room.price}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Dates:</span> {booking.checkInDate} to {booking.checkOutDate}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className="text-yellow-600 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-lg transition-colors duration-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors duration-200"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

