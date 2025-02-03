import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Search, Book } from "lucide-react"
import { normalizeArabicText } from "../utils/arabic"

export default function SurahList() {
  const [surahs, setSurahs] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await axios.get("http://api.alquran.cloud/v1/surah")
        setSurahs(response.data.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching surahs:", error)
        setLoading(false)
      }
    }

    fetchSurahs()
  }, [])

  const filteredSurahs = surahs.filter(
    (surah) =>
      normalizeArabicText(surah.name).includes(normalizeArabicText(searchQuery)) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث عن سورة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pr-12 rounded-2xl bg-white/80 backdrop-blur-md border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800/50 dark:border-gray-700"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.number}
              to={`/surah/${surah.number}`}
              className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-emerald-100 p-4 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-gray-800/50 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                    <Book className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{surah.englishName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {surah.revelationType} - {surah.numberOfAyahs} Verses
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-arabic text-emerald-600 dark:text-emerald-400">{surah.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

