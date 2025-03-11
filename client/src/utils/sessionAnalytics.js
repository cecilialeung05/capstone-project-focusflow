// Constants for filters
export const DURATION_FILTERS = [
    { value: '25min', label: '25 Minutes' },
    { value: '50min', label: '50 Minutes' },
];

export const TIME_OF_DAY_FILTERS = [
    { value: 'Morning Session', label: 'Morning Session' },
    { value: 'Afternoon Session', label: 'Afternoon Session' },
];

export const WORK_TYPE_FILTERS = [
    { value: 'Deep Focus', label: 'Deep Focus' },
    { value: 'Light Work', label: 'Light Work' },
];

export const ENERGY_LEVEL_FILTERS = [
    { value: 'Feeling Good', label: 'Feeling Good' },
    { value: 'Feeling Tired', label: 'Feeling Tired' },
];

export const getTimeOfDay = () => {
    const hour = new Date().getHours();
    return (hour >= 5 && hour < 12) ? 'Morning Session' : 'Afternoon Session';
};

export const getDurationTag = (minutes) => {
    return minutes <= 25 ? '25min' : '50min';
};

export const generateSessionTags = (sessionData) => {
    const tags = [
        getDurationTag(sessionData.duration),
        getTimeOfDay(),
        sessionData.interruptions < 2 ? 'Deep Focus' : 'Light Work',
        sessionData.energyLevel || 'Feeling Good'
    ];

    return tags;
}; 