import { Component, createRef } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import phone164 from 'phone';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import PhoneInput from 'react-phone-number-input/input';

import ErrorInputMessage from '@/components/ui/inputs/_components/ErrorInputMessage';
import InputLabel from '@/components/ui/inputs/_components/InputLabel';

import InputProps from '../_config/props';
import InputTypes from '../_config/types';

class CustomInputMask extends Component {
  constructor(props) {
    super(props);

    this.inputRef = createRef();

    this.state = {
      activeLabel: false,
      focus: false,
    };
  }

  componentDidMount() {
    this.hasValue();
  }

  hasValue = () => {
    const { value } = this.props;

    this.setState({
      activeLabel: !!value,
    });
  };

  onClickEvent = (event) => {
    const { onClick } = this.props;

    this.setState({
      activeLabel: true,
    });

    onClick(event);
  };

  onChangeEvent = (event) => {
    const { onChange } = this.props;

    this.setState({
      activeLabel: true,
    });

    onChange(event);
  };

  onBlurEvent = (event) => {
    const { onBlur } = this.props;

    this.hasValue();

    onBlur(event);
  };

  fromTypeSelect = () => {
    const { fromType } = this.props;

    return fromType === 'select';
  };

  callValidateCallback = (isValid, format) => {
    const { isValidCallback } = this.props;

    isValidCallback(isValid, format);
  };

  render() {
    const {
      id,
      label,
      className,
      invalid,
      invalidMessage,
      unitPosition,
      onClick,
      onBlur,
      onChange,
      value,
      disabled,
      disabledValue,
      size,
      classNameBlock,
      withControl,
      unit,
      tags,
      border,
      selectedList,
      withAutoComplete,
      optionListPositionX,
      optionPosition,
      type,
      labelPosition,
      isValidCallback,
      maskChar,
      min,
      max,
      ...inputProps
    } = this.props;

    const { activeLabel, focus } = this.state;

    return (
      <div
        className={classNames(
          'input-block',
          size,
          classNameBlock,
          withControl ? 'input_with-control' : '',
          this.fromTypeSelect() && 'from-select',
          label && !this.fromTypeSelect() && 'with-label',
          unit && 'with-unit',
          focus && 'focus',
          disabled && 'disabled',
          disabledValue && 'disabled-value',
          (value || activeLabel || (tags && !isEmpty(selectedList))) && 'active-label',
          invalid ? 'error' : '',
          border ? 'border' : '',
          `label-position_${labelPosition}`,
          className
        )}
        onFocus={() => {
          this.setState({
            focus: true,
          });
        }}
        onBlur={() => {
          this.setState({
            focus: false,
          });
        }}
        onClick={() => {
          if (this.inputRef?.current) {
            this.inputRef.current.focus();

            this.setState({
              activeLabel: true,
            });
          }
        }}
      >
        <div className="input">
          {type === 'phone' ? (
            <PhoneInput
              ref={this.inputRef}
              id={id}
              className={className}
              onChange={(phone = '') => {
                const { isValid } = phone164(phone, { country: '' }) || {};

                this.callValidateCallback(isValid);
                this.onChangeEvent({
                  target: {
                    value: phone,
                    id,
                  },
                });
              }}
              onClick={(event) => this.onClickEvent(event)}
              onBlur={(event) => this.onBlurEvent(event)}
              value={value}
              disabled={disabled || disabledValue}
              {...inputProps}
            />
          ) : (
            <InputMask
              id={id}
              className={className}
              autoComplete="new-password"
              onClick={(event) => this.onClickEvent(event)}
              onBlur={(event) => this.onBlurEvent(event)}
              onChange={(event) => this.onChangeEvent(event)}
              value={type !== 'number' ? value : parseInt(value, 10) || ''}
              disabled={disabled || disabledValue}
              maskChar={maskChar}
              min={min}
              max={max}
              {...inputProps}
            />
          )}
          {label && <InputLabel text={label} inputId={id} />}
        </div>
        <ErrorInputMessage invalid={invalid} invalidMessage={invalidMessage} />
      </div>
    );
  }
}

CustomInputMask.defaultProps = {
  className: '',
  children: null,
  unit: '',
  unitPosition: 'end',
  onChange: () => {},
  onClick: () => {},
  type: 'text',
  min: 0,
  max: Number.MAX_VALUE,

  ...InputProps,
};

CustomInputMask.propTypes = {
  className: PropTypes.string,
  children: PropTypes.object,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  unit: PropTypes.any,
  unitPosition: PropTypes.oneOf(['start', 'end']),
  type: PropTypes.string,

  ...InputTypes,
};

export default CustomInputMask;
