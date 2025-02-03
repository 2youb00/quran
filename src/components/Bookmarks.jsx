import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Trash2 } from "lucide-react"

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [bookmarkDetails, setBookmarkDetails] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("quranBookmarks")) || []
    setBookmarks(savedBookmarks)
    fetchBookmarkDetails(savedBookmarks)
  }, [])

  const fetchBookmarkDetails = async (bookmarks) => {
    const details = {}
    for (const bookmark of bookmarks) {
      try {
        const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${bookmark.surah}:${bookmark.ayah}/ar`)
        details[`${bookmark.surah}:${bookmark.ayah}`] = response.data.data
      } catch (error) {
        console.error("Error fetching ayah details:", error)
      }
    }
    setBookmarkDetails(details)
  }

  const removeBookmark = (surah, ayah) => {
    const updatedBookmarks = bookmarks.filter((b) => !(b.surah === surah && b.ayah === ayah))
    setBookmarks(updatedBookmarks)
    localStorage.setItem("quranBookmarks", JSON.stringify(updatedBookmarks))
  }

  const navigateToSurah = (surah, ayah) => {
    navigate(`/surah/${surah}`, { state: { scrollToAyah: ayah } })
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-right">الإشارات المرجعية</h2>
      {bookmarks.length === 0 ? (
        <p className="text-right">لا توجد إشارات مرجعية حتى الآن.</p>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((bookmark, index) => {
            const ayahDetails = bookmarkDetails[`${bookmark.surah}:${bookmark.ayah}`]
            return (
              <li key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <button
                    onClick={() => removeBookmark(bookmark.surah, bookmark.ayah)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div
                    className="text-right cursor-pointer"
                    onClick={() => navigateToSurah(bookmark.surah, bookmark.ayah)}
                  >
                    <p className="font-arabic text-xl mb-2">{ayahDetails?.text}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      سورة: {ayahDetails?.surah.name}, آية: {ayahDetails?.numberInSurah}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

