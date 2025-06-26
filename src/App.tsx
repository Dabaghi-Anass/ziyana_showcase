import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { CaftansPage } from './pages/caftans';
import { HomePage } from './pages/home';

function App() {
  return (
    <>
      <Router>
        <nav className='nav-bar'>
          <ul>
            <Link to='/'>Acceuil</Link>
            <Link to='/caftans'>Caftans</Link>
            <Link to='/contact'>Contact</Link>
          </ul>
        </nav>
        <main className="container">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/caftans' element={<CaftansPage />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
