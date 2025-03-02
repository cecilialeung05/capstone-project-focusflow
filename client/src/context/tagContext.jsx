import { createContext, useContext, useState, useEffect } from 'react';
import tagService from '../services/tagService';

const TagContext = createContext();


export const TagProvider = ({ children }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await tagService.getAllTags();
        setTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  return (
    <TagContext.Provider value={{ tags, setTags }}>
      {children}
    </TagContext.Provider>  
  );
};

export const useTags = () => useContext(TagContext);
