import { HashRouter as Router, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import SurahList from "./components/SurahList"
import QuranReader from "./components/QuranReader"
import Search from "./components/Search"
import Bookmarks from "./components/Bookmarks"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<SurahList />} />
          <Route path="/surah/:surahNumber" element={<QuranReader />} />
          <Route path="/search" element={<Search />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

