import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import '../Input/Input.css';
import './SearchableSelect.css';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  /** A static option list. Use this OR `loadOptions`, not both. */
  options?: SearchableSelectOption[];
  /**
   * Fetches the option list lazily (e.g. a state/country lookup API). Called once, the
   * first time the field is opened, and cached — search after that filters in memory.
   */
  loadOptions?: () => Promise<SearchableSelectOption[]>;
  disabled?: boolean;
  id?: string;
  className?: string;
  emptyMessage?: string;
}

/**
 * A searchable dropdown: type to filter a (possibly API-loaded) option list, pick one
 * with the mouse or keyboard. Reuses the same field chrome as `Input`/`Select` so it
 * drops into any form built with them.
 */
export function SearchableSelect({
  label,
  hint,
  error,
  placeholder = 'Search…',
  value,
  onChange,
  onFocus,
  onBlur,
  options,
  loadOptions,
  disabled = false,
  id,
  className,
  emptyMessage = 'No matches',
}: SearchableSelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement>(null);

  const [loadedOptions, setLoadedOptions] = useState<SearchableSelectOption[] | null>(options ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const allOptions = loadedOptions ?? options ?? [];
  const selected = allOptions.find((option) => option.value === value);

  // Keep the visible text in sync with the selected value once its label is known,
  // without clobbering what the user is actively typing while the list is open.
  useEffect(() => {
    if (!isOpen) setQuery(selected?.label ?? value ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, selected?.label, isOpen]);

  useEffect(() => {
    if (options) setLoadedOptions(options);
  }, [options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen((wasOpen) => {
          if (wasOpen) onBlur?.();
          return false;
        });
        setQuery(selected?.label ?? value ?? '');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.label, value]);

  function ensureOptionsLoaded() {
    if (!loadOptions || loadedOptions !== null || isLoading) return;
    setIsLoading(true);
    setLoadError(null);
    loadOptions()
      .then((result) => setLoadedOptions(result))
      .catch(() => setLoadError('Could not load options'))
      .finally(() => setIsLoading(false));
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle || needle === selected?.label.toLowerCase()) return allOptions;
    return allOptions.filter((option) => option.label.toLowerCase().includes(needle));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOptions, query]);

  function openList() {
    if (disabled) return;
    ensureOptionsLoaded();
    setIsOpen(true);
    setHighlightedIndex(0);
    onFocus?.();
  }

  function selectOption(option: SearchableSelectOption) {
    onChange(option.value);
    setQuery(option.label);
    setIsOpen(false);
    onBlur?.();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      openList();
      return;
    }
    if (!isOpen) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const option = filtered[highlightedIndex];
      if (option) selectOption(option);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setQuery(selected?.label ?? value ?? '');
    }
  }

  return (
    <div ref={rootRef} className={cn('mf-field', 'mf-searchable-select', error && 'mf-field--error', className)}>
      {label && (
        <label className="mf-field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className="mf-field__control">
        <input
          id={fieldId}
          className="mf-field__input"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={`${fieldId}-listbox`}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onFocus={openList}
          onClick={openList}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          aria-invalid={!!error}
        />
        <span className="mf-field__icon mf-field__icon--right">
          {isLoading ? <Loader2 size={16} className="mf-searchable-select__spinner" /> : <ChevronDown size={16} />}
        </span>

        {isOpen && !disabled && (
          <ul id={`${fieldId}-listbox`} role="listbox" className="mf-searchable-select__list">
            {loadError ? (
              <li className="mf-searchable-select__status">{loadError}</li>
            ) : isLoading ? (
              <li className="mf-searchable-select__status">Loading…</li>
            ) : filtered.length === 0 ? (
              <li className="mf-searchable-select__status">{emptyMessage}</li>
            ) : (
              filtered.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  className={cn(
                    'mf-searchable-select__option',
                    index === highlightedIndex && 'mf-searchable-select__option--active',
                    option.value === value && 'mf-searchable-select__option--selected',
                  )}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectOption(option);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {error ? (
        <p className="mf-field__message mf-field__message--error">{error}</p>
      ) : hint ? (
        <p className="mf-field__message">{hint}</p>
      ) : null}
    </div>
  );
}
