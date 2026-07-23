import { type InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import './SearchBar.css';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function SearchBar({ className, placeholder = 'Search…', ...rest }: SearchBarProps) {
  return (
    <label className={cn('mf-search', className)}>
      <Search size={16} className="mf-search__icon" />
      <input className="mf-search__input" type="search" placeholder={placeholder} {...rest} />
    </label>
  );
}
