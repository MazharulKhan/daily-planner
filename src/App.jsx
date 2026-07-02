import { useCallback, useState } from 'react';
import './styles/layout.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { useTasks, useIdeas } from './hooks/useLocalStorage';
import { makeSampleTasks, makeSampleIdeas } from './data/sampleData';

function App() {
  const { tasks, addTask, toggleTask } = useTasks(makeSampleTasks());
  const { ideas, addIdea } = useIdeas(makeSampleIdeas());

  const [taskAddOpen, setTaskAddOpen] = useState(false);
  const [ideaAddOpen, setIdeaAddOpen] = useState(false);

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

  return (
    <div className="app-shell">
      <Sidebar onAddTask={requestAddTask} />
      <div className="app-main">
        <Header onAddTask={requestAddTask} />
        <main className="app-content">
          <Dashboard
            tasks={tasks}
            ideas={ideas}
            onToggleTask={toggleTask}
            onAddTask={addTask}
            onAddIdea={addIdea}
            taskAddOpen={taskAddOpen}
            ideaAddOpen={ideaAddOpen}
            requestAddTask={requestAddTask}
            requestAddIdea={requestAddIdea}
            closeAddTask={closeAddTask}
            closeAddIdea={closeAddIdea}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
