import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 48, className }) => (
  <div className='app-logo'>
    <span>Ziyana</span>
    Show Room
  </div>
);

export default AppLogo;
