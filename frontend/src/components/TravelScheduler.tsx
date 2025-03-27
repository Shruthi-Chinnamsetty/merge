"use client"

// Styling imports from the CSS files in the app directory
import "../app/react-big-calendar.css" 
import "../app/calendar.css"
import "../app/calendar-modal.css"

// These are the react hooks
import { useState, useEffect, useCallback } from "react"

// These are the utilities for the calendar library and date
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar"
import { format, parse, startOfWeek, getDay, addDays } from "date-fns"

// These are the icons imported from lucide react
import { MapPin, Plus, Calendar as CalendarIcon, Plane, Train, Bus, Car, Trash2, Edit, X } from "lucide-react"

// These are the type definitions
import type { Schedule } from "../types/index"

// These are UI components from shadcn/ui
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

// This is the HTTP client for the API calls using axios
import axios from 'axios';

// Add these imports at the top of your file
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../scheduleService';

// This is the date localiser for the calendar
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": require("date-fns/locale/en-US") },
})

// Constants

// These are travel mode options with the matching icons
const TRAVEL_MODES = [
  { value: "Car", label: "Car", icon: <Car className="mr-2 h-4 w-4" /> },
  { value: "Train", label: "Train", icon: <Train className="mr-2 h-4 w-4" /> },
  { value: "Plane", label: "Plane", icon: <Plane className="mr-2 h-4 w-4" /> },
  { value: "Bus", label: "Bus", icon: <Bus className="mr-2 h-4 w-4" /> },
]

// These are category options with their styling classes
const CATEGORIES = [
  { value: "Business", label: "Business", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { value: "Leisure", label: "Leisure", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "Education", label: "Education", color: "bg-green-100 text-green-800 border-green-300" },
  { value: "Other", label: "Other", color: "bg-gray-100 text-gray-800 border-gray-300" },
]

// This is the initial form state
const INITIAL_FORM_STATE: Partial<Schedule> = {
  destinationName: "",
  distance: 0,
  category: "Leisure",
  startDate: new Date(),
  endDate: addDays(new Date(), 1),
  travelMode: "Car",
  status: "Planned",
}

// This is the API endpoint
const API_URL = "http://localhost:8080/api/schedules"

// These are the helper functions
const getCategoryColor = (categoryValue: string) => 
  CATEGORIES.find(c => c.value === categoryValue)?.color || CATEGORIES[3].color

// This function returns the correct icon, according to the travel mode selected
const getTravelModeIcon = (mode: string) => {
  switch(mode) {
    case "Car": return <Car className="h-4 w-4" />
    case "Train": return <Train className="h-4 w-4" />
    case "Plane": return <Plane className="h-4 w-4" />
    case "Bus": return <Bus className="h-4 w-4" />
    default: return <Car className="h-4 w-4" />
  }
}

const formatDate = (date: string | Date) => format(new Date(date), 'MMM dd, yyyy')

// This function calculates the trip duration in days
const getDuration = (start: string | Date, end: string | Date) => {
  const diffDays = Math.ceil(
    Math.abs(new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
  )
  return diffDays === 1 ? "1 day" : `${diffDays} days`
}

interface CustomToolbarProps {
  onNavigate: (action: string) => void;
  label: string;
  views: string[];
  view: string;
  onView: (view: string) => void;
}

function CustomToolbar(props: CustomToolbarProps) {
  const navigate = (action: string) => {
    props.onNavigate(action);
  };
  
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => navigate('TODAY')}>Today</button>
        <button type="button" onClick={() => navigate('PREV')}>Back</button>
        <button type="button" onClick={() => navigate('NEXT')}>Next</button>
      </span>
      <span className="rbc-toolbar-label">{props.label}</span>
      <span className="rbc-btn-group">
        {props.views.map(view => (
          <button 
            key={view}
            type="button" 
            className={view === props.view ? 'rbc-active' : ''} 
            onClick={() => props.onView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </span>
    </div>
  );
}

type CalendarView = "month" | "week" | "day";

export default function Scheduler() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [formData, setFormData] = useState<Partial<Schedule>>(INITIAL_FORM_STATE)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [viewType, setViewType] = useState<CalendarView>("month")
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date());

  // Add this function before the fetchSchedules function
  const fetchSchedulesDirectly = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No authorization token found");
      }
      
      console.log("Using direct fetch with token:", token.substring(0, 20) + "...");
      
      // Try with native fetch instead of axios
      const response = await fetch("http://localhost:8080/api/schedules", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Data received:", data);
      setSchedules(data);
      
    } catch (error) {
      console.error("Error in direct fetch:", error);
      setErrorMessage(error.message || "Failed to fetch schedules");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAuthAndRedirect = () => {
    // Don't remove token from localStorage
    //localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Update error handling in fetchSchedules to use this
  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getSchedules();
      setSchedules(data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setErrorMessage(error.message || "Failed to fetch schedules. Please try again.");
      
      // If it's an authentication error, reset and redirect
      if (error.message && error.message.includes("login")) {
        setTimeout(() => {
          resetAuthAndRedirect();
        }, 3000); // Give user 3 seconds to read the error message
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        // First try the service method
        await fetchSchedules();
      } catch (error) {
        console.log("Service method failed, trying direct fetch");
        // If it fails, try the direct fetch method
        await fetchSchedulesDirectly();
      }
    };
    
    loadSchedules();
  }, [fetchSchedules]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token ? token.substring(0, 15) + "..." : "no token");
  }, []);

  // Add this useEffect to verify token when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage("No authentication token found. Please login to continue.");
    }
  }, []);

  // Add this at the beginning of your component
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found in localStorage");
        return false;
      }
      
      // Try to access the destinations endpoint which we know works
      const response = await fetch("http://localhost:8080/api/destinations", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        console.log("Token is valid for destinations API");
        return true;
      } else {
        console.error("Token validation failed:", response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  // Add this useEffect to verify token on mount
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      console.log("Token from localStorage:", token ? `${token.substring(0, 20)}...` : "no token");
      
      if (!token) {
        setErrorMessage("No authentication token found. Please login to continue.");
        return;
      }
      
      const isValid = await verifyToken();
      if (!isValid) {
        setErrorMessage("Your session appears to be invalid. Please login again.");
      }
    };
    
    checkToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, formData);
        setSuccessMessage("Your trip has been successfully updated!");
      } else {
        await createSchedule(formData);
        setSuccessMessage("Your trip has been successfully created!");
      }
      
      await fetchSchedules();
      
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage(null);
        resetForm();
      }, 2000);
      
    } catch (error) {
      setErrorMessage(error.message || "Failed to save schedule");
      console.error("Error saving schedule:", error);
    }
  };

  const handleDelete = async (id: number) => {
    setErrorMessage(null);
    try {
      await deleteSchedule(id);
      await fetchSchedules();
      setSelectedSchedule(null);
      setIsDetailsOpen(false);
    } catch (error) {
      console.error("Error deleting schedule:", error);
      setErrorMessage(error.message || "Failed to delete schedule. Please try again.");
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setFormData({
      ...schedule,
      startDate: new Date(schedule.startDate),
      endDate: new Date(schedule.endDate),
    })
    setIsModalOpen(true)
    setIsDetailsOpen(false)
  }

  const resetForm = () => {
    setEditingSchedule(null)
    setFormData(INITIAL_FORM_STATE)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(resetForm, 300)
  }

  const openDetails = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setIsDetailsOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50">
          <div className="flex">
            <div className="py-1">
              <svg className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">{errorMessage}</p>
              {errorMessage.includes("login") && (
                <button 
                  onClick={() => { 
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-xs"
                >
                  Login Again
                </button>
              )}
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="ml-auto"
              aria-label="Close error message"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Travel Scheduler
            </h1>
            <p className="text-muted-foreground mt-1">
              Plan and manage your trips with ease
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={viewType} onValueChange={setViewType} className="hidden md:block">
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
            </Tabs>

            <Dialog open={isModalOpen} onOpenChange={closeModal}>
              <Button 
                size="lg" 
                className="shadow-md hover:shadow-lg transition-all"
                onClick={() => {
                  setIsModalOpen(true);
                  resetForm();
                }}
              >
                <Plus className="mr-2 h-4 w-5" />
                Add New Trip
              </Button>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-2xl font-semibold">
                    {editingSchedule ? "Edit Trip" : "New Trip"}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {editingSchedule 
                      ? "Update the details of your travel plan." 
                      : "Add the details of your upcoming trip."}
                  </DialogDescription>
                </DialogHeader>

                {successMessage && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded my-4">
                    <div className="flex">
                      <div className="py-1">
                        <svg className="h-6 w-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Success</p>
                        <p className="text-sm">{successMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Destination Input */}
                    <div className="space-y-2">
                      <Label htmlFor="destinationName" className="text-sm font-medium">
                        Destination
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="destinationName"
                          type="text"
                          placeholder="Enter destination"
                          className="pl-9"
                          value={formData.destinationName || ""}
                          onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    

                    {/* Distance Input */}
                    <div className="space-y-2">
                      <Label htmlFor="distance" className="text-sm font-medium">
                        Distance (km)
                      </Label>
                      <Input
                        id="distance"
                        type="number"
                        placeholder="Enter distance"
                        min="0"
                        value={formData.distance || ""}
                        onChange={(e) => setFormData({ ...formData, distance: Number(e.target.value) })}
                        required
                      />
                    </div>

                    {/* Date Section */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-sm font-medium">
                          Start Date
                        </Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={formData.startDate ? format(new Date(formData.startDate), "yyyy-MM-dd'T'HH:mm") : ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            startDate: new Date(e.target.value) 
                          })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-sm font-medium">
                          End Date
                        </Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={formData.endDate ? format(new Date(formData.endDate), "yyyy-MM-dd'T'HH:mm") : ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            endDate: new Date(e.target.value) 
                          })}
                          min={formData.startDate ? format(new Date(formData.startDate), "yyyy-MM-dd'T'HH:mm") : ''}
                          required
                        />
                      </div>

                      {formData.startDate && formData.endDate && (
                        <div className="text-sm text-muted-foreground">
                          Duration: {getDuration(formData.startDate, formData.endDate)}
                        </div>
                      )}
                    </div>

                    {/* Category and Travel Mode */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value as Schedule["category"] })}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                <Badge variant="secondary" className={category.color}>
                                  {category.label}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Travel Mode</Label>
                        <Select
                          value={formData.travelMode}
                          onValueChange={(value) =>
                            setFormData({ ...formData, travelMode: value as Schedule["travelMode"] })
                          }
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select travel mode" />
                          </SelectTrigger>
                          <SelectContent>
                            {TRAVEL_MODES.map((mode) => (
                              <SelectItem key={mode.value} value={mode.value}>
                                <div className="flex items-center">
                                  {mode.icon}
                                  {mode.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="flex justify-end gap-2 pt-4 border-t">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="px-8">
                      {editingSchedule ? 'Update Trip' : 'Create Trip'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <Card className="col-span-1 lg:col-span-2 shadow-lg border-t-4 border-t-primary rounded-tl-md rounded-tr-md">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Trip Calendar</CardTitle>
                
                <div className="flex items-center">
                  <Select
                    value={viewType}
                    onValueChange={setViewType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem> 
                    </SelectContent>
                  </Select>
                </div>
              </div>

                        
              <CardDescription>
                View and manage your upcoming travel plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-[600px]">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <Calendar
                  localizer={localizer}
                  events={schedules.map((schedule) => ({
                    title: schedule.destinationName,
                    start: new Date(schedule.startDate),
                    end: new Date(schedule.endDate),
                    resource: schedule,
                  }))}
                  style={{ minHeight: 600 }}
                  views={{
                    month: true,
                    week: true,
                    day: true,
                  }}
                  view={viewType}
                  onView={(view) => setViewType(view as CalendarView)}
                  popup
                  selectable
                  onSelectEvent={(event) => openDetails(event.resource)}
                  onNavigate={(date) => setCurrentDate(date)}
                  date={currentDate}
                  onSelectSlot={(slotInfo) => {
                    setFormData({
                      ...INITIAL_FORM_STATE,
                      startDate: slotInfo.start,
                      endDate: slotInfo.end
                    });
                    setIsModalOpen(true);
                  }}
                  components={{
                    event: (props) => {
                      const category = CATEGORIES.find((c) => c.value === props.event.resource.category);
                      // Extract color values from category classes
                      const borderColorClass = category?.color.replace('bg-', 'border-').replace('100', '400');
                      // Extract background color for dots - make it match category color exactly 
                      const bgColorClass = category?.color.split(' ')[0];
                      
                      // Determine if this is an event segment that continues from previous/to next rows
                      const isFirstSegment = !props.continuesPrior;
                      const isLastSegment = !props.continuesAfter;
                      
                      return (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="relative w-full h-full">
                                {/* Line connecting dots */}
                                <div 
                                  className={`absolute top-1/2 left-0 right-0`}
                                  style={{ 
                                    transform: 'translateY(-50%)', 
                                    height: '1px', 
                                    backgroundColor: 'rgba(0,0,0,0)' 
                                  }}
                                ></div>
                                
                                {/* Start date dot */}
                                {isFirstSegment && (
                                  <div 
                                    className={`absolute left-0 top-1/2 w-3 h-3 rounded-full ${bgColorClass} border ${borderColorClass ? borderColorClass : 'border-gray-400'}`}
                                    style={{ transform: 'translate(-1.5px, -50%)', zIndex: 10 }}
                                  ></div>
                                )}
                                
                                {/* End date dot */}
                                {isLastSegment && (
                                  <div 
                                    className={`absolute right-0 top-1/2 w-3 h-3 rounded-full ${bgColorClass} border ${borderColorClass ? borderColorClass : 'border-gray-400'}`}
                                    style={{ transform: 'translate(1.5px, -50%)', zIndex: 10 }}
                                  ></div>
                                )}
                                
                                {/* Hidden - just for tooltip */}
                                <div className="opacity-0 w-full h-full">
                                  {props.title}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <p className="font-semibold">{props.title}</p>
                                <p>{formatDate(props.event.start)} to {formatDate(props.event.end)}</p>
                                <p>{getDuration(props.event.start, props.event.end)} | {props.event.resource.distance} km</p>
                                <div className="flex items-center gap-1 mt-1">
                                  {getTravelModeIcon(props.event.resource.travelMode)}
                                  <span>{props.event.resource.travelMode}</span>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>

          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="sm:max-w-[400px]">
              {selectedSchedule && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <span>{selectedSchedule.destinationName}</span>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEdit(selectedSchedule)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Trip</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Trip</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete your trip to {selectedSchedule.destinationName}? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(selectedSchedule.id!)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <DialogClose asChild>
                          <Button variant="ghost" size="icon">
                            <X className="h-4 w-4" />
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <Badge className={getCategoryColor(selectedSchedule.category)}>
                      {selectedSchedule.category}
                    </Badge>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Dates</h4>
                        <p>{formatDate(selectedSchedule.startDate)} - {formatDate(selectedSchedule.endDate)}</p>
                        <p className="text-sm text-muted-foreground">{getDuration(selectedSchedule.startDate, selectedSchedule.endDate)}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Travel Mode</h4>
                        <p className="flex items-center gap-2">
                          {getTravelModeIcon(selectedSchedule.travelMode)}
                          {selectedSchedule.travelMode}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Distance</h4>
                      <p>{selectedSchedule.distance} km</p>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          <Card className="hidden xl:block shadow-lg">
            <CardHeader>
              <CardTitle>Upcoming Trips</CardTitle>
              <CardDescription>Your travel plans for the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedules
                    .filter(schedule => new Date(schedule.startDate) >= new Date())
                    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                    .slice(0, 5)
                    .map(schedule => (
                      <div 
                        key={schedule.id} 
                        className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => openDetails(schedule)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{schedule.destinationName}</h3>
                          <Badge className={getCategoryColor(schedule.category)}>
                            {schedule.category}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {formatDate(schedule.startDate)} ({getDuration(schedule.startDate, schedule.endDate)})
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                          {getTravelModeIcon(schedule.travelMode)}
                          {schedule.travelMode} · {schedule.distance} km
                        </div>
                      </div>
                    ))}
                  
                  {schedules.filter(schedule => new Date(schedule.startDate) >= new Date()).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No upcoming trips</p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setIsModalOpen(true);
                          resetForm();
                        }}
                      >
                        Add your first trip
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hidden xl:block shadow-lg">
            <CardHeader>
              <CardTitle>Previous Trips</CardTitle>
              <CardDescription>Your completed travel history</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedules
                    .filter(schedule => new Date(schedule.endDate) < new Date())
                    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()) // Most recent first
                    .slice(0, 5)
                    .map(schedule => (
                      <div 
                        key={schedule.id} 
                        className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => openDetails(schedule)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{schedule.destinationName}</h3>
                          <Badge className={getCategoryColor(schedule.category)}>
                            {schedule.category}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {formatDate(schedule.startDate)} ({getDuration(schedule.startDate, schedule.endDate)})
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                          {getTravelModeIcon(schedule.travelMode)}
                          {schedule.travelMode} · {schedule.distance} km
                        </div>
                      </div>
                    ))}
                  
                  {schedules.filter(schedule => new Date(schedule.endDate) < new Date()).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No previous trips</p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setIsModalOpen(true);
                          resetForm();
                        }}
                      >
                        Add your first trip
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}