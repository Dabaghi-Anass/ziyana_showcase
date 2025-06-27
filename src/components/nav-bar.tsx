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
          <Link to='/showroom'>غرفة العرض</Link>
        </li>
      </ul>
      <AppLogo />
      <Link to='/add-caftan' className='btn'>
        ارفع تصميمك
      </Link>
    </nav>
  );
}
