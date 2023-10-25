import PropTypes from 'prop-types';

import CheckBox from '@/components/ui/inputs/CheckBox';

function RipRulesCheckBox({
  id,
  checked,
  disabled,

  error,
  errorMsg,

  className,

  onChange,

  ...props
}) {
  return (
    <CheckBox
      id={id}
      checked={checked}
      disabled={disabled}
      invalid={error}
      invalidMsg={errorMsg}
      onChange={onChange}
      className={className}
      {...props}
    >
      <span className="c-black">I&rsquo;m responsible for the non-proliferation of&nbsp;archive copy</span>
    </CheckBox>
  );
}

RipRulesCheckBox.defaultProps = {
  disabled: false,
  error: false,
  errorMsg: '',
  onChange: () => {},
  className: '',
};

RipRulesCheckBox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  errorMsg: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default RipRulesCheckBox;
