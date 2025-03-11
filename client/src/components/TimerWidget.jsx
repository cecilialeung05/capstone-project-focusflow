import React, { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiRefreshCw } from 'react-icons/fi';
import { generateSessionTags } from '../utils/sessionAnalytics';
import './TimerWidget.scss';

const TimerWidget = ({ onTimerEvent, selectedTask, autoStart }) => {
    const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const [sessionData, setSessionData] = useState({
        startTime: null,
        duration: 25,
        interruptions: 0,
        energyLevel: null,
        taskId: null
    });
    const [pauseCount, setPauseCount] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            handleSessionComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, time]);

    // Auto-start timer if prop is provided
    useEffect(() => {
        if (autoStart && selectedTask) {
            handleStart();
        }
    }, [autoStart, selectedTask]);

    const handleStart = async () => {
        // Prompt for energy level before starting
        const energyLevel = window.confirm('Are you feeling energized?') 
            ? 'Feeling Good' 
            : 'Feeling Tired';

        setSessionData({
            startTime: new Date(),
            duration: time / 60,
            interruptions: 0,
            energyLevel,
            taskId: selectedTask?.id
        });

        setIsActive(true);
        onTimerEvent('start', {
            taskId: selectedTask?.id,
            duration: time / 60,
            energyLevel
        });
    };

    const handlePause = () => {
        setPauseCount(prev => prev + 1);
        setIsActive(false);
        setSessionData(prev => ({
            ...prev,
            interruptions: prev.interruptions + 1
        }));
        onTimerEvent('pause');
    };

    const handleReset = () => {
        setTime(25 * 60);
        setIsActive(false);
        setSessionData({
            startTime: null,
            duration: 25,
            interruptions: 0,
            energyLevel: null,
            taskId: null
        });
        onTimerEvent('reset');
    };

    const handleSessionComplete = async () => {
        setIsActive(false);

        // Calculate final session data
        const finalSessionData = {
            ...sessionData,
            endTime: new Date(),
            duration: 25 - (time / 60), // actual duration in minutes
        };

        // Generate tags automatically
        const sessionTags = generateSessionTags(finalSessionData);

        // Create note data with session information
        const noteData = {
            title: `Focus Session: ${selectedTask?.title || 'Untitled Task'}`,
            content: generateSessionSummary(finalSessionData),
            task_id: sessionData.taskId,
            tags: sessionTags
        };

        // Notify parent component
        onTimerEvent('complete', noteData);
    };

    const generateSessionSummary = (session) => {
        return `
Focus Session Summary:
- Duration: ${session.duration} minutes
- Time of Day: ${new Date(session.startTime).getHours() >= 5 && 
                new Date(session.startTime).getHours() < 12 ? 'Morning' : 'Afternoon'}
- Energy Level: ${session.energyLevel}
- Interruptions: ${session.interruptions}
${session.taskId ? `- Task: ${selectedTask?.title}` : ''}
        `.trim();
    };

    // Format time for display
    const formatTime = () => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer-widget">
            <div className="timer-display">
                <span className="time">{formatTime()}</span>
            </div>
            
            <div className="timer-controls">
                {!isActive ? (
                    <button 
                        className="control-btn start"
                        onClick={handleStart}
                        disabled={!selectedTask}
                    >
                        <FiPlay />
                    </button>
                ) : (
                    <button 
                        className="control-btn pause"
                        onClick={handlePause}
                    >
                        <FiPause />
                    </button>
                )}
                
                <button 
                    className="control-btn reset"
                    onClick={handleReset}
                >
                    <FiRefreshCw />
                </button>
            </div>

            {selectedTask && (
                <div className="task-info">
                    <span>Current Task: {selectedTask.title}</span>
                </div>
            )}
        </div>
    );
};

export default TimerWidget; 