import React from 'react';

const FilterButtons = ({ categories, activeFilter, onFilterChange }) => {
  return (
    <div className="filter-buttons">
      {categories.map(category => (
        <button 
          key={category.id}
          className="btn filter-btn"
          onClick={() => onFilterChange(category.id)}
          data-active={activeFilter === category.id}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;