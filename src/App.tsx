import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { CaftansPage } from './pages/caftans';
import { HomePage } from './pages/home';
import { NavBar } from './components/nav-bar';
import { ShowRoom } from './pages/showroom';
import { StoryPage } from './pages/story';

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <main className='container'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/story' element={<StoryPage />} />
            <Route path='/showroom' element={<ShowRoom />}>
              <Route path='caftans' element={<CaftansPage />} />
            </Route>
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
