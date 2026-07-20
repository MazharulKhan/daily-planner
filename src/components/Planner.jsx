import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import QuickIdeasWorkspace from './QuickIdeasWorkspace';
import StandardTaskDetail from './StandardTaskDetail';
import YouTubeTaskDetail from './YouTubeTaskDetail';
import TodayPage from './TodayPage';
import UpcomingPage from './UpcomingPage';
import CompletedPage from './CompletedPage';
import AddTaskModal from './AddTaskModal';
import { useTasks, useIdeas } from '../hooks/useLocalStorage';
import { makeSampleTasks, makeSampleIdeas } from '../data/sampleData';
import { storage } from '../data/storage';

export default function Planner({
  user,
  onSignOut,
  isSigningOut,
  signOutError,
  onClearSignOutError,
  theme,
  onToggleTheme,
}) {
  const { tasks, addTask, editTask, toggleTask, deleteTask, editPlaybackPosition } =
    useTasks(makeSampleTasks());
  const { ideas, addIdea, editIdea, deleteIdea } = useIdeas(makeSampleIdeas());

  const [taskAddOpen, setTaskAddOpen] = useState(false);
  const [ideaAddOpen, setIdeaAddOpen] = useState(false);
  const [view, setView] = useState(() => storage.loadActiveView('dashboard'));
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [pendingNavTarget, setPendingNavTarget] = useState(null);

  const [originView, setOriginView] = useState(view);

  const taskTriggerRef = useRef(null);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) || null,
    [tasks, selectedTaskId],
  );

  const detailOpen = selectedTaskId !== null;

  useEffect(() => {
    storage.saveActiveView(view);
  }, [view]);

  const requestAddTask = useCallback(() => {
    if (detailOpen) return;
    taskTriggerRef.current = document.activeElement;
    setTaskAddOpen(true);
  }, [detailOpen]);

  const closeAddTask = useCallback(() => {
    setTaskAddOpen(false);
    const el = taskTriggerRef.current;
    if (el && typeof el.focus === 'function') {
      el.focus();
    }
    taskTriggerRef.current = null;
  }, []);

  const requestAddIdea = useCallback(() => {
    setIdeaAddOpen(true);
  }, []);

  const closeAddIdea = useCallback(() => {
    setIdeaAddOpen(false);
  }, []);

  const openWorkspace = useCallback((ideaId = null) => {
    setSelectedIdeaId(ideaId);
    setView('quick-ideas');
    setSelectedTaskId(null);
  }, []);

  const openTaskDetail = useCallback((task) => {
    setSelectedTaskId(task.id);
    setOriginView(view);
  }, [view]);

  const confirmNavigation = useCallback((target) => {
    setPendingNavTarget(null);
    setSelectedTaskId(null);
    if (target === 'quick-ideas') {
      setSelectedIdeaId(null);
      setView('quick-ideas');
    } else {
      setView(target);
    }
  }, []);

  const cancelNavigation = useCallback(() => {
    setPendingNavTarget(null);
  }, []);

  const navigate = useCallback(
    (id) => {
      if (detailOpen) {
        setPendingNavTarget(id);
      } else {
        setView(id);
        setSelectedTaskId(null);
        if (id === 'quick-ideas') {
          setSelectedIdeaId(null);
        }
      }
    },
    [detailOpen],
  );

  const handleViewAllToday = useCallback(() => setView('today'), []);
  const handleViewAllUpcoming = useCallback(() => setView('upcoming'), []);

  let content;
  if (detailOpen && selectedTask) {
    const DetailComponent =
      selectedTask.taskType === 'youtube' ? YouTubeTaskDetail : StandardTaskDetail;
    content = (
      <DetailComponent
        task={selectedTask}
        originView={originView}
        pendingNavTarget={pendingNavTarget}
        onConfirmNavigation={confirmNavigation}
        onCancelNavigation={cancelNavigation}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
        onEditPlaybackPosition={editPlaybackPosition}
      />
    );
  } else if (view === 'dashboard') {
    content = (
      <Dashboard
        tasks={tasks}
        ideas={ideas}
        onToggleTask={toggleTask}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
        onAddIdea={addIdea}
        onOpenWorkspace={openWorkspace}
        onOpenDetail={openTaskDetail}
        onViewAllToday={handleViewAllToday}
        onViewAllUpcoming={handleViewAllUpcoming}
        ideaAddOpen={ideaAddOpen}
        requestAddTask={requestAddTask}
        requestAddIdea={requestAddIdea}
        closeAddIdea={closeAddIdea}
      />
    );
  } else if (view === 'today') {
    content = (
      <TodayPage
        tasks={tasks}
        onToggle={toggleTask}
        onOpenDetail={openTaskDetail}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
        onRequestAdd={requestAddTask}
        onViewAllCompleted={() => setView('completed')}
      />
    );
  } else if (view === 'upcoming') {
    content = (
      <UpcomingPage
        tasks={tasks}
        onToggle={toggleTask}
        onOpenDetail={openTaskDetail}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
      />
    );
  } else if (view === 'completed') {
    content = (
      <CompletedPage
        tasks={tasks}
        onToggle={toggleTask}
        onOpenDetail={openTaskDetail}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
      />
    );
  } else {
    content = (
      <QuickIdeasWorkspace
        ideas={ideas}
        onAdd={addIdea}
        onEditIdea={editIdea}
        onDeleteIdea={deleteIdea}
        selectedIdeaId={selectedIdeaId}
      />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        onAddTask={requestAddTask}
        activeView={view}
        onNavigate={navigate}
        addDisabled={detailOpen}
        theme={theme}
        onToggleTheme={onToggleTheme}
        user={user}
        onSignOut={onSignOut}
        isSigningOut={isSigningOut}
        signOutError={signOutError}
        onClearSignOutError={onClearSignOutError}
      />
      <div className="app-main">
        <Header
          onAddTask={requestAddTask}
          activeView={view}
          detailOpen={detailOpen}
        />
        <main className="app-content">{content}</main>
      </div>
      <AddTaskModal
        open={taskAddOpen}
        onAdd={addTask}
        onClose={closeAddTask}
      />
    </div>
  );
}