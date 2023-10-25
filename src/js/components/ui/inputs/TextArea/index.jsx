import { Component } from 'react';

import autosize from 'autosize';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import ErrorInputMessage from '@/components/ui/inputs/_components/ErrorInputMessage';
import InputLabel from '@/components/ui/inputs/_components/InputLabel';

import styles from './styles.module.scss';

import InputProps from '../_config/props';
import InputTypes from '../_config/types';

export default class TextArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLabel: false,
      focus: false,
    };
  }

  componentDidMount() {
    this.hasValue();

    autosize(this.textarea);
  }

  componentDidUpdate(prevProps) {
    const { resetSize } = this.props;
    const { resetSize: resetSizePrev } = prevProps;

    if (resetSize !== resetSizePrev) {
      autosize.update(this.textarea);
    }
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

  onBlurEvent = (event) => {
    const { onBlur } = this.props;

    this.hasValue();

    onBlur(event);
  };

  focusInInput = () => {
    if (this.textarea) {
      this.textarea.focus();
    }
  };

  render() {
    const {
      id,
      className,
      invalid,
      invalidMessage,
      label,
      children,
      onClick,
      onBlur,
      value,
      disabled,
      disabledValue,
      border,
      resetSize,
      size,
      optionPosition,
      optionListPositionX,
      searchValueIpt,
      withAutoComplete,
      classNameBlock,
      options,
      selectedList,
      replayAuthor,
      labelPosition,
      ...textAreaProps
    } = this.props;

    const { activeLabel, focus } = this.state;

    return (
      <div
        className={classNames(
          'input-block',
          'textarea-block',
          classNameBlock,
          size,
          label && 'with-label',
          focus && 'focus',
          disabled && 'disabled',
          disabledValue && 'disabled-value',
          (value || activeLabel) && 'active-label',
          invalid && 'error',
          border && 'border',
          replayAuthor && 'replay-author',
          className,
          `label-position_${labelPosition}`
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
      >
        <div
          className="input"
          onClick={() => {
            this.focusInInput();
          }}
        >
          <textarea
            id={id}
            ref={(textarea) => {
              this.textarea = textarea;
            }}
            className={classNames(className, styles.textarea)}
            {...textAreaProps}
            onClick={(event) => this.onClickEvent(event)}
            onBlur={(event) => this.onBlurEvent(event)}
            value={value}
            disabled={disabled || disabledValue}
          />
          {children && children}
          {label && <InputLabel text={label} inputId={id} />}
        </div>
        <ErrorInputMessage invalidMessage={invalidMessage} invalid={invalid} />
      </div>
    );
  }
}

TextArea.defaultProps = {
  className: '',
  replayAuthor: '',
  children: null,
  value: '',
  onChange: () => {},
  onClick: () => {},

  ...InputProps,
};

TextArea.propTypes = {
  className: PropTypes.string,
  replayAuthor: PropTypes.string,
  children: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,

  ...InputTypes,
};
