import './App.module.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Main from './components/Main/Main'
import QuestionPage from './components/QuestionPage/QuestionPage'

function App() {

  return (
    <BrowserRouter>
      <Header />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='questions/:id' element={<QuestionPage />} />
        </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
