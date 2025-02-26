import React, { useState, useEffect } from 'react';
import './MotivationalQuotes.scss';

function MotivationalQuotes({ totalTimeToday = 0, timerEvent = null }) {
  const [displayedMessage, setDisplayedMessage] = useState('');

  const motivationalMessages = {
    start: [
      " Timer started! Let's focus...",
      " Time to shine...",
      " Your productivity journey begins...",
      " Ready, set, focus..."
    ],
    break: [
      " Great work! Take a breather...",
      " Time to stretch those muscles...",
      " Hydrate and recharge...",
      " You've earned this break..."
    ],
    general: [
      " Every minute counts...",
      " Your focus is your superpower...",
      " Small steps lead to big achievements...",
      " You're making progress..."
    ],
    timeBasedMessages: [
      `${Math.round(totalTimeToday / 60)} hours of pure dedication...`,
      `Look at you, ${Math.round(totalTimeToday / 60)} hours of focused work...`,
      `${Math.round(totalTimeToday / 60)} hours closer to your goals...`
    ]
  };

  useEffect(() => {
    let typingTimeout;

    const typeMessage = (text) => {
      let index = 0;
      setDisplayedMessage('');
      
      const type = () => {
        if (index < text.length) {
          setDisplayedMessage(text.substring(0, index + 1));
          index++;
          typingTimeout = setTimeout(type, 150); 
        }
      };
      
      type();
    };

    const updateMessage = () => {
      let messagePool;
      
      if (timerEvent === 'start') {
        messagePool = motivationalMessages.start;
      } else if (timerEvent === 'break') {
        messagePool = motivationalMessages.break;
      } else if (totalTimeToday > 120) {
        messagePool = motivationalMessages.timeBasedMessages;
      } else {
        messagePool = motivationalMessages.general;
      }
      
      const newMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
      typeMessage(newMessage);
    };


    if (timerEvent) {
      updateMessage();
    }

    return () => clearTimeout(typingTimeout);
  }, [timerEvent, totalTimeToday]);

  return (
    <div className="motivational-quotes">
      <div className="motivational-quotes__container">
        {displayedMessage}
        <span className="motivational-quotes__cursor"></span>
      </div>
    </div>
  );
}

export default MotivationalQuotes; 