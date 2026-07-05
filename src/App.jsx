import { useCallback, useState } from 'react';
import './styles/layout.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import QuickIdeasWorkspace from './components/QuickIdeasWorkspace';
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
  }, []);

  const navigate = useCallback((id) => {
    if (id === 'dashboard') {
      setView('dashboard');
    } else if (id === 'quick-ideas') {
      setSelectedIdeaId(null);
      setView('quick-ideas');
    }
  }, []);

  return (
    <div className="app-shell">
      <Sidebar
        onAddTask={requestAddTask}
        activeView={view}
        onNavigate={navigate}
      />
      <div className="app-main">
        <Header onAddTask={requestAddTask} activeView={view} />
        <main className="app-content">
          {view === 'dashboard' ? (
            <Dashboard
              tasks={tasks}
              ideas={ideas}
              onToggleTask={toggleTask}
              onAddTask={addTask}
              onEditTask={editTask}
              onDeleteTask={deleteTask}
              onAddIdea={addIdea}
              onOpenWorkspace={openWorkspace}
              taskAddOpen={taskAddOpen}
              ideaAddOpen={ideaAddOpen}
              requestAddTask={requestAddTask}
              requestAddIdea={requestAddIdea}
              closeAddTask={closeAddTask}
              closeAddIdea={closeAddIdea}
            />
          ) : (
            <QuickIdeasWorkspace
              ideas={ideas}
              onAdd={addIdea}
              onEditIdea={editIdea}
              onDeleteIdea={deleteIdea}
              selectedIdeaId={selectedIdeaId}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
