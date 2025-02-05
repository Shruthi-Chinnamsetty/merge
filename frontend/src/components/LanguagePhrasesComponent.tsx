"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import type { Language, Category, Phrase } from "../types"
import { Globe2, BookOpen, Loader2 } from "lucide-react"

const API_BASE_URL = "http://localhost:8080/api/phrases"

const LanguagePhrasesComponent = () => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        const [languagesRes, categoriesRes] = await Promise.all([
          axios.get<Language[]>(`${API_BASE_URL}/languages`),
          axios.get<Category[]>(`${API_BASE_URL}/categories`),
        ])
        setLanguages(languagesRes.data)
        setCategories(categoriesRes.data)
      } catch (err) {
        setError("Failed to load initial data")
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  useEffect(() => {
    const fetchPhrases = async () => {
      if (!selectedLanguageId) {
        setPhrases([])
        return
      }

      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.append("languageId", selectedLanguageId)
        if (selectedCategoryId) {
          params.append("categoryId", selectedCategoryId)
        }

        const response = await axios.get<Phrase[]>(`${API_BASE_URL}/search?${params}`)
        setPhrases(response.data)
      } catch (err) {
        setError("Failed to fetch phrases")
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPhrases()
  }, [selectedLanguageId, selectedCategoryId])

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguageId(e.target.value)
    setSelectedCategoryId("")
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(e.target.value)
  }

  if (error) {
    return <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-4 text-center">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Globe2 className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">Language Phrase Finder</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label htmlFor="language" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Globe2 className="w-4 h-4" />
                Language:
              </label>
              <select
                id="language"
                value={selectedLanguageId}
                onChange={handleLanguageChange}
                disabled={loading}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm 
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         hover:border-blue-300 transition-colors text-gray-800"
              >
                <option value="">Select Language</option>
                {languages.map((language) => (
                  <option key={language.languageId} value={language.languageId}>
                    {language.languageName.charAt(0).toUpperCase() + language.languageName.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BookOpen className="w-4 h-4" />
                Category (Optional):
              </label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                disabled={!selectedLanguageId || loading}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm 
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         hover:border-blue-300 transition-colors text-gray-800
                                         disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8 text-blue-600">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading phrases...</span>
            </div>
          )}

          <div className="space-y-4">
            {phrases.map((phrase) => (
              <div
                key={phrase.phraseId}
                className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-6 
                                         border border-blue-200 hover:shadow-md transition-shadow"
              >
                <div className="text-xl text-gray-800 mb-3 font-medium">{phrase.phraseText}</div>
                <div className="text-gray-700 mb-2">{phrase.translation}</div>
                {phrase.category && (
                  <div
                    className="inline-block px-3 py-1 rounded-full text-sm 
                                                  bg-blue-100 text-blue-700 font-medium"
                  >
                    {phrase.category.categoryName}
                  </div>
                )}
              </div>
            ))}
            {!loading && phrases.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                {selectedLanguageId
                  ? "No phrases found for the selected filters"
                  : "Please select a language to see phrases"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanguagePhrasesComponent

