import { useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

import Coin from '@/components/ui/currency/Coin';
import Input from '@/components/ui/inputs/Input';
import ComponentsCommonConstants from '@/constants/components/common';
import { PreviousHook } from '@/hooks/state/PreviousHook';
import TranslateHook from '@/hooks/translate/TranslateHook';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import ArrowIcon from '@/icons/arrows/ArrowIcon';
import SearchIcon from '@/icons/SearchIcon';

import styles from './styles.module.scss';

const ListItems = dynamic(() => import('@/components/ui/selects/Select/_components/ListItems'), {
  ssr: false,
});

function Select({
  autoFocusInputSearch,
  options,
  defaultSelectSectionValue,
  defaultSelectValue,
  id,
  textInputAllowed,
  searchStart,
  onSelectItem,
  onClose,
  onChange,
  openOnly,
  selected,
  type,
  toggled,
  withIcon,
  icon,
  onBlurInput,
  placeholder,
  invalid,
  invalidMsg,
  label,
  disabled,
  dropDown,
  isSort,
  isFilter,
  tKey,
  unit,
  maxHeight,
  multiSelected,
  withDisabledOptions,
  allowedOptions,
  optionPosition,
  placeholderSearch,
  withCloseEnd,
  className,
  optionListPositionX,
  autofill,
  floatLabel,
  isSelected,
  clear,
  itemsPerPage,
}) {
  const t = TranslateHook();
  const { isNotDesktop } = ViewportHook();

  const prevSelected = PreviousHook(selected);
  const prevOptions = PreviousHook(options);

  const selectRef = useRef(null);

  const [searchValueIpt, setSearchValueIpt] = useState('');
  const [showItems, setShowItems] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  const getFilteredItems = useCallback(
    (value) => {
      let filteredItemsTmp = options;

      if (textInputAllowed) {
        if (searchStart) {
          filteredItemsTmp = options.filter(
            ({ label: foundLabel }) => foundLabel.toLowerCase().indexOf(value.toLowerCase()) === 0
          );
        } else {
          filteredItemsTmp = options.filter(
            ({ label: foundLabel }) =>
              label.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(foundLabel.toLowerCase())
          );
        }
      }

      return filteredItemsTmp;
    },
    [label, options, searchStart, textInputAllowed]
  );

  const clickItemHandler = useCallback(
    ({ option: item = {}, sectionName, withCallback = true }) => {
      const iptValueText = item.iptTextOnSelect || item.label || '';

      setShowItems(openOnly);
      setFilteredItems(getFilteredItems(iptValueText));

      onChange({
        target: {
          value: iptValueText,
          id,
        },
      });

      if (!openOnly) {
        onClose(iptValueText);
      }

      if (withCallback) {
        onSelectItem(item, sectionName || id);
      }
    },
    [getFilteredItems, id, onChange, onClose, onSelectItem, openOnly]
  );

  const setDefaultOption = useCallback(() => {
    if (options.length > 0 && defaultSelectValue) {
      clickItemHandler({
        option: defaultSelectValue,
        sectionName: defaultSelectSectionValue,
        withCallback: false,
      });
    }
  }, [clickItemHandler, defaultSelectSectionValue, defaultSelectValue, options.length]);

  useEffect(() => {
    setDefaultOption();
  }, [setDefaultOption]);

  const clearInputFontFoundSearch = () => {
    setSearchValueIpt('');
  };

  const onToggleMenu = ({ newShownItems, callback = () => {} }) => {
    setShowItems(newShownItems);

    callback();
  };

  const checkClickTarget = useCallback(
    (e) => {
      if (!!selectRef.current && !selectRef.current.contains(e.target)) {
        if (isNotDesktop) {
          e.stopPropagation();
          e.preventDefault();
          e.stopImmediatePropagation();
        }

        onToggleMenu({ newShownItems: false });
      }
    },
    [isNotDesktop]
  );

  useEffect(() => {
    if (showItems) {
      document.body.addEventListener('click', checkClickTarget, true);
    } else {
      document.body.removeEventListener('click', checkClickTarget, true);
    }
  }, [checkClickTarget, showItems]);

  const searchInputHandler = ({ target: { value } }) => {
    setSearchValueIpt(value);
    setFilteredItems(getFilteredItems(value));
  };

  const renderItems = () => (
    <ListItems
      shown={
        openOnly || (toggled && (showItems || (showItems && textInputAllowed && !!filteredItems && searchValueIpt.length > 0)))
      }
      selectId={id}
      selected={selected}
      multiSelected={multiSelected}
      withDisabledOptions={withDisabledOptions}
      allowedOptions={allowedOptions}
      options={textInputAllowed && searchValueIpt.length > 0 ? filteredItems : options}
      onClickItem={clickItemHandler}
      optionPosition={optionPosition}
      dropDown={dropDown}
      searchValueIpt={searchValueIpt}
      isSort={isSort || isFilter}
      searchStart={searchStart}
      maxHeight={maxHeight}
      className={styles.selectList}
    >
      {textInputAllowed && (
        <Input
          id="search"
          autoFocus={autoFocusInputSearch}
          className="search-select"
          type={type}
          onClick={(e) => e.stopPropagation()}
          onChange={searchInputHandler}
          value={searchValueIpt}
          placeholder={placeholderSearch}
        >
          <span className="i-search">
            <SearchIcon />
          </span>
        </Input>
      )}
    </ListItems>
  );

  const clickInputHandler = () => {
    if (toggled && (withCloseEnd || !openOnly)) {
      onToggleMenu({
        newShownItems: !showItems,
        callback: () => {
          if (!showItems) {
            clearInputFontFoundSearch();
          }
        },
      });
    }
  };

  const deselect = () => {
    setSearchValueIpt('');
  };

  const renderArrow = (isOpened = false) => {
    if (toggled && !disabled) {
      return (
        <span className="i-arrow">
          <ArrowIcon isOpened={isOpened} size={ComponentsCommonConstants.Size.SMALL} />
        </span>
      );
    }

    return null;
  };

  const renderSelectType = () => {
    if (dropDown) {
      const opened =
        openOnly || (toggled && (showItems || (showItems && textInputAllowed && !!filteredItems && searchValueIpt.length > 0)));

      return (
        <>
          <div className={styles.selectValue}>
            <span className={styles.text}>{renderArrow(opened)}</span>
          </div>
          {renderItems()}
        </>
      );
    }

    if (isSort || isFilter) {
      const opened =
        openOnly || (toggled && (showItems || (showItems && textInputAllowed && !!filteredItems && searchValueIpt.length > 0)));

      return (
        <>
          <div className={styles.selectValue}>
            <span className={styles.text}>
              <span>{t(tKey) || label}</span>
              {unit && (
                <>
                  ,
                  <Coin size={13} />
                </>
              )}
              {withIcon && <span className="i-f_y-center">,{icon}</span>}
            </span>
            {!openOnly && renderArrow(opened)}
          </div>
          {renderItems()}
        </>
      );
    }

    const opened =
      openOnly || (toggled && (showItems || (showItems && textInputAllowed && !!filteredItems && searchValueIpt.length > 0)));

    const { value: selectedValue = '', label: selectedLabel = selectedValue } = selected[0] || {};

    return (
      <>
        <Input
          id={id}
          label={label}
          type={type}
          onBlur={onBlurInput}
          readOnly
          value={selectedLabel}
          placeholder={placeholder}
          invalid={invalid}
          invalidMessage={invalidMsg}
          disabled={disabled}
          fromType="select"
          className={styles.selectValue}
        >
          <>{renderArrow(opened)}</>
        </Input>
        {renderItems()}
      </>
    );
  };

  useEffect(() => {
    if (clear) {
      deselect();
    }
  }, [clear]);

  useEffect(() => {
    if ((!isEmpty(selected) && isEmpty(prevSelected)) || options.length !== prevOptions.length) {
      setDefaultOption();
    }
  }, [selected, prevSelected, options, prevOptions, setDefaultOption]);

  return (
    <div
      className={classNames(
        className,
        styles.select,
        floatLabel && styles.select_floatLabel,
        autofill && styles.select_autofill,
        disabled && styles.select_disabled,
        (showItems && toggled) || showItems || (openOnly && styles.select_selectOpened),
        optionListPositionX === 'left' && styles.select_positionLeft,
        optionListPositionX === 'right' && styles.select_positionRight,
        optionPosition === 'bottom' && styles.select_bottom,
        optionPosition === 'top' && styles.select_top,
        (isFilter || isSort) && styles.select_filterOrSort,
        dropDown && styles.select_dropDown,
        itemsPerPage && styles.select_itemsPerPage,
        itemsPerPage && styles.select_itemsPerPage_big,
        (!isEmpty(selected) || isSelected) && styles.select_selected,
        isSort && styles.select_sort,
        isFilter && styles.select_filter,
        'select'
      )}
      onClick={(e) => {
        e.stopPropagation();

        if (!disabled) {
          clickInputHandler();
        }
      }}
      ref={selectRef}
    >
      {renderSelectType()}
    </div>
  );
}

Select.defaultProps = {
  id: '',
  placeholder: '',
  label: '',
  type: 'text',
  selected: [],
  optionListPositionX: 'left',
  options: [],
  optionPosition: 'bottom',
  onSelectItem: () => {},
  toggled: true,
  textInputAllowed: false,
  onBlurInput: () => {},
  onChange: () => {},
  onClose: () => {},
  disabled: false,

  invalid: false,
  invalidMsg: '',

  withDisabledOptions: false,

  openOnly: false,

  dropDown: false,
  isSort: false,
  isFilter: false,
  clear: false,
  allowedOptions: [],
  withCloseEnd: false,
  itemsPerPage: false,
  isSelected: false,
  unit: '',
};

Select.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  selected: PropTypes.array,
  optionListPositionX: PropTypes.oneOf(['left', 'right']),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      iptTextOnSelect: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      payload: PropTypes.shape,
    })
  ),
  optionPosition: PropTypes.oneOf(['top', 'bottom']),
  onSelectItem: PropTypes.func,
  toggled: PropTypes.bool,
  clear: PropTypes.bool,
  textInputAllowed: PropTypes.bool,
  onBlurInput: PropTypes.func,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  disabled: PropTypes.bool,

  invalid: PropTypes.bool,
  invalidMsg: PropTypes.string,

  openOnly: PropTypes.bool,

  withDisabledOptions: PropTypes.bool,
  dropDown: PropTypes.bool,
  isSort: PropTypes.bool,
  isFilter: PropTypes.bool,
  allowedOptions: PropTypes.array,
  withCloseEnd: PropTypes.bool,
  itemsPerPage: PropTypes.bool,
  isSelected: PropTypes.bool,
  unit: PropTypes.string,
};

export default Select;
