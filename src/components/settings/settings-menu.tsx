'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { Settings } from 'lucide-react';

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

export default function SettingsMenu() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!settingsOpen) return;

    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setSettingsOpen(false);
    };

    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [settingsOpen]);

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

  return (
    <div
      ref={root}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && settingsOpen) {
          event.preventDefault();
          setSettingsOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="flex h-11 w-11 items-center justify-center text-primary-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Settings"
        title="Settings"
        aria-expanded={settingsOpen}
        aria-controls="accessibility-settings"
        onClick={() => setSettingsOpen((open) => !open)}
      >
        <Settings className="h-7 w-7" />
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
              onChange={(event) => updatePreferences({ textSize: event.target.value as TextSize })}
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
  );
}
