import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <nav style={{ display: 'flex', gap: '10px' }}>
          <Link to='/'>Home</Link>
          <Link to='/about'>About</Link>
          <Link to='/contact'>Contact</Link>
        </nav>

        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
    </div>
  );
}
