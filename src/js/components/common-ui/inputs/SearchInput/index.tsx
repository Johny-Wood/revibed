import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import Button from '@/components/ui/buttons/Button';
import Input from '@/components/ui/inputs/Input';
import CloseIcon from '@/icons/control/close/CloseIcon';
import SearchIcon from '@/icons/SearchIcon';

import styles from './styles.module.scss';

type SearchInputProps = {
  id: string;
  initialValue?: string;
  label?: string;
  disabled?: boolean;
  border?: boolean;
  searched?: boolean;
  autoFocus?: boolean;
  size?: 'small-35' | 'large';
  type?: unknown;

  resetSearch?: () => Promise<unknown>;

  onSearch: (value: string) => Promise<unknown>;
  onFocus?: () => void;
  onBlur?: () => void;

  className?: string;
  inputClassName?: string;
};

const SearchInput = ({
  id,
  initialValue = '',
  resetSearch,
  disabled,
  label = 'Search by artist or album name',
  type,
  border,
  size = 'small-35',
  searched,
  autoFocus,

  onFocus,
  onBlur,
  onSearch,

  className,
  inputClassName,
}: SearchInputProps) => {
  const [value, setValue] = useState<string>(initialValue);

  const canUpdateValue = useRef<boolean>(true);

  const timer = useRef<NodeJS.Timeout>();

  const resetSearchState = useCallback(() => {
    if (resetSearch) {
      canUpdateValue.current = false;

      resetSearch().finally(() => {
        canUpdateValue.current = true;
      });
    }

    setValue('');
  }, [resetSearch]);

  const onSearchAction = useCallback(
    (newValue: string) => {
      if (disabled) {
        return;
      }

      if (newValue.length === 0) {
        resetSearchState();

        return;
      }

      onSearch(newValue);
    },
    [disabled, onSearch, resetSearchState]
  );

  useEffect(() => {
    if (value !== initialValue && initialValue && canUpdateValue.current) {
      setValue(initialValue);
    }
  }, [initialValue, value]);

  return (
    // @ts-ignore
    <Input
      autoComplete="off"
      className={classNames(styles.searchInput, className)}
      inputClassName={classNames(inputClassName)}
      id={id}
      placeholder={label}
      value={value}
      type={type}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        const {
          target: { value: newValue },
        } = e;

        canUpdateValue.current = false;

        clearTimeout(timer.current);

        setValue(newValue);

        timer.current = setTimeout(() => {
          onSearchAction(newValue);
          canUpdateValue.current = true;
        }, 400);
      }}
      disabled={disabled}
      border={border}
      size={size}
      autoFocus={autoFocus}
    >
      <TransitionLayout isShown={!searched}>
        <span className={styles.searchInput__searchUnit}>
          <SearchIcon color="black" />
        </span>
      </TransitionLayout>
      <TransitionLayout isShown={!!searched}>
        {/* @ts-ignore */}
        <Button type="button_string" className={styles.searchInput__buttonSearchReset} onClick={resetSearchState}>
          <CloseIcon />
        </Button>
      </TransitionLayout>
    </Input>
  );
};

export default SearchInput;
