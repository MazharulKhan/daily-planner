import './styles/layout.css';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import Planner from './components/Planner';
import AuthScreen from './components/AuthScreen';

function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    status,
    user,
    signIn,
    signOut,
    signInError,
    signOutError,
    isSigningIn,
    isSigningOut,
    clearSignInError,
    clearSignOutError,
  } = useAuth();

  if (status === 'initializing') {
    return (
      <AuthScreen
        mode="loading"
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (status === 'signed-out' || !user) {
    return (
      <AuthScreen
        mode="signed-out"
        theme={theme}
        onToggleTheme={toggleTheme}
        onSignIn={signIn}
        isSigningIn={isSigningIn}
        signInError={signInError}
        onClearSignInError={clearSignInError}
      />
    );
  }

  return (
    <Planner
      user={user}
      onSignOut={signOut}
      isSigningOut={isSigningOut}
      signOutError={signOutError}
      onClearSignOutError={clearSignOutError}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}

export default App;