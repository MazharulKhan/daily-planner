import { useCallback, useRef, useState } from 'react';
import '../styles/dashboard.css';
import TodayTasksCard from './TodayTasksCard';
import UpcomingTasksCard from './UpcomingTasksCard';
import QuickIdeasCard from './QuickIdeasCard';
import DailyProgressCard from './DailyProgressCard';
import { isTodayOrPast } from '../utils/dateTime';

export default function Dashboard({
  tasks,
  ideas,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddIdea,
  onOpenWorkspace,
  onOpenDetail,
  onViewAllToday,
  onViewAllUpcoming,
  ideaAddOpen,
  requestAddTask,
  requestAddIdea,
  closeAddIdea,
  tasksReady,
}) {
  const [activeTaskAction, setActiveTaskAction] = useState(null);
  const lastTriggerRef = useRef(null);

  const todayTasks = tasks.filter((t) => isTodayOrPast(t.dueDate));

  const beginEdit = useCallback((task, triggerEl) => {
    lastTriggerRef.current = triggerEl;
    setActiveTaskAction({ taskId: task.id, type: 'edit' });
  }, []);

  const beginDelete = useCallback((task, triggerEl) => {
    lastTriggerRef.current = triggerEl;
    setActiveTaskAction({ taskId: task.id, type: 'delete' });
  }, []);

  const clearAction = useCallback(() => {
    const ref = lastTriggerRef.current;
    setActiveTaskAction(null);
    if (ref && typeof ref.focus === 'function') {
      ref.focus();
    }
    lastTriggerRef.current = null;
  }, []);

  const handleEditSave = useCallback(
    async (id, patch) => {
      await onEditTask(id, patch);
      clearAction();
    },
    [onEditTask, clearAction],
  );

  const handleDeleteConfirm = useCallback(
    async (id) => {
      await onDeleteTask(id);
      clearAction();
    },
    [onDeleteTask, clearAction],
  );

  return (
    <div className="dashboard">
      <div className="dashboard__cell">
        <TodayTasksCard
          tasks={todayTasks}
          onToggle={onToggleTask}
          activeTaskAction={activeTaskAction}
          onBeginEdit={beginEdit}
          onBeginDelete={beginDelete}
          onEditSave={handleEditSave}
          onDeleteConfirm={handleDeleteConfirm}
          onActionCancel={clearAction}
          onOpenDetail={onOpenDetail}
          onViewAll={onViewAllToday}
          onRequestAdd={requestAddTask}
          lastTriggerRef={lastTriggerRef}
          tasksReady={tasksReady}
        />
      </div>
      <div className="dashboard__cell">
        <UpcomingTasksCard
          tasks={tasks}
          activeTaskAction={activeTaskAction}
          onBeginEdit={beginEdit}
          onBeginDelete={beginDelete}
          onEditSave={handleEditSave}
          onDeleteConfirm={handleDeleteConfirm}
          onActionCancel={clearAction}
          onOpenDetail={onOpenDetail}
          onViewAll={onViewAllUpcoming}
          tasksReady={tasksReady}
        />
      </div>
      <div className="dashboard__cell">
        <QuickIdeasCard
          ideas={ideas}
          onAdd={onAddIdea}
          addOpen={ideaAddOpen}
          onRequestAdd={requestAddIdea}
          onCloseAdd={closeAddIdea}
          onOpenWorkspace={onOpenWorkspace}
        />
      </div>
      <div className="dashboard__cell">
        <DailyProgressCard tasks={todayTasks} tasksReady={tasksReady} />
      </div>
    </div>
  );
}
