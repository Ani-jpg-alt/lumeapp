import React from 'react';

const FilterButtons = ({ categories, activeFilter, onFilterChange }) => {
  return (
    <div className="filter-buttons" style={{marginBottom: '3rem'}}>
      {categories.map(category => (
        <button 
          key={category.id}
          className="btn filter-btn"
          onClick={() => onFilterChange(category.id)}
          data-active={activeFilter === category.id}
          style={{
            background: activeFilter === category.id ? 'linear-gradient(135deg, #e91e63, #f8e8ff)' : 'linear-gradient(135deg, #fff, #f8e8ff)',
            color: activeFilter === category.id ? 'white' : '#e91e63',
            border: '2px solid rgba(233, 30, 99, 0.2)',
            boxShadow: activeFilter === category.id ? '0 4px 15px rgba(233, 30, 99, 0.3)' : '0 2px 8px rgba(233, 30, 99, 0.1)'
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;