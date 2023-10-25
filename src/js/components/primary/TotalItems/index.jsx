import classNames from 'classnames';
import PropTypes from 'prop-types';

function TotalItems({ className, size, total, totalPages, currentPage }) {
  if (totalPages <= 0 || totalPages <= currentPage) {
    return null;
  }

  return (
    <div className={classNames([className, 'c-gray-2'])}>
      {currentPage * size + 1}&nbsp;-&nbsp;{Math.min(currentPage * size + size, total)}&nbsp;of&nbsp;
      {total}
    </div>
  );
}

TotalItems.defaultProps = {
  totalPages: 0,
};

TotalItems.propTypes = {
  total: PropTypes.number.isRequired,
  totalPages: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
};

export default TotalItems;
