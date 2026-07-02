export function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isToday(iso) {
  return iso === todayISO();
}

export function isTodayOrPast(iso) {
  if (!iso) return true;
  return iso <= todayISO();
}

export function isOverdue(iso) {
  if (!iso) return false;
  return iso < todayISO();
}

export function formatShortDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function isUpcoming(iso) {
  if (!iso) return false;
  return iso > todayISO();
}

function todayGroupRank(dueDate, today) {
  if (!dueDate) return 2;
  if (dueDate < today) return 0;
  if (dueDate === today) return 1;
  return 3;
}

function timeRank(time) {
  return time ? 0 : 1;
}

export function sortTodayTasks(a, b) {
  const today = todayISO();
  const ga = todayGroupRank(a.dueDate, today);
  const gb = todayGroupRank(b.dueDate, today);
  if (ga !== gb) return ga - gb;

  if (ga === 0) {
    const dc = (a.dueDate || '').localeCompare(b.dueDate || '');
    if (dc !== 0) return dc;
  }

  const ta = timeRank(a.time);
  const tb = timeRank(b.time);
  if (ta !== tb) return ta - tb;
  if (a.time && b.time) return a.time.localeCompare(b.time);
  return 0;
}

export function sortUpcomingTasks(a, b) {
  const dc = (a.dueDate || '').localeCompare(b.dueDate || '');
  if (dc !== 0) return dc;

  const ta = timeRank(a.time);
  const tb = timeRank(b.time);
  if (ta !== tb) return ta - tb;
  if (a.time && b.time) return a.time.localeCompare(b.time);
  return 0;
}

export function formatDueDate(iso) {
  if (!iso) return '';
  const today = todayISO();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const ty = tomorrow.getFullYear();
  const tm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const td = String(tomorrow.getDate()).padStart(2, '0');
  const tomorrowISO = `${ty}-${tm}-${td}`;

  if (iso === today) return 'Today';
  if (iso === tomorrowISO) return 'Tomorrow';

  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatRelativeTime(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = now - then;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return 'yesterday';
  if (day < 7) return `${day}d ago`;
  const d = new Date(then);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function makeId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}
