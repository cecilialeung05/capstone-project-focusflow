import AnimatedPage from "../components/AnimatedPage";
import { Link } from "react-router-dom";
import TaskCompletionChart from "../components/TaskCompletionChart";

const Dashboard = () => {
  return (
    <AnimatedPage>
      <div className="dashboard">
        <h1>Welcome to FocusFlow</h1>
        <p>Manage your tasks, track progress, and stay productive.</p>

        {/* Quick Navigation Links */}
        <div className="dashboard-links">
          <Link to="/tasks" className="dashboard-link">Manage Tasks</Link>
          <Link to="/notes" className="dashboard-link">Take Notes</Link>
          <Link to="/insights" className="dashboard-link">View Insights</Link>
          <Link to="/weather" className="dashboard-link">Check Weather</Link>
        </div>

        {/* Task Completion Chart */}
        <div className="dashboard-chart">
          <h2>Productivity Overview</h2>
          <TaskCompletionChart />
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
