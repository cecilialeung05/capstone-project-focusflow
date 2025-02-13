import React from 'react';

function Settings({ theme, toggleTheme }) {
  return (
    <div>
      <h1>Settings</h1>
      <p>Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

export default Settings;