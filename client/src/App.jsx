import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import Container from './components/Layout/Container';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/variables.scss';
import './styles/global.scss';
import './App.scss';

// Dev mode flag - set to true to always use sample data
const DEV_MODE = true;

// If in dev mode, clear any existing data and set up sample data
if (DEV_MODE) {
  console.log('Clearing localStorage for dev mode');
  localStorage.clear();
  localStorage.setItem('devMode', 'true');
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DataProvider>
          <Router>
            <div className="app">
              <Container devMode={DEV_MODE} />
            </div>
          </Router>
        </DataProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
