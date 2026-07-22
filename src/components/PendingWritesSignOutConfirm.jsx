import { useEffect, useId, useRef } from 'react';
import '../styles/cloud-sync.css';

export default function PendingWritesSignOutConfirm({ open, onKeepSyncing, onSignOutAnyway }) {
  const dialogRef = useRef(null);
  const keepRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    keepRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onKeepSyncing();
        return;
      }
      if (event.key !== 'Tab') return;
      const buttons = dialogRef.current?.querySelectorAll('button:not([disabled])');
      if (!buttons?.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [open, onKeepSyncing]);

  if (!open) return null;

  return (
    <div className="pending-signout__overlay">
      <div
        ref={dialogRef}
        className="pending-signout__dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId}>Changes are still syncing. Sign out anyway?</h2>
        <p>Signing out now may leave these task changes unconfirmed by the cloud.</p>
        <div className="pending-signout__actions">
          <button ref={keepRef} type="button" onClick={onKeepSyncing}>
            Keep syncing
          </button>
          <button type="button" className="pending-signout__danger" onClick={onSignOutAnyway}>
            Sign out anyway
          </button>
        </div>
      </div>
    </div>
  );
}
