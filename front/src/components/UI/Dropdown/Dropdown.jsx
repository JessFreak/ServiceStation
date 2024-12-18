import React from 'react';
import './Dropdown.css';

const Dropdown = ({ options, active, setActive, placeholder = 'Обери опцію', isActive = true }) => {
  if (!options.length) {
    return null;
  }

  const handleItemClick = (e, itemName) => {
    e.preventDefault();
    setActive(active === itemName ? null : itemName);
  };

  return (
    <nav className="dropdown">
      <ul>
        <li>
          <button type="button" className="dropdown-toggle">
            {active || placeholder}
          </button>
          {isActive && (
            <ul className="dropdown-menu">
              {options.map((item, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={(e) => handleItemClick(e, item)}
                    className={active === item ? 'active' : ''}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Dropdown;
