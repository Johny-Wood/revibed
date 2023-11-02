import PropTypes from 'prop-types';

import TermsLink from '@/components/common-ui/links/terms/TermsLink';
import CheckBox from '@/components/ui/inputs/CheckBox';
import { CommonHeadConstants } from '@/constants/common/head';

function PricingPolicyCheckBox({
  id,
  checked,
  anchor,

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
      invalid={error}
      invalidMsg={errorMsg}
      onChange={onChange}
      className={className}
      {...props}
    >
      <span className="c-black">
        I agree with&nbsp;
        {CommonHeadConstants.SITE_NAME}
        &apos;s&nbsp;
        <TermsLink anchor={anchor} />
      </span>
    </CheckBox>
  );
}

PricingPolicyCheckBox.defaultProps = {
  anchor: '',
  error: false,
  errorMsg: '',
  onChange: () => {},
  className: '',
};

PricingPolicyCheckBox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  anchor: PropTypes.string,
  error: PropTypes.bool,
  errorMsg: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default PricingPolicyCheckBox;
