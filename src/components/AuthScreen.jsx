import '../styles/auth-screen.css';

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
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.2 14.7 2.2 12 2.2 6.9 2.2 2.8 6.3 2.8 11.5S6.9 20.8 12 20.8c5.2 0 8.7-3.7 8.7-8.9 0-.6-.1-1-.2-1.7H12z"
      />
      <path
        fill="#34A853"
        d="M3.7 7.5l3.2 2.4C7.8 7.9 9.7 6.4 12 6.4c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.2 14.7 2.2 12 2.2 8.4 2.2 5.3 4.3 3.7 7.5z"
        opacity="0"
      />
    </svg>
  );
}

function Brand() {
  return (
    <div className="auth-brand">
      <div className="auth-brand__mark" aria-hidden="true">D</div>
      <div className="auth-brand__name">Daily Planner</div>
    </div>
  );
}

function PreviewCard() {
  // Static decorative preview only. Must not read real localStorage or
  // Firestore data (Phase 6A / Section 6.1 "It must not read real localStorage
  // or Firestore data").
  return (
    <div className="auth-preview" aria-hidden="true">
      <div className="auth-preview__card">
        <div className="auth-preview__heading">
          <span className="auth-preview__dot auth-preview__dot--blue" />
          <span className="auth-preview__title">Today</span>
          <span className="auth-preview__count">3</span>
        </div>
        <div className="auth-preview__row">
          <span className="auth-preview__checkbox" />
          <span className="auth-preview__text">Review quarterly goals</span>
          <span className="auth-preview__meta">High</span>
        </div>
        <div className="auth-preview__row">
          <span className="auth-preview__checkbox" />
          <span className="auth-preview__text">Reply to design thread</span>
          <span className="auth-preview__meta">Med</span>
        </div>
        <div className="auth-preview__row">
          <span className="auth-preview__checkbox auth-preview__checkbox--done" />
          <span className="auth-preview__text auth-preview__text--done">Morning run</span>
          <span className="auth-preview__meta auth-preview__meta--done">Health</span>
        </div>
      </div>
      <div className="auth-preview__card auth-preview__card--idea">
        <div className="auth-preview__idea-tag">Quick Idea</div>
        <div className="auth-preview__idea-text">
          "Write weekly retrospective every Sunday."
        </div>
      </div>
      <div className="auth-preview__card auth-preview__card--youtube">
        <div className="auth-preview__youtube-bar">
          <span className="auth-preview__play" />
          <span className="auth-preview__youtube-title">React performance tips</span>
        </div>
        <div className="auth-preview__progress">
          <span className="auth-preview__progress-fill" />
        </div>
      </div>
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

function SignOutErrorStub() {
  return null;
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

      <div className="auth-content">
        <section className="auth-value">
          <p className="auth-eyebrow">PLAN WITH CLARITY</p>
          <h1 className="auth-heading">Your day, organized everywhere.</h1>
          <p className="auth-supporting">
            A private cross-device workspace for your tasks and Quick Ideas,
            synced through your own Google account.
          </p>
          <ul className="auth-benefits">
            <li>Private workspace for each Google account.</li>
            <li>Tasks and ideas available across devices.</li>
            <li>Existing local planner data remains untouched.</li>
          </ul>
          <div className="auth-preview-wrapper">
            <PreviewCard />
          </div>
        </section>

        <section className="auth-card" aria-label="Sign in">
          <h2 className="auth-card__heading">Welcome to Daily Planner</h2>
          <p className="auth-card__supporting">
            Sign in to continue to your private workspace.
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

          <p className="auth-privacy">
            Your planner data is private to the signed-in account. Daily Planner
            never shares your tasks or ideas.
          </p>
        </section>
      </div>

      <SignOutErrorStub />
    </div>
  );
}