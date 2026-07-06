import { makeId } from '../utils/dateTime';

const VALID_PRIORITIES = ['High', 'Medium', 'Low'];
const VALID_CATEGORIES = ['Work', 'Learning', 'Personal', 'Health'];
const TIME_RE = /^\d{2}:\d{2}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const VALID_ISO = (v) =>
  typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Date.parse(v));

export function normalizeTask(task) {
  const now = new Date().toISOString();

  const id =
    typeof task.id === 'string' && task.id.trim() ? task.id : makeId('task');

  const title =
    typeof task.title === 'string' && task.title.trim()
      ? task.title
      : 'Untitled';

  const description = typeof task.description === 'string' ? task.description : '';

  const completed = task.completed === true;

  const priority = VALID_PRIORITIES.includes(task.priority)
    ? task.priority
    : 'Medium';

  const category = VALID_CATEGORIES.includes(task.category)
    ? task.category
    : 'Work';

  const time =
    typeof task.time === 'string' && TIME_RE.test(task.time) ? task.time : null;

  const dueDate =
    typeof task.dueDate === 'string' && DATE_RE.test(task.dueDate)
      ? task.dueDate
      : null;

  const updatedAt =
    typeof task.updatedAt === 'string' && task.updatedAt.trim()
      ? task.updatedAt
      : now;

  return { id, title, description, completed, priority, category, time, dueDate, updatedAt };
}

export function migrateTasks(tasks) {
  if (!Array.isArray(tasks)) return [];
  return tasks.map(normalizeTask);
}

export function migrateIdeas(ideas) {
  if (!Array.isArray(ideas)) return [];
  const migrationStamp = new Date().toISOString();

  return ideas.map((idea) => {
    const id =
      typeof idea.id === 'string' && idea.id.trim() ? idea.id : makeId('idea');

    const text = typeof idea.text === 'string' ? idea.text : '';

    const notes = typeof idea.notes === 'string' ? idea.notes : '';

    const createdAt = VALID_ISO(idea.createdAt) ? idea.createdAt : migrationStamp;

    const updatedAt = VALID_ISO(idea.updatedAt) ? idea.updatedAt : createdAt;

    return { id, text, notes, createdAt, updatedAt };
  });
}
