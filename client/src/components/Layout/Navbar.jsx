import { Link } from 'react-router-dom';
import Search from '../Search/Search';
import './Navbar.scss'; // 

function Navbar({ theme, toggleTheme, tasks, notes }) {
  return (
    <nav className={theme}>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/tasks">Tasks</Link></li>
        <li><Link to="/notes">Notes</Link></li>
        <li><Link to="/tags">Tags</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li>
          <Search tasks={tasks} notes={notes} />
        </li>
        <li>
          <button onClick={toggleTheme}>Toggle Theme ({theme})</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;