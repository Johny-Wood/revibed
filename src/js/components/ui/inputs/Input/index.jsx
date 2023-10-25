import { Component, createRef, forwardRef } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import Button from '@/components/ui/buttons/Button';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ErrorInputMessage from '@/components/ui/inputs/_components/ErrorInputMessage';
import InputLabel from '@/components/ui/inputs/_components/InputLabel';
import CloseIcon from '@/icons/control/close/CloseIcon';
import SpinIcon from '@/icons/SpinIcon';

import styles from './styles.module.scss';

import InputProps from '../_config/props';
import InputTypes from '../_config/types';

const ListItems = dynamic(() => import('@/components/ui/selects/Select/_components/ListItems'), {
  ssr: false,
});
const InputTags = dynamic(() => import('@/components/ui/inputs/Input/_components/InputTags'), {
  ssr: false,
});

class Input extends Component {
  constructor(props) {
    super(props);

    this.hovered = false;

    this.inputRef = createRef();

    this.blurTimeout = null;

    this.state = {
      activeLabel: false,
      showItems: false,
      focus: false,
    };
  }

  componentDidMount() {
    this.hasValue();
  }

  componentWillUnmount() {
    clearTimeout(this.blurTimeout);
  }

  hasValue = () => {
    const { value } = this.props;

    if (this.fromTypeSelect()) {
      return;
    }

    this.setState({
      activeLabel: !!(value && value !== ''),
    });
  };

  onClickEvent = (e) => {
    const { onClick } = this.props;

    if (this.fromTypeSelect()) {
      return;
    }

    this.setState({
      activeLabel: true,
    });

    onClick(e);
  };

  onBlurEvent = (e) => {
    const { onBlur } = this.props;

    if (!this.hovered) {
      this.blurTimeout = setTimeout(() => {
        this.closeItems();
      }, 100);
    }

    if (this.fromTypeSelect()) {
      return;
    }

    this.setState({
      activeLabel: false,
    });

    onBlur(e);
  };

  onChangeEvent = ({ event, callback = () => {} }) => {
    const { onChange, textInputAllowed, min, max, fractionDigits = 5, typeValue = 'text' } = this.props;

    if (event.target.value) {
      const filteredItems = textInputAllowed ? this.getFilteredItems(event.target.value) : [];

      this.setState(
        {
          showItems: true,
          filteredItems,
        },
        () => {
          callback();
        }
      );
    }

    onChange({
      ...event,
      min,
      max,
      fractionDigits,
      typeValue,
    });
  };

  getFilteredItems = (value) => {
    const { options, textInputAllowed } = this.props;

    return textInputAllowed
      ? options.filter(
          (item) =>
            item.label.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(item.label.toLowerCase())
        )
      : options;
  };

  fromTypeSelect = () => {
    const { fromType } = this.props;

    return fromType === 'select';
  };

  clickItemHandler = (option, removeFlag) => {
    const { clickItemCallback } = this.props;

    clickItemCallback(option, removeFlag);

    if (!removeFlag) {
      this.closeItems();
      this.focusInInput();
    }
  };

  focusInInput = () => {
    if (this.inputRef?.current) {
      this.inputRef.current.focus();
    }
  };

  renderAutoComplete = () => {
    const {
      multiSelected,
      activeItemId,
      searchValueIpt,
      options,
      optionPosition,
      selectedList,
      textInputAllowed,
      listHeight,
      limitShowOptions,
      inProcess,
      withAutoCompleteLocal,
      withAutoComplete,
    } = this.props;

    const { filteredItems, showItems } = this.state;

    return (
      <ListItems
        shown={
          showItems && (withAutoCompleteLocal || (textInputAllowed && !!filteredItems && !!searchValueIpt) || withAutoComplete)
        }
        inProcess={inProcess}
        limitShowOptions={limitShowOptions}
        maxHeight={listHeight}
        multiSelected={multiSelected}
        activeItemId={activeItemId}
        options={(textInputAllowed && searchValueIpt.length > 0 ? filteredItems : options).map(
          ({ id, type, name, optionComponent }) => ({
            id,
            label: name,
            type,
            optionComponent,
          })
        )}
        onClickItem={this.clickItemHandler}
        optionPosition={optionPosition}
        searchValueIpt={searchValueIpt}
        selected={selectedList}
        closeItems={this.closeItems}
        className={styles.selectList}
      />
    );
  };

  showItems = () => {
    const { searchValueIpt, withAutoComplete, withAutoCompleteLocal } = this.props;

    if (withAutoComplete && (searchValueIpt || withAutoCompleteLocal)) {
      this.setState({
        showItems: true,
      });
    }
  };

  closeItems = () => {
    this.setState({
      showItems: false,
    });
  };

  render() {
    const {
      id,
      draggable,
      className,
      inputClassName,
      invalid,
      invalidMessage,
      label,
      children,
      onClick,
      onBlur,
      onFocus,
      onChange,
      value,
      disabled,
      disabledValue,
      unit,
      unitPosition,
      border,
      fromType,
      size,
      type,
      optionPosition,
      optionListPositionX,
      searchValueIpt,
      withAutoComplete,
      classNameBlock,
      options,
      clickItemCallback,
      selectedList,
      textInputAllowed,
      tags,
      innerRef,
      withControl,
      t,
      min,
      max,
      listHeight,
      typeValue,
      fractionDigits,
      withAutoCompleteLocal,
      limitShowOptions,
      labelPosition,
      inProcess,
      classNameTag,
      withResetButton,
      onReset,
      onDraggableSort,
      autoFocus,
      button: {
        active: buttonActive = false,
        text: buttonText,
        className: buttonClassName,
        onClick: buttonOnClick,
        disabled: buttonDisabled,
      } = {},
      ...inputProps
    } = this.props;

    const { activeLabel, focus } = this.state;

    const autoCompleteAttribute =
      type === 'color' ||
      type === 'date' ||
      type === 'datetime-local' ||
      type === 'email' ||
      type === 'month' ||
      type === 'number' ||
      type === 'password' ||
      type === 'range' ||
      type === 'search' ||
      type === 'tel' ||
      type === 'text' ||
      type === 'time' ||
      type === 'url' ||
      type === 'week'
        ? 'new-password'
        : undefined;

    const isInvalidMax = parseInt(value || max, 10) + 1 >= max + 1;
    const isInvalidMin = min === 0 ? false : parseInt(value || 0, 10) <= min;

    const valueMin = isInvalidMin ? min : parseInt(value || min, 10) - 1;
    const valueMax = isInvalidMax ? max : parseInt(value || max, 10) + 1;

    let valueNew = value;

    if (type === 'number') {
      const parseToInt = parseInt(value, 10);
      valueNew = parseToInt >= 0 ? parseToInt : '';
    }

    return (
      <div
        className={classNames(
          'input-block',
          size,
          classNameBlock,
          withControl && 'input_with-control',
          this.fromTypeSelect() && 'from-select',
          label && !this.fromTypeSelect() && 'with-label',
          unit && `with-unit unit_position_${unitPosition}`,
          focus && 'focus',
          disabled && 'disabled',
          disabledValue && 'disabled-value',
          (value || activeLabel || (tags && !isEmpty(selectedList))) && 'active-label',
          invalid && 'error',
          border && 'border',
          `label-position_${labelPosition}`,
          styles.input,
          className
        )}
        onMouseLeave={() => {
          this.hovered = false;
        }}
        onMouseEnter={() => {
          this.hovered = true;
        }}
        onFocus={() => {
          this.hovered = true;

          this.setState({
            focus: true,
          });
        }}
        onBlur={() => {
          this.setState({
            focus: false,
          });
        }}
      >
        <div
          className={classNames('input', inputClassName)}
          onClick={() => {
            this.focusInInput();
            this.showItems();
          }}
        >
          {withControl && (
            <Button
              className="input__control input__control_minus"
              type="button_string"
              disabled={value <= valueMin}
              onClick={() => {
                this.onChangeEvent({
                  event: {
                    target: {
                      id,
                      value: parseInt(value || max, 10) + 1 > max + 1 ? valueMax : valueMin,
                    },
                  },
                });
              }}
            />
          )}
          {tags && (
            <InputTags
              tags={selectedList}
              draggable={draggable}
              disabled={disabled || disabledValue}
              clickItemHandler={this.clickItemHandler}
              onDraggableSort={onDraggableSort}
            />
          )}
          <input
            ref={innerRef || this.inputRef}
            id={id || undefined}
            type={type}
            className={classNames(classNameTag)}
            autoComplete={autoCompleteAttribute}
            onFocus={(event) => {
              onFocus();
              this.onClickEvent(event);
            }}
            onClick={(event) => {
              this.onClickEvent(event);
            }}
            onBlur={this.onBlurEvent}
            onChange={(event) => this.onChangeEvent({ event })}
            value={type !== 'file' ? valueNew : undefined}
            disabled={disabled || disabledValue}
            min={type === 'number' ? min : undefined}
            max={type === 'number' ? max : undefined}
            autoFocus={autoFocus}
            {...inputProps}
          />
          <TransitionSwitchLayout isShown={withResetButton}>
            <ButtonIcon
              className="input__reset-button"
              onClick={(e) => {
                e.stopPropagation();

                this.focusInInput();
                onReset();
              }}
              type="button_string"
              icon={CloseIcon}
              iconColor="white"
            />
          </TransitionSwitchLayout>
          {this.renderAutoComplete()}
          {(label || (label && this.fromTypeSelect() && !activeLabel && !value)) && <InputLabel text={label} inputId={id} />}
          {withControl && (
            <Button
              className="input__control input__control_plus"
              type="button_string"
              disabled={value >= valueMax}
              onClick={() => {
                this.onChangeEvent({
                  event: {
                    target: {
                      id,
                      value: parseInt(value || 0, 10) < min ? valueMin : valueMax,
                    },
                  },
                });
              }}
            />
          )}
        </div>
        {buttonActive && (
          <Button className={buttonClassName} text={buttonText} onClick={buttonOnClick} disabled={buttonDisabled} />
        )}
        {children && children}
        <TransitionLayout isShown={inProcess && !!searchValueIpt}>
          <div className="input-in-process">
            <SpinIcon />
          </div>
        </TransitionLayout>
        {unit && <div className="input-unit">{unit}</div>}
        <ErrorInputMessage invalidMessage={invalidMessage} invalid={invalid} />
      </div>
    );
  }
}

Input.defaultProps = {
  withAutoCompleteLocal: false,
  withControl: false,
  className: '',
  inputClassName: '',
  classNameTag: '',
  onChange: () => {},
  onClick: () => {},
  onReset: () => {},
  fromType: 'input',
  typeValue: 'text',
  fractionDigits: 0,
  limitShowOptions: 0,
  inProcess: false,
  unit: '',
  unitPosition: 'end',
  type: 'text',
  min: 0,
  max: Number.MAX_VALUE,
  withResetButton: false,

  ...InputProps,
};

Input.propTypes = {
  withAutoCompleteLocal: PropTypes.bool,
  withControl: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  classNameTag: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onReset: PropTypes.func,
  fromType: PropTypes.oneOf(['input', 'select']),
  fractionDigits: PropTypes.number,
  limitShowOptions: PropTypes.number,
  typeValue: PropTypes.string,
  inProcess: PropTypes.bool,
  unit: PropTypes.any,
  unitPosition: PropTypes.oneOf(['start', 'end']),
  type: PropTypes.string,
  withResetButton: PropTypes.bool,

  ...InputTypes,
};

export default forwardRef((props, ref) => <Input innerRef={ref} {...props} />);
