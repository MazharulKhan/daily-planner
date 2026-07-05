import '../styles/ideas.css';
import { formatRelativeTime } from '../utils/dateTime';

export default function IdeaRow({ idea, onOpen }) {
  return (
    <button
      type="button"
      className="idea-row"
      onClick={onOpen}
      aria-label={`Open idea: ${idea.text}`}
    >
      <svg
        className="idea-row__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
      </svg>
      <span className="idea-row__text">{idea.text}</span>
      <span className="idea-row__time">{formatRelativeTime(idea.createdAt)}</span>
    </button>
  );
}
