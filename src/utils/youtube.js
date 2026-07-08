const YOUTUBE_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
];

export function validateYouTubeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return { valid: true, url: '' };

  try {
    const parsed = new URL(trimmed);
    const protocolValid = parsed.protocol === 'http:' || parsed.protocol === 'https:';
    const hostValid = YOUTUBE_HOSTS.includes(parsed.hostname.toLowerCase());
    return { valid: protocolValid && hostValid, url: trimmed };
  } catch {
    return { valid: false, url: trimmed };
  }
}

export function parseYouTubeVideoId(value) {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  if (!url) return null;
  const check = validateYouTubeUrl(url);
  if (!check.valid) return null;

  let parsed;
  try {
    parsed = new URL(check.url);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase();

  if (host === 'youtu.be') {
    const id = parsed.pathname.slice(1).split('/')[0];
    return id ? id : null;
  }

  const pathParts = parsed.pathname.split('/').filter(Boolean);
  if (pathParts.length === 0) {
    const v = parsed.searchParams.get('v');
    return v ? v : null;
  }

  const first = pathParts[0].toLowerCase();
  if (first === 'watch') {
    const v = parsed.searchParams.get('v');
    return v ? v : null;
  }

  if (first === 'embed' || first === 'shorts' || first === 'live') {
    const id = pathParts[1];
    return id ? id : null;
  }

  const v = parsed.searchParams.get('v');
  return v ? v : null;
}

export function formatSeconds(totalSeconds) {
  const seconds = Number(totalSeconds);
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const pad = (n) => String(n).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`;
  }
  return `${minutes}:${pad(secs)}`;
}

const TIMESTAMP_TOKEN_PATTERN = /\[\s*(\d+):([0-5]\d)(?::([0-5]\d))?\s*\]/g;

function tokenToSeconds(group1, group2, group3) {
  if (group3 !== undefined) {
    const hours = parseInt(group1, 10);
    const minutes = parseInt(group2, 10);
    const secs = parseInt(group3, 10);
    return hours * 3600 + minutes * 60 + secs;
  }
  const minutes = parseInt(group1, 10);
  const secs = parseInt(group2, 10);
  return minutes * 60 + secs;
}

export function parseTimestampNotes(text) {
  if (typeof text !== 'string' || text.length === 0) return [];

  const segments = [];
  let lastIndex = 0;
  TIMESTAMP_TOKEN_PATTERN.lastIndex = 0;

  let match = TIMESTAMP_TOKEN_PATTERN.exec(text);
  while (match !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        value: text.slice(lastIndex, match.index),
      });
    }

    const seconds = tokenToSeconds(match[1], match[2], match[3]);
    if (Number.isFinite(seconds) && seconds >= 0) {
      segments.push({
        type: 'timestamp',
        token: match[0],
        seconds,
        label: formatSeconds(seconds),
      });
    } else {
      segments.push({ type: 'text', value: match[0] });
    }

    lastIndex = match.index + match[0].length;
    match = TIMESTAMP_TOKEN_PATTERN.exec(text);
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return segments;
}
