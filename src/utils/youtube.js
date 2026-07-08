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
