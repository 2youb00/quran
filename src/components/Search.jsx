import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Bookmark, BookmarkCheck } from "lucide-react"

export default function Search() {
  const [query, setQuery] = useState("")
  const [searchType, setSearchType] = useState("keyword")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [displayedResults, setDisplayedResults] = useState(4)
  const navigate = useNavigate()

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("quranBookmarks")) || []
    setBookmarks(savedBookmarks)
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResults([])
    setDisplayedResults(4)
    try {
      let response
      if (searchType === "keyword") {
        response = await axios.get(`https://api.alquran.cloud/v1/search/${query}/all/ar`)
        setResults(response.data.data.matches)
      } else if (searchType === "surah") {
        response = await axios.get(`https://api.alquran.cloud/v1/surah/${query}`)
        if (response.data.data) {
          setResults([response.data.data])
        } else {
          setError("لم يتم العثور على السورة")
        }
      }
    } catch (error) {
      setError("حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.")
      console.error("Error searching:", error)
    }
    setLoading(false)
  }

  const toggleBookmark = (ayah) => {
    const bookmarkIndex = bookmarks.findIndex((b) => b.surah === ayah.surah.number && b.ayah === ayah.numberInSurah)

    let newBookmarks
    if (bookmarkIndex > -1) {
      newBookmarks = bookmarks.filter((_, index) => index !== bookmarkIndex)
    } else {
      newBookmarks = [...bookmarks, { surah: ayah.surah.number, ayah: ayah.numberInSurah }]
    }

    setBookmarks(newBookmarks)
    localStorage.setItem("quranBookmarks", JSON.stringify(newBookmarks))
  }

  const isBookmarked = (ayah) => {
    return bookmarks.some((b) => b.surah === ayah.surah.number && b.ayah === ayah.numberInSurah)
  }

  const navigateToSurah = (surah, ayah) => {
    navigate(`/surah/${surah}`, { state: { scrollToAyah: ayah } })
  }

  const showMore = () => {
    setDisplayedResults((prev) => prev + 4)
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-right">ابحث في القرآن</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex space-x-2">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="keyword">كلمة</option>
            <option value="surah">سورة</option>
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchType === "keyword" ? "أدخل كلمة للبحث" : "أدخل اسم السورة"}
            className="w-2/3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-right"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-green-300"
        >
          {loading ? "جاري البحث..." : "بحث"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4 text-right">{error}</p>}
      <div className="mt-8 space-y-4">
        {results.slice(0, displayedResults).map((result, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-right">
              <div className="flex justify-between items-center mb-2">
                <button onClick={() => toggleBookmark(result)} className="text-green-500 hover:text-green-600">
                  {isBookmarked(result) ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
                </button>
                <p
                  className="font-arabic text-2xl cursor-pointer"
                  onClick={() => navigateToSurah(result.surah.number, result.numberInSurah)}
                >
                  {result.text}
                </p>
              </div>
              <p>
                سورة: {result.surah.name} - آية: {result.numberInSurah}
              </p>
            </div>
          </div>
        ))}
        {results.length > displayedResults && (
          <button onClick={showMore} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4">
            عرض المزيد
          </button>
        )}
      </div>
    </div>
  )
}

