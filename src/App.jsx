import { useCallback, useMemo, useState } from 'react';
import './styles/layout.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import QuickIdeasWorkspace from './components/QuickIdeasWorkspace';
import StandardTaskDetail from './components/StandardTaskDetail';
import { useTasks, useIdeas } from './hooks/useLocalStorage';
import { makeSampleTasks, makeSampleIdeas } from './data/sampleData';

function App() {
  const { tasks, addTask, editTask, toggleTask, deleteTask } =
    useTasks(makeSampleTasks());
  const { ideas, addIdea, editIdea, deleteIdea } = useIdeas(makeSampleIdeas());

  const [taskAddOpen, setTaskAddOpen] = useState(false);
  const [ideaAddOpen, setIdeaAddOpen] = useState(false);
  const [view, setView] = useState('dashboard');
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [pendingNavTarget, setPendingNavTarget] = useState(null);

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
  }, []);

  const confirmNavigation = useCallback((target) => {
    setPendingNavTarget(null);
    setSelectedTaskId(null);
    if (target === 'quick-ideas') {
      setSelectedIdeaId(null);
      setView('quick-ideas');
    } else {
      setView('dashboard');
    }
  }, []);

  const cancelNavigation = useCallback(() => {
    setPendingNavTarget(null);
  }, []);

  const navigate = useCallback(
    (id) => {
      if (id === 'dashboard') {
        if (detailOpen) {
          setPendingNavTarget('dashboard');
        } else {
          setView('dashboard');
          setSelectedTaskId(null);
        }
      } else if (id === 'quick-ideas') {
        if (detailOpen) {
          setPendingNavTarget('quick-ideas');
        } else {
          setSelectedIdeaId(null);
          setView('quick-ideas');
          setSelectedTaskId(null);
        }
      }
    },
    [detailOpen],
  );

  let content;
  if (detailOpen && selectedTask) {
    content = (
      <StandardTaskDetail
        task={selectedTask}
        pendingNavTarget={pendingNavTarget}
        onConfirmNavigation={confirmNavigation}
        onCancelNavigation={cancelNavigation}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
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
        taskAddOpen={taskAddOpen}
        ideaAddOpen={ideaAddOpen}
        requestAddTask={requestAddTask}
        requestAddIdea={requestAddIdea}
        closeAddTask={closeAddTask}
        closeAddIdea={closeAddIdea}
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
