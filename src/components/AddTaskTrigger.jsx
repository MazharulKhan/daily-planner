export default function AddTaskTrigger({ onRequestAdd, disabled = false }) {
  return (
    <div className="add-task">
      <button
        type="button"
        className="add-task__trigger"
        onClick={onRequestAdd}
        disabled={disabled}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add a task
      </button>
    </div>
  );
}
