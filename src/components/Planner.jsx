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
import TaskCloudStatus from './TaskCloudStatus';
import PendingWritesSignOutConfirm from './PendingWritesSignOutConfirm';
import { useLocalIdeas } from '../hooks/useLocalIdeas';
import { useTaskCloud } from '../hooks/useTaskCloud';
import { makeSampleIdeas } from '../data/sampleData';
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
  const taskCloud = useTaskCloud(user.uid);
  const {
    tasks,
    createTask: addTask,
    updateTaskContent: editTask,
    toggleTaskCompletion: toggleTask,
    deleteTask,
    saveTaskDetail,
    savePlaybackPosition,
  } = taskCloud;
  const { ideas, addIdea, editIdea, deleteIdea } = useLocalIdeas(makeSampleIdeas());

  const [taskAddOpen, setTaskAddOpen] = useState(false);
  const [ideaAddOpen, setIdeaAddOpen] = useState(false);
  const [view, setView] = useState(() => storage.loadActiveView('dashboard'));
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [pendingNavTarget, setPendingNavTarget] = useState(null);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);

  const [originView, setOriginView] = useState(view);

  const taskTriggerRef = useRef(null);
  const signOutTriggerRef = useRef(null);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) || null,
    [tasks, selectedTaskId],
  );

  const detailOpen = selectedTaskId !== null;

  useEffect(() => {
    storage.saveActiveView(view);
  }, [view]);

  const requestAddTask = useCallback(() => {
    if (detailOpen || !taskCloud.canMutate) return;
    taskTriggerRef.current = document.activeElement;
    setTaskAddOpen(true);
  }, [detailOpen, taskCloud.canMutate]);

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

  useEffect(() => {
    if (!selectedTaskId || !taskCloud.hasServerSnapshot || taskCloud.suspended) return;
    if (tasks.some((task) => task.id === selectedTaskId)) return;
    const timeoutId = window.setTimeout(() => {
      setSelectedTaskId(null);
      setPendingNavTarget(null);
      setTaskAddOpen(false);
      setView(originView);
      taskCloud.notifyRemoteDeletion();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [
    selectedTaskId,
    tasks,
    originView,
    taskCloud.hasServerSnapshot,
    taskCloud.suspended,
    taskCloud,
  ]);

  const clearPlannerSession = useCallback(() => {
    setSelectedTaskId(null);
    setPendingNavTarget(null);
    setTaskAddOpen(false);
    setIdeaAddOpen(false);
    setSelectedIdeaId(null);
    taskCloud.clearSession();
  }, [taskCloud]);

  const performSignOut = useCallback(async (confirmed) => {
    const result = await onSignOut({
      hasPendingWrites: taskCloud.hasPendingWrites,
      confirmed,
      beforeSignOut: clearPlannerSession,
    });
    if (result?.status === 'confirmation-required') {
      setSignOutConfirmOpen(true);
    } else if (result?.status === 'failure') {
      setSignOutConfirmOpen(false);
      setSelectedTaskId(null);
      setPendingNavTarget(null);
      setTaskAddOpen(false);
      taskCloud.resumeSession();
    }
    return result;
  }, [onSignOut, taskCloud, clearPlannerSession]);

  const requestSignOut = useCallback((triggerElement = null) => {
    signOutTriggerRef.current = triggerElement || document.activeElement;
    return performSignOut(false);
  }, [performSignOut]);

  const keepSyncing = useCallback(() => {
    setSignOutConfirmOpen(false);
    signOutTriggerRef.current?.focus?.();
  }, []);

  const signOutAnyway = useCallback(() => {
    setSignOutConfirmOpen(false);
    performSignOut(true);
  }, [performSignOut]);

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
        onSaveTask={saveTaskDetail}
        onDeleteTask={deleteTask}
        onSavePlayback={savePlaybackPosition}
        onPlaybackError={taskCloud.reportPlaybackError}
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
        tasksReady={taskCloud.hasServerSnapshot}
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
        tasksReady={taskCloud.hasServerSnapshot}
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
        tasksReady={taskCloud.hasServerSnapshot}
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
        tasksReady={taskCloud.hasServerSnapshot}
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
        addDisabled={detailOpen || !taskCloud.canMutate || taskCloud.suspended}
        theme={theme}
        onToggleTheme={onToggleTheme}
        user={user}
        onSignOut={requestSignOut}
        isSigningOut={isSigningOut || signOutConfirmOpen}
        signOutError={signOutError}
        onClearSignOutError={onClearSignOutError}
      />
      <div className="app-main">
        <Header
          onAddTask={requestAddTask}
          activeView={view}
          detailOpen={detailOpen}
          addDisabled={!taskCloud.canMutate || taskCloud.suspended}
        />
        <main className="app-content">
          <TaskCloudStatus
            status={taskCloud.status}
            isConfirmedEmpty={taskCloud.isConfirmedEmpty}
            listenerError={taskCloud.listenerError}
            notices={taskCloud.mutationNotices}
            onRetry={taskCloud.retry}
            onSignOut={requestSignOut}
            onDismissNotice={taskCloud.dismissNotice}
          />
          {content}
        </main>
      </div>
      <AddTaskModal
        open={taskAddOpen}
        onAdd={addTask}
        onClose={closeAddTask}
      />
      <PendingWritesSignOutConfirm
        open={signOutConfirmOpen}
        onKeepSyncing={keepSyncing}
        onSignOutAnyway={signOutAnyway}
      />
    </div>
  );
}
