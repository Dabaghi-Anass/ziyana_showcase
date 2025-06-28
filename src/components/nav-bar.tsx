import { Link, useLocation } from 'react-router-dom';
import './navbar.css';
import AppLogo from './app-logo';

export function NavBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className='nav-bar'>
      <ul className='nav-links'>
        <li className={isActive('/') ? 'active' : ''}>
          <Link to='/'>الرئيسية</Link>
        </li>
        <li className={isActive('/story') ? 'active' : ''}>
          <Link to='/story'>قصة القفطان</Link>
        </li>
        <li className={isActive('/showroom') ? 'active' : ''}>
          <Link to='/showroom'>متحف القفاطن</Link>
        </li>
        <li className={isActive('/caftans') ? 'active' : ''}>
          <Link to='/caftans'>القفاطن</Link>
        </li>
        <li className={isActive('/customize') ? 'active' : ''}>
          <Link to='/customize'>قفطان على ذوقي</Link>
        </li>
      </ul>
      <img src='/logo.png' className='nav-logo' />
      <Link to='/add-caftan' className='btn'>
        ارفع تصميمك
      </Link>
    </nav>
  );
}
