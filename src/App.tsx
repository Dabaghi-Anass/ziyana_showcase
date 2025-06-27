import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { NavBar } from './components/nav-bar';
import { AddCaftan } from './pages/add-caftan';
import { CaftansPage } from './pages/caftans';
import { HomePage } from './pages/home';
import { ShowRoom } from './pages/showroom';
import { StoryPage } from './pages/story';
import VoiceCaftanGenerator from './pages/caftans_generator';
// import { FloatingChatbot } from './components/chat-bot';

function App() {
  return (
    <>
      <Router>
        <NavBar />
        {/* <FloatingChatbot /> */}
        <main className='container'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/story' element={<StoryPage />} />
            <Route path='/caftans' element={<CaftansPage />} />
            <Route path='/showroom' element={<ShowRoom />}></Route>
            <Route path='/add-caftan' element={<AddCaftan />} />
            <Route path='/customize' element={<VoiceCaftanGenerator />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
