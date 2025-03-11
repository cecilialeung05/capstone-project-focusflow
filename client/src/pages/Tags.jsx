import React, { useState, useMemo, useEffect } from 'react';
import './Tags.scss';
import { 
    DURATION_FILTERS, 
    TIME_OF_DAY_FILTERS, 
    WORK_TYPE_FILTERS, 
    ENERGY_LEVEL_FILTERS 
} from '../utils/sessionAnalytics';
import tagService from '../services/tagService';

// Define tag groups with ordered arrays and colors
const TAG_GROUPS = {
  'Work Type': {
    tags: ['Deep Focus', 'Light Work'],
    colors: {
      'Deep Focus': '#465669', // More muted navy
      'Light Work': '#779eb7'  // Softer blue
    }
  },
  'Energy Level': {
    tags: ['Feeling Good', 'Feeling Tired'],
    colors: {
      'Feeling Good': '#6b9e81', // Muted sage green
      'Feeling Tired': '#a3adb7'  // Softer gray
    }
  },
  'Time of Day': {
    tags: ['Morning Session', 'Afternoon Session'],
    colors: {
      'Morning Session': '#d4b95e',    // Muted gold
      'Afternoon Session': '#c17f59'   // Muted terracotta
    }
  },
  'Duration': {
    tags: ['25min', '50min'],
    colors: {
      '25min': '#8e7b9f',  // Muted lavender
      '50min': '#6b5b7b'   // Deeper muted purple
    }
  }
};

const Tags = () => {
    const [tags, setTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('timeOfDay');

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const fetchedTags = await tagService.getAllTags();
                setTags(fetchedTags);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    // Move helper functions before useMemo
    const calculateSuccessRate = (notes) => {
        if (notes.length === 0) return 0;
        const completed = notes.filter(note => 
            note.content.includes('completed') || 
            note.tags.some(tag => tag.name === 'Deep Focus')
        ).length;
        return (completed / notes.length) * 100;
    };

    const calculateAverageDuration = (notes) => {
        if (notes.length === 0) return 0;
        const totalDuration = notes.reduce((sum, note) => {
            const durationMatch = note.title.match(/(\d+)\s*min/);
            return sum + (durationMatch ? parseInt(durationMatch[1]) : 0);
        }, 0);
        return Math.round(totalDuration / notes.length);
    };

    // Group filters for easy access
    const filterCategories = {
        duration: {
            label: 'Session Duration',
            filters: DURATION_FILTERS
        },
        timeOfDay: {
            label: 'Time of Day',
            filters: TIME_OF_DAY_FILTERS
        },
        workType: {
            label: 'Work Type',
            filters: WORK_TYPE_FILTERS
        },
        energyLevel: {
            label: 'Energy Level',
            filters: ENERGY_LEVEL_FILTERS
        }
    };

    // Now use the helper functions in useMemo
    const tagAnalytics = useMemo(() => {
        const analyzeCategory = (filters) => {
            return filters.map(filter => {
                const tagData = tags.find(t => t.name === filter.value);
                const notes = tagData?.notes || [];
                
                return {
                    ...filter,
                    count: notes.length,
                    successRate: calculateSuccessRate(notes),
                    averageDuration: calculateAverageDuration(notes)
                };
            });
        };

        return {
            duration: analyzeCategory(DURATION_FILTERS),
            timeOfDay: analyzeCategory(TIME_OF_DAY_FILTERS),
            workType: analyzeCategory(WORK_TYPE_FILTERS),
            energyLevel: analyzeCategory(ENERGY_LEVEL_FILTERS)
        };
    }, [tags]);

    return (
        <div className="tags-container">
            {/* Category Selection */}
            <div className="category-selector">
                {Object.entries(filterCategories).map(([key, category]) => (
                    <button
                        key={key}
                        className={selectedCategory === key ? 'active' : ''}
                        onClick={() => setSelectedCategory(key)}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {/* Analytics Display */}
            <div className="analytics-cards">
                {tagAnalytics[selectedCategory]?.map(analysis => (
                    <div key={analysis.value} className="analytics-card">
                        <h3>{analysis.label}</h3>
                        <div className="stats">
                            <div className="stat">
                                <label>Total Sessions</label>
                                <span>{analysis.count}</span>
                            </div>
                            <div className="stat">
                                <label>Success Rate</label>
                                <span>{analysis.successRate.toFixed(1)}%</span>
                            </div>
                            <div className="stat">
                                <label>Avg Duration</label>
                                <span>{analysis.averageDuration} min</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tags;