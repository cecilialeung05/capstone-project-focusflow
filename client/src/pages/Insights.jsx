import AnimatedPage from "../components/AnimatedPage";
import TaskCompletionChart from "../components/TaskCompletionChart";

function Insights() {
  return (
    <div className="insights">
      <div className="insights__header">
        <h2 className="insights__title">Insights</h2>
      </div>

      <div className="insights__content">
        <div className="insights__card">
          <h3 className="insights__card-title">Task Completion Rate</h3>
          <div className="insights__card-content">
            <TaskCompletionChart />
          </div>
        </div>

        <div className="insights__card">
          <h3 className="insights__card-title">Task Distribution</h3>
          <div className="insights__card-content">
            {/* Task distribution chart */}
          </div>
        </div>

        <div className="insights__card">
          <h3 className="insights__card-title">Productivity Trends</h3>
          <div className="insights__card-content">
            {/* Productivity trend chart */}
          </div>
        </div>

        <div className="insights__card">
          <h3 className="insights__card-title">Tag Analysis</h3>
          <div className="insights__card-content">
            {/* Tag usage analysis */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
