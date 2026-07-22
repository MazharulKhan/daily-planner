import '../styles/auth-screen.css';
import AuthShowcaseCarousel from './AuthShowcaseCarousel';

function ThemeIcon({ isDark }) {
  const common = {
    className: 'auth-theme__icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (isDark) {
    return (
      <svg {...common}>
        <path d="M12 3a6 6 0 0 0 9 7.4A8 8 0 1 1 12 3Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="auth-google__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.06v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.93A6.02 6.02 0 0 1 6.09 12c0-.67.12-1.32.31-1.93V7.45H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.55l3.34-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.94c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.94 5.45l3.34 2.62C7.19 7.7 9.4 5.94 12 5.94Z"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="auth-security__icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function Brand() {
  return (
    <div className="auth-brand">
      <div className="auth-brand__mark">
        <svg
          className="auth-brand__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="3" y="4" width="18" height="17" rx="3.5" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="8" y1="2" x2="8" y2="5" />
          <line x1="16" y1="2" x2="16" y2="5" />
          <path d="M8.5 14.5L11 17L15.5 11.5" strokeWidth="2.2" />
        </svg>
      </div>
      <div className="auth-brand__name">Daily Planner</div>
    </div>
  );
}

function SignInError({ error }) {
  if (!error) return null;
  return (
    <div className="auth-error" role="alert" aria-live="assertive">
      {error.message}
    </div>
  );
}

export default function AuthScreen({
  mode,
  theme,
  onToggleTheme,
  onSignIn,
  isSigningIn,
  signInError,
  onClearSignInError,
}) {
  const darkModeOn = theme === 'dark';

  if (mode === 'loading') {
    return (
      <div className="auth-page auth-page--loading">
        <div className="auth-page__top">
          <Brand />
          <button
            type="button"
            className="auth-theme"
            role="switch"
            aria-checked={darkModeOn}
            aria-label="Toggle dark mode"
            onClick={onToggleTheme}
          >
            <ThemeIcon isDark={darkModeOn} />
            <span className="auth-theme__label">
              {darkModeOn ? 'Dark mode' : 'Light mode'}
            </span>
          </button>
        </div>
        <div className="auth-loading">
          <div className="auth-loading__spinner" aria-hidden="true" />
          <p className="auth-loading__text" aria-live="polite">
            Loading your planner…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-page__top">
        <Brand />
        <button
          type="button"
          className="auth-theme"
          role="switch"
          aria-checked={darkModeOn}
          aria-label="Toggle dark mode"
          onClick={onToggleTheme}
        >
          <ThemeIcon isDark={darkModeOn} />
          <span className="auth-theme__label">
            {darkModeOn ? 'Dark mode' : 'Light mode'}
          </span>
        </button>
      </div>

      <main className="auth-content">
        <section className="auth-signin" aria-labelledby="auth-heading">
          <p className="auth-eyebrow">PLAN WITH CLARITY</p>
          <h1 id="auth-heading" className="auth-heading">
            Your day, organized everywhere.
          </h1>
          <p className="auth-supporting">
            A private cross-device workspace for your tasks and Quick Ideas,
            synced through your own Google account.
          </p>

          <SignInError error={signInError} />

          <button
            type="button"
            className="auth-google"
            onClick={() => {
              if (signInError) onClearSignInError?.();
              onSignIn();
            }}
            disabled={isSigningIn}
          >
            <GoogleIcon />
            <span>{isSigningIn ? 'Signing in…' : 'Continue with Google'}</span>
          </button>

          <p className="auth-security">
            <LockIcon />
            <span>Secure sign-in powered by Google.</span>
          </p>
        </section>

        <AuthShowcaseCarousel />
      </main>
    </div>
  );
}
