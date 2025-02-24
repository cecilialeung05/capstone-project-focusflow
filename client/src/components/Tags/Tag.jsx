import React from 'react';
import { getTagColor } from '../../utils/tagColors';
import './Tag.scss';

const Tag = ({ name, className = '', onClick }) => {
  return (
    <span 
      className={`tag ${className}`}
      style={{ backgroundColor: getTagColor(name) }}
      onClick={onClick}
    >
      {name}
    </span>
  );
};

export default Tag; 