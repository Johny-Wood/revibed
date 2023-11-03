import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

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
  searchUnitClassName?: string;
  searchResetClassName?: string;
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
  searchUnitClassName,
  searchResetClassName,
}: SearchInputProps) => {
  const [value, setValue] = useState<string>(initialValue);

  const inputRef = useRef<HTMLInputElement>(null);

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
      ref={inputRef}
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
      {searched ? (
        // @ts-ignore
        <Button
          type="button_string"
          className={classNames(styles.searchInput__buttonSearchReset, searchResetClassName)}
          onClick={() => {
            resetSearchState();
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          <CloseIcon />
        </Button>
      ) : (
        <span className={classNames(styles.searchInput__searchUnit, searchUnitClassName)}>
          <SearchIcon color="black" />
        </span>
      )}
    </Input>
  );
};

export default SearchInput;
