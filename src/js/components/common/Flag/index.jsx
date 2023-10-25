import classNames from 'classnames';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

const Emoji = dynamic(() => import('@/components/common/emoji/Emoji'), { ssr: false });

function Flag({ country, alias, className }) {
  if (!country) {
    return null;
  }

  return (
    <span className={classNames(['flag-icon', className])} title={country}>
      {!!alias && <Emoji shortName={`flag-${alias.toLowerCase()}`} />}
    </span>
  );
}

Flag.defaultProps = {
  country: '',
  alias: '',
  className: '',
};

Flag.propTypes = {
  country: PropTypes.string,
  alias: PropTypes.string,
  className: PropTypes.string,
};

export default Flag;
