import { useCallback, useMemo, useState } from 'react';
import './styles/layout.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import QuickIdeasWorkspace from './components/QuickIdeasWorkspace';
import StandardTaskDetail from './components/StandardTaskDetail';
import YouTubeTaskDetail from './components/YouTubeTaskDetail';
import TodayPage from './components/TodayPage';
import UpcomingPage from './components/UpcomingPage';
import CompletedPage from './components/CompletedPage';
import { useTasks, useIdeas } from './hooks/useLocalStorage';
import { makeSampleTasks, makeSampleIdeas } from './data/sampleData';

function App() {
  const { tasks, addTask, editTask, toggleTask, deleteTask, editPlaybackPosition } =
    useTasks(makeSampleTasks());
  const { ideas, addIdea, editIdea, deleteIdea } = useIdeas(makeSampleIdeas());

  const [taskAddOpen, setTaskAddOpen] = useState(false);
  const [ideaAddOpen, setIdeaAddOpen] = useState(false);
  const [view, setView] = useState('dashboard');
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [pendingNavTarget, setPendingNavTarget] = useState(null);

  const [originView, setOriginView] = useState('dashboard');

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) || null,
    [tasks, selectedTaskId],
  );

  const detailOpen = selectedTaskId !== null;

  const requestAddTask = useCallback(() => {
    setTaskAddOpen(true);
  }, []);

  const closeAddTask = useCallback(() => {
    setTaskAddOpen(false);
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
        onAddTask={addTask}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
        onAddIdea={addIdea}
        onOpenWorkspace={openWorkspace}
        onOpenDetail={openTaskDetail}
        onViewAllToday={handleViewAllToday}
        onViewAllUpcoming={handleViewAllUpcoming}
        taskAddOpen={taskAddOpen}
        ideaAddOpen={ideaAddOpen}
        requestAddTask={requestAddTask}
        requestAddIdea={requestAddIdea}
        closeAddTask={closeAddTask}
        closeAddIdea={closeAddIdea}
      />
    );
  } else if (view === 'today') {
    content = (
      <TodayPage
        tasks={tasks}
        onToggle={toggleTask}
        onAdd={addTask}
        addOpen={taskAddOpen}
        onRequestAdd={requestAddTask}
        onCloseAdd={closeAddTask}
        onOpenDetail={openTaskDetail}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
        onViewAllCompleted={() => setView('completed')}
      />
    );
  } else if (view === 'upcoming') {
    content = (
      <UpcomingPage
        tasks={tasks}
        onToggle={toggleTask}
        onAdd={addTask}
        addOpen={taskAddOpen}
        onRequestAdd={requestAddTask}
        onCloseAdd={closeAddTask}
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
      />
      <div className="app-main">
        <Header
          onAddTask={requestAddTask}
          activeView={view}
          detailOpen={detailOpen}
        />
        <main className="app-content">{content}</main>
      </div>
    </div>
  );
}

export default App;
