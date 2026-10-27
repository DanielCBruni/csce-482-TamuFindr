'use client';

import Link from 'next/link';
import AccountMenu from '@/components/account-menu/account-menu';
import { usePathname } from 'next/navigation';
import { startTransition, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type TextSize = 'standard' | 'large' | 'largest';

type Preferences = {
  theme: Theme;
  textSize: TextSize;
  highContrast: boolean;
};

const PREFERENCES_KEY = 'tamufindr-preferences';

const DEFAULT_PREFERENCES: Preferences = {
  theme: 'light',
  textSize: 'standard',
  highContrast: false,
};

function loadPreferences(): Preferences {
  try {
    const stored = window.localStorage.getItem(PREFERENCES_KEY);
    if (!stored) return DEFAULT_PREFERENCES;

    const saved = JSON.parse(stored) as Partial<Preferences>;
    const theme: Theme = saved.theme === 'dark' ? 'dark' : 'light';
    const textSize: TextSize =
      saved.textSize === 'large' || saved.textSize === 'largest' ? saved.textSize : 'standard';
    return {
      theme,
      textSize,
      highContrast: saved.highContrast === true,
    };
  } catch {
    window.localStorage.removeItem(PREFERENCES_KEY);
    return DEFAULT_PREFERENCES;
  }
}

export default function Header({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    startTransition(() => setPreferences(loadPreferences()));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = preferences.theme;
    root.dataset.contrast = preferences.highContrast ? 'high' : 'standard';
    root.dataset.textSize = preferences.textSize;
  }, [preferences]);

  const updatePreferences = (updates: Partial<Preferences>) => {
    const nextPreferences = { ...preferences, ...updates };
    setPreferences(nextPreferences);
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(nextPreferences));
  };

  const linkClass = (path: string) => {
    const baseClass = 'text-[1.05rem] font-semibold no-underline transition-colors py-1';
    const isActive = pathname === path;
    return `${baseClass} ${isActive ? 'text-accent border-b-2 border-accent' : 'text-primary-muted hover:text-primary'}`;
  };

  return (
    <header className="sticky top-0 z-50 grid min-h-16.25 w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 border-b border-[var(--surface-border)] bg-[var(--surface-header)] px-4 py-3 shadow-sm box-border md:grid-cols-[1fr_auto_1fr] md:px-7 md:py-4.5">
      {/* Left side - branding */}
      <Link
        href="/"
        className="col-start-1 row-start-1 flex flex-col justify-center hover:opacity-80"
      >
        <div className="text-[0.65rem] tracking-[0.12em] text-primary-muted font-bold whitespace-nowrap leading-tight">
          TEXAS A&M UNIVERSITY
        </div>
        <div className="text-xl font-extrabold text-primary tracking-tight leading-tight">
          TAMUfindr
        </div>
      </Link>

      {/* Middle - navbar */}
      <nav
        className="col-span-2 row-start-2 mx-auto flex flex-wrap items-center justify-center gap-x-5.5 gap-y-2 md:col-span-1 md:col-start-2 md:row-start-1"
        aria-label="Main navigation"
      >
        <Link href="/home" className={linkClass('/home')}>
          Home
        </Link>
        <Link href="/report" className={linkClass('/report')}>
          Report
        </Link>
        <Link href="/activity" className={linkClass('/activity')}>
          Activity
        </Link>
        <Link href="/potential-matches" className={linkClass('/potential-matches')}>
          Potential Matches
        </Link>
        <Link href="/help" className={linkClass('/help')}>
          Help
        </Link>
      </nav>

      <div className="relative col-start-2 row-start-1 flex items-center gap-2 justify-self-end md:col-start-3">
        <div>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-primary-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Settings"
            title="Settings"
            aria-expanded={settingsOpen}
            aria-controls="accessibility-settings"
            onClick={() => setSettingsOpen((open) => !open)}
          >
            <svg aria-hidden="true" className="h-7 w-7 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M10.25 2.5a1 1 0 0 1 .98-.8h1.54a1 1 0 0 1 .98.8l.33 1.58c.56.16 1.08.38 1.56.65l1.4-.82a1 1 0 0 1 1.26.14l1.09 1.09a1 1 0 0 1 .14 1.26l-.82 1.4c.27.48.49 1 .65 1.56l1.58.33a1 1 0 0 1 .8.98v1.54a1 1 0 0 1-.8.98l-1.58.33c-.16.56-.38 1.08-.65 1.56l.82 1.4a1 1 0 0 1-.14 1.26l-1.09 1.09a1 1 0 0 1-1.26.14l-1.4-.82c-.48.27-1 .49-1.56.65l-.33 1.58a1 1 0 0 1-.98.8h-1.54a1 1 0 0 1-.98-.8l-.33-1.58c-.56-.16-1.08-.38-1.56-.65l-1.4.82a1 1 0 0 1-1.26-.14l-1.09-1.09a1 1 0 0 1-.14-1.26l.82-1.4c-.27-.48-.49-1-.65-1.56l-1.58-.33a1 1 0 0 1-.8-.98v-1.54a1 1 0 0 1 .8-.98l1.58-.33c.16-.56.38-1.08.65-1.56l-.82-1.4a1 1 0 0 1 .14-1.26l1.09-1.09a1 1 0 0 1 1.26-.14l1.4.82c.48-.27 1-.49 1.56-.65l.33-1.58zM12 8.75a3.25 3.25 0 1 0 0 6.5a3.25 3.25 0 0 0 0-6.5z"
              />
            </svg>
          </button>
          {settingsOpen && (
            <section
              id="accessibility-settings"
              className="settings-panel absolute right-0 top-full mt-2 w-72 rounded-md border border-[var(--surface-border)] bg-[var(--surface-raised)] p-4 text-[var(--text-primary)]"
              aria-label="Display and accessibility settings"
            >
              <div>
                <p className="mb-2 text-sm font-semibold">Color theme</p>
                <div className="grid grid-cols-2 gap-1" role="group" aria-label="Color theme">
                  {(['light', 'dark'] as const).map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      className={`rounded border px-2 py-1.5 text-xs capitalize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${preferences.theme === theme ? 'bg-primary text-white' : 'hover:bg-accent/10'}`}
                      aria-pressed={preferences.theme === theme}
                      onClick={() => updatePreferences({ theme })}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <label className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold">
                Text size
                <select
                  className="rounded border border-[var(--surface-border)] bg-[var(--surface)] px-2 py-1.5 font-normal"
                  value={preferences.textSize}
                  onChange={(event) =>
                    updatePreferences({ textSize: event.target.value as TextSize })
                  }
                >
                  <option value="standard">Standard</option>
                  <option value="large">Large</option>
                  <option value="largest">Largest</option>
                </select>
              </label>

              <label className="mt-3 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={preferences.highContrast}
                  onChange={(event) => updatePreferences({ highContrast: event.target.checked })}
                />
                High contrast
              </label>
            </section>
          )}
        </div>
        <AccountMenu signedIn={signedIn} />
      </div>
    </header>
  );
}
