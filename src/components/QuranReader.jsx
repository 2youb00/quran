import { useState, useEffect, useRef } from "react"
import { useParams, useLocation } from "react-router-dom"
import axios from "axios"
import { Bookmark, BookmarkCheck, Play, Pause, ArrowLeft } from "lucide-react"
import { audioPlayer } from "../lib/audio-player"

export default function QuranReader() {
  const { surahNumber } = useParams()
  const [surah, setSurah] = useState(null)
  const [audioData, setAudioData] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [playingAyah, setPlayingAyah] = useState(null)
  const location = useLocation()
  const ayahRefs = useRef({})

  useEffect(() => {
    const fetchSurahData = async () => {
      try {
        const [surahResponse, audioResponse] = await Promise.all([
          axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar`),
          axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`),
        ])
        setSurah(surahResponse.data.data)
        setAudioData(audioResponse.data.data)
      } catch (error) {
        console.error("Error fetching surah:", error)
      }
    }

    fetchSurahData()
    const savedBookmarks = JSON.parse(localStorage.getItem("quranBookmarks")) || []
    setBookmarks(savedBookmarks)

    return () => {
      audioPlayer.stop()
    }
  }, [surahNumber])

  useEffect(() => {
    if (location.state?.scrollToAyah && surah) {
      const ayahElement = ayahRefs.current[location.state.scrollToAyah]
      if (ayahElement) {
        ayahElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [location.state, surah])

  const toggleBookmark = (ayah) => {
    const bookmarkIndex = bookmarks.findIndex((b) => b.surah === surah.number && b.ayah === ayah.numberInSurah)

    let newBookmarks
    if (bookmarkIndex > -1) {
      newBookmarks = bookmarks.filter((_, index) => index !== bookmarkIndex)
    } else {
      newBookmarks = [...bookmarks, { surah: surah.number, ayah: ayah.numberInSurah }]
    }

    setBookmarks(newBookmarks)
    localStorage.setItem("quranBookmarks", JSON.stringify(newBookmarks))
  }

  const isBookmarked = (ayah) => {
    return bookmarks.some((b) => b.surah === surah.number && b.ayah === ayah.numberInSurah)
  }

  const playAudio = (ayah) => {
    if (audioData) {
      const audioUrl = audioData.ayahs[ayah.numberInSurah - 1].audio
      if (playingAyah === ayah.numberInSurah) {
        audioPlayer.pause()
        setPlayingAyah(null)
      } else {
        audioPlayer.play(audioUrl, ayah.numberInSurah)
        setPlayingAyah(ayah.numberInSurah)
      }
    }
  }

  if (!surah)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8 rounded-2xl bg-emerald-500 p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => window.history.back()} className="hover:bg-emerald-600 p-2 rounded-full">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold">{surah.name}</h1>
          </div>
          <div className="text-center">
            <p className="text-lg opacity-90">{surah.englishName}</p>
            <p className="text-sm opacity-75">
              {surah.revelationType} · {surah.numberOfAyahs} Verses
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {surah.ayahs.map((ayah) => (
            <div
              key={ayah.number}
              ref={(el) => (ayahRefs.current[ayah.numberInSurah] = el)}
              className="group relative rounded-2xl bg-white/80 backdrop-blur-md p-6 transition-all hover:shadow-lg dark:bg-gray-800/50"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-sm font-semibold dark:bg-emerald-900 dark:text-emerald-400">
                    {ayah.numberInSurah}
                  </span>
                  <button
                    onClick={() => playAudio(ayah)}
                    className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900"
                  >
                    {playingAyah === ayah.numberInSurah ? (
                      <Pause className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Play className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleBookmark(ayah)}
                    className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900"
                  >
                    {isBookmarked(ayah) ? (
                      <BookmarkCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-right font-arabic text-2xl leading-loose mb-4 dark:text-white">{ayah.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

