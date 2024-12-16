import React, { useState } from 'react';
import './FilterableMultiSelect.css';

const FilterableMultiSelect = ({ options = [], selectedOptions, setSelectedOptions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());

  const toggleOption = (option) => {
    if (selectedOptions.some((selected) => selected.id === option.id)) {
      setSelectedOptions(selectedOptions.filter((item) => item.id !== option.id));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="filterable-multi-select">
      <div className="select-box" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <div className="selected-items">
          {selectedOptions.length > 0
            ? selectedOptions.map((option) => option.name).join(', ')
            : 'Виберіть послуги...'}
        </div>
        <div className="dropdown-icon">&#x25BC;</div>
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div className="search-box">
            <input
              type="text"
              placeholder="Пошук..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <ul className="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li key={option.id} className="option-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedOptions.some((selected) => selected.id === option.id)}
                      onChange={() => toggleOption(option)}
                    />
                    {option.name}
                  </label>
                </li>
              ))
            ) : (
              <li className="no-options">Не знайдено опцій</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterableMultiSelect;
