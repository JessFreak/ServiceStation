import React, { useState } from 'react';
import './Dropdown.css';

const Dropdown = ({ options, active, setActive, placeholder = 'Обери опцію', isActive = true }) => {
  const [filteredOptions, setFilteredOptions] = useState(options);

  if (!options.length) {
    return null;
  }

  const handleItemClick = (e, itemName) => {
    e.preventDefault();
    setActive(active === itemName ? null : itemName);
  };

  const handleFilterChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = options.filter((item) => item.toLowerCase().includes(searchTerm));
    setFilteredOptions(filtered);
  };

  const isOverflowing = filteredOptions.length > 5;

  return (
    <nav className="dropdown">
      <ul>
        <li>
          <div className="dropdown-toggle">
            <button type="button">
              {active || placeholder}
            </button>
          </div>
          {isActive && (
            <ul
              className={`dropdown-menu ${isOverflowing ? 'dropdown-menu-scrollable' : ''}`}
            >
              {isOverflowing && (
                <input
                  type="text"
                  placeholder="Пошук"
                  onChange={handleFilterChange}
                />
              )}
              {filteredOptions.map((item, index) => (
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