import '../styles/dashboard.css';
import TodayTasksCard from './TodayTasksCard';
import UpcomingTasksCard from './UpcomingTasksCard';
import QuickIdeasCard from './QuickIdeasCard';
import DailyProgressCard from './DailyProgressCard';
import { isToday } from '../utils/dateTime';

export default function Dashboard({
  tasks,
  ideas,
  onToggleTask,
  onAddTask,
  onAddIdea,
  taskAddOpen,
  ideaAddOpen,
  requestAddTask,
  requestAddIdea,
  closeAddTask,
  closeAddIdea,
}) {
  const todayTasks = tasks.filter((t) => isToday(t.dueDate) || !t.dueDate);

  return (
    <div className="dashboard">
      <div className="dashboard__cell">
        <TodayTasksCard
          tasks={todayTasks}
          onToggle={onToggleTask}
          onAdd={onAddTask}
          addOpen={taskAddOpen}
          onRequestAdd={requestAddTask}
          onCloseAdd={closeAddTask}
        />
      </div>
      <div className="dashboard__cell">
        <UpcomingTasksCard tasks={tasks} />
      </div>
      <div className="dashboard__cell">
        <QuickIdeasCard
          ideas={ideas}
          onAdd={onAddIdea}
          addOpen={ideaAddOpen}
          onRequestAdd={requestAddIdea}
          onCloseAdd={closeAddIdea}
        />
      </div>
      <div className="dashboard__cell">
        <DailyProgressCard tasks={todayTasks} />
      </div>
    </div>
  );
}
