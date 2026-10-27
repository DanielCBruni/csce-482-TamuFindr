'use client';

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from 'react';
import Button from './button';

type MenuContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger: RefObject<HTMLButtonElement | null>;
  id: string;
};
const Context = createContext<MenuContext | null>(null);
function useMenu() {
  const menu = useContext(Context);
  if (!menu) throw new Error('Dropdown components require DropdownMenu.');
  return menu;
}

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  return (
    <Context.Provider value={{ open, setOpen, trigger, id }}>
      <div
        ref={root}
        className="relative"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && open) {
            event.preventDefault();
            setOpen(false);
            trigger.current?.focus();
          }
        }}
      >
        {children}
      </div>
    </Context.Provider>
  );
}

export function DropdownMenuTrigger(props: ComponentProps<typeof Button>) {
  const { open, setOpen, trigger, id } = useMenu();
  return (
    <Button
      {...props}
      ref={trigger}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? id : undefined}
      onClick={() => setOpen(!open)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          setOpen(true);
        }
      }}
    />
  );
}

export function DropdownMenuContent({ children, label }: { children: ReactNode; label: string }) {
  const { open, id } = useMenu();
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) content.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
  }, [open]);
  if (!open) return null;
  return (
    <div
      ref={content}
      id={id}
      role="menu"
      aria-label={label}
      className="absolute right-0 top-full mt-2 min-w-36 rounded-md border border-[var(--surface-border)] bg-[var(--surface-raised)] p-1 text-[var(--text-primary)] shadow-lg"
      onKeyDown={(event) => {
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const items = Array.from(
          event.currentTarget.querySelectorAll<HTMLButtonElement>(
            '[role="menuitem"]:not(:disabled)',
          ),
        );
        const index = items.indexOf(document.activeElement as HTMLButtonElement);
        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? items.length - 1
              : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next]?.focus();
      }}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem(props: ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      type="button"
      variant="menu"
      role="menuitem"
      tabIndex={-1}
      className="w-full rounded text-left hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60"
    />
  );
}
