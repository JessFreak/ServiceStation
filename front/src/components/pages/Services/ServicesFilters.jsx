import React from 'react';

const ServicesFilters = ({ filters, onFilterChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange((prevFilters) => ({ ...prevFilters, [name]: value || null }));
  };

  return (
    <div className="filters">
      <div className="input-container">
        <label htmlFor="name">Назва</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Назва послуги"
          value={filters?.name || ''}
          onChange={handleInputChange}
        />
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div className="input-container">
          <label htmlFor="minPrice">Від</label>
          <input
            type="number"
            min={0}
            max={filters.maxPrice}
            id="minPrice"
            name="minPrice"
            placeholder="Мінімальна ціна"
            value={filters?.minPrice || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="maxPrice">До</label>
          <input
            type="number"
            min={filters.minPrice}
            id="maxPrice"
            name="maxPrice"
            placeholder="Максимальна ціна"
            value={filters?.maxPrice || ''}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesFilters;
