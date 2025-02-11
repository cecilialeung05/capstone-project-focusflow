import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { date: "Mon", tasksCompleted: 3 },
  { date: "Tue", tasksCompleted: 5 },
  { date: "Wed", tasksCompleted: 2 },
  { date: "Thu", tasksCompleted: 7 },
  { date: "Fri", tasksCompleted: 4 },
];

const TaskCompletionChart = () => (
  <LineChart width={400} height={250} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="tasksCompleted" stroke="#82ca9d" />
  </LineChart>
);

export default TaskCompletionChart;
