import { useState } from 'react';
import Sidebar from '@UI/Sidebar/Sidebar';
import OrderHistory from '@Components/OrderHistory/OrderHistory';
import Users from '@Components/pages/AdminPanel/Users';
import './AdminPanel.css';
import Services from '@Components/pages/AdminPanel/Services';

const AdminPanel = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('Замовлення');
  const options = [
    { name: 'Замовлення', icon: 'bx-cart', page: <OrderHistory role='ADMIN'/> },
    { name: 'Послуги', icon: 'bx-wrench', page: <Services /> },
    { name: 'Користувачі', icon: 'bx-user', page: <Users /> },
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

export default AdminPanel;
