import React from 'react';
import './Dropdown.css';

const Dropdown = ({ menuItems, active, setActive }) => {
  const handleItemClick = (e, itemName) => {
    e.preventDefault();
    setActive(itemName);
  };

  return (
    <nav role="navigation" className="dropdown">
      <ul>
        <li>
          <a href="#">{active}</a>
          <ul className="dropdown">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={(e) => handleItemClick(e, item)}
                  className={active === item ? 'active' : ''}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Dropdown;
