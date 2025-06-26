import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { CaftansPage } from './pages/caftans';
import { HomePage } from './pages/home';
import { NavBar } from './components/nav-bar';

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <main className='container'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/showroom' element={<CaftansPage />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
