import { useState } from 'react';
import './Profile.css';
import Sidebar from '../../UI/Sidebar/Sidebar';
import General from './Options/General';
import Vehicles from './Options/Vehicles/Vehicles';
import History from './Options/History';
import Settings from './Options/Settings';

const Profile = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('Загальне');
  const options = [
    { name: 'Загальне', icon: 'bx-user', page: <General /> },
    { name: 'Мої транспорти', icon: 'bx-car', page: <Vehicles /> },
    { name: 'Історія послуг', icon: 'bx-history', page: <History /> },
    { name: 'Налаштування', icon: 'bx-cog', page: <Settings /> },
  ];

  return (
    <div className="profile-container">
      <Sidebar options={options} active={activeSidebarItem} setActive={setActiveSidebarItem} />
      <div className="profile-content">
        { options.find((option) => option.name === activeSidebarItem).page }
      </div>
    </div>
  );
};

export default Profile;
