import React, { useMemo } from 'react';
import {
    DURATION_FILTERS,
    TIME_OF_DAY_FILTERS,
    WORK_TYPE_FILTERS,
    ENERGY_LEVEL_FILTERS
} from '../utils/sessionAnalytics';

const SessionAnalytics = ({ notes }) => {
    const analytics = useMemo(() => {
        const sessions = notes.filter(note => note.metadata?.duration);
        
        return {
            timeOfDay: analyzeByCategory(sessions, TIME_OF_DAY_FILTERS),
            duration: analyzeByCategory(sessions, DURATION_FILTERS),
            workType: analyzeByCategory(sessions, WORK_TYPE_FILTERS),
            energyLevel: analyzeByCategory(sessions, ENERGY_LEVEL_FILTERS)
        };
    }, [notes]);

    const analyzeByCategory = (sessions, filters) => {
        return filters.reduce((acc, filter) => {
            const relevantSessions = sessions.filter(session => 
                session.tags.includes(filter.value)
            );
            
            acc[filter.value] = {
                label: filter.label,
                count: relevantSessions.length,
                completionRate: calculateCompletionRate(relevantSessions),
                averageDuration: calculateAverageDuration(relevantSessions)
            };
            
            return acc;
        }, {});
    };

    const calculateCompletionRate = (sessions) => {
        if (sessions.length === 0) return 0;
        const completed = sessions.filter(s => s.metadata.interruptions < 2).length;
        return (completed / sessions.length) * 100;
    };

    const calculateAverageDuration = (sessions) => {
        if (sessions.length === 0) return 0;
        return sessions.reduce((acc, s) => acc + s.metadata.duration, 0) / sessions.length;
    };

    return (
        <div className="analytics-container">
            <h2>Focus Session Analytics</h2>
            
            <section className="analytics-section">
                <h3>Time of Day Analysis</h3>
                {Object.entries(analytics.timeOfDay).map(([key, data]) => (
                    <div key={key} className="analytics-card">
                        <h4>{data.label}</h4>
                        <p>Sessions: {data.count}</p>
                        <p>Completion Rate: {data.completionRate.toFixed(1)}%</p>
                        <p>Avg Duration: {data.averageDuration.toFixed(0)} min</p>
                    </div>
                ))}
            </section>

            {/* Similar sections for duration, work type, and energy level */}
        </div>
    );
};

export default SessionAnalytics;