import { Fragment, useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import newMobileMenuAnimation from '@/assets/styles/animations/new-mobile-menu.module.scss';
import ScrollbarLayout from '@/components/layouts/ScrollbarLayout';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import Button from '@/components/ui/buttons/Button';
import { CommonMessagesConstants } from '@/constants/common/message';
import TranslateHook from '@/hooks/translate/TranslateHook';
import OkIcon from '@/icons/OkIcon';

const ListItems = ({
  options = [],
  selectId = 'select',
  children,
  maxHeight = 199,
  shown,
  closeItems,
  onClickItem,
  allowedOptions,
  selected,
  withDisabledOptions,
  searchValueIpt,
  searchStart,
  className,
}) => {
  const t = TranslateHook();

  const [focusedOption, setFocusedOption] = useState(-1);

  const resetFocusOption = useCallback(() => {
    setFocusedOption(-1);
  }, []);

  const setFocusOptionNext = useCallback(() => {
    const newFocusedOption = focusedOption + (focusedOption < options.length ? 1 : 0);

    setFocusedOption(newFocusedOption !== focusedOption && focusedOption !== options.length ? newFocusedOption : -1);
  }, [focusedOption, options.length]);

  const setFocusOptionPrev = useCallback(() => {
    const newFocusedOption = focusedOption - (focusedOption >= 0 ? 1 : 0);

    setFocusedOption(newFocusedOption !== focusedOption && focusedOption !== -1 ? newFocusedOption : options.length);
  }, [focusedOption, options.length]);

  const onClick = useCallback(
    ({ option, sectionName }) => {
      onClickItem({ option, sectionName });
    },
    [onClickItem]
  );

  const keyUpListener = useCallback(
    (e) => {
      const { keyCode } = e;

      switch (keyCode) {
        case 38: {
          e.stopPropagation();
          e.preventDefault();
          setFocusOptionPrev();
          break;
        }
        case 40: {
          e.stopPropagation();
          e.preventDefault();
          setFocusOptionNext();
          break;
        }
        case 13: {
          e.stopPropagation();
          e.preventDefault();

          const option = options[focusedOption];

          if (option) {
            const { type, sectionName = type } = option || {};

            onClick({ option, sectionName });
          }

          break;
        }
        case 27: {
          e.stopPropagation();
          e.preventDefault();
          if (closeItems) {
            closeItems();
          }
          break;
        }
        default:
          break;
      }
    },
    [closeItems, focusedOption, onClick, options, setFocusOptionNext, setFocusOptionPrev]
  );

  const addListeners = useCallback(() => {
    document.addEventListener('keydown', keyUpListener, false);
  }, [keyUpListener]);

  const removeListeners = useCallback(() => {
    document.removeEventListener('keydown', keyUpListener, false);
  }, [keyUpListener]);

  const renderOption = useCallback(
    ({
      key,
      disabled,
      optionId,
      label = '',
      tKey,
      idx,
      option,
      labelRender: LabelRender = () => null,
      labelRenderProps = {},
      type,
      sectionName,
      optionComponent,
    }) => {
      const fullOptionId = `${optionId}${sectionName || type || ''}`;

      const isSelected =
        !disabled &&
        selected.findIndex(
          ({ id: selectedId, type: selectedType, sectionName: selectedSectionName }) =>
            `${selectedId}${selectedSectionName || selectedType || ''}` === fullOptionId
        ) > -1;

      const text =
        searchValueIpt && !!label
          ? label.replace(
              new RegExp(searchValueIpt.replace(/[\\[\]{}/()*+?.^$|-]/g, '\\$&'), !searchStart ? 'ig' : 'i'),
              (match) => `<b>${match}</b>`
            )
          : label;

      const textRender = t(tKey) || parse(text) || '';

      return (
        <div key={key} className={classNames(['select-option-item', isSelected && 'selected'])}>
          <Button
            focused={focusedOption === idx}
            disabled={disabled || (withDisabledOptions && !allowedOptions.includes(+option.value))}
            className="select-option"
            onClick={(e) => {
              e.stopPropagation();
              onClick({ option, sectionName });
            }}
          >
            {!!optionComponent && optionComponent}
            <LabelRender {...labelRenderProps} />
            {!!textRender && !optionComponent && <span className="text">{textRender}</span>}
          </Button>
          {isSelected && (
            <div className="i-selected">
              <OkIcon />
            </div>
          )}
        </div>
      );
    },
    [allowedOptions, focusedOption, onClick, searchStart, searchValueIpt, selected, t, withDisabledOptions]
  );

  const renderOptionsList = useCallback(
    ({ options: optionsList = [], sectionNameProp = '' }) =>
      optionsList.map((option, idx) => {
        const {
          id: optionId,
          disabled,
          tKey,
          label,
          labelRender,
          labelRenderProps,
          sectionName,
          type,
          items = [],
          optionComponent,
        } = option;

        const key = `key-select-${optionId || ''}${sectionNameProp || sectionName || type || ''}${selectId || ''}`;

        if (sectionName) {
          return (
            <Fragment key={key}>
              <div className="select-option-item select-option-section">
                <b>{t(sectionName)}</b>
              </div>
              {renderOptionsList({ options: items, sectionNameProp: sectionName })}
            </Fragment>
          );
        }

        return renderOption({
          disabled,
          optionId,
          label,
          tKey,
          idx,
          option,
          labelRender,
          labelRenderProps,
          sectionName: sectionNameProp,
          key,
          type,
          optionComponent,
        });
      }),
    [renderOption, selectId, t]
  );

  useEffect(
    () => () => {
      removeListeners();
    },
    [removeListeners]
  );

  useEffect(() => {
    if (options) {
      resetFocusOption();
    }
  }, [options, resetFocusOption]);

  useEffect(() => {
    if (shown) {
      addListeners();
    } else {
      removeListeners();
    }
  }, [addListeners, removeListeners, shown]);

  return (
    <TransitionSwitchLayout
      isShown={shown}
      duration={240}
      animationClassNames={{
        enter: newMobileMenuAnimation.newMobileMenuAnimationEnter,
        enterActive: newMobileMenuAnimation.newMobileMenuAnimationEnter_active,
        exit: newMobileMenuAnimation.newMobileMenuAnimationExit,
        exitActive: newMobileMenuAnimation.newMobileMenuAnimationExit_active,
      }}
    >
      <div className={classNames(className)}>
        {children}
        <ScrollbarLayout maxHeight={maxHeight} contentLength={options.length}>
          {options.length <= 0 && (
            <div className="select-option-item">
              <div className="select-option select-option_no-item">{CommonMessagesConstants.NO_ITEMS}</div>
            </div>
          )}
          {renderOptionsList({ options })}
        </ScrollbarLayout>
      </div>
    </TransitionSwitchLayout>
  );
};

ListItems.defaultProps = {
  options: [],
  selected: [],
  allowedOptions: [],
  onClickItem: () => {},
};

ListItems.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      iptTextOnSelect: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      payload: PropTypes.shape,
    })
  ),
  selected: PropTypes.array,
  allowedOptions: PropTypes.array,
  onClickItem: PropTypes.func,
};

export default ListItems;
