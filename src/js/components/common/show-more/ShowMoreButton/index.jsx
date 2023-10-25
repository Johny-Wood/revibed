import classNames from 'classnames';
import PropTypes from 'prop-types';

import Button from '@/components/ui/buttons/Button';
import ArrowIcon from '@/icons/arrows/ArrowIcon';

import styles from './styles.module.scss';

function ShowMoreButton({ className, shown, isOpened, withButtonArrow, showedMore, setShowedMore }) {
  if (!shown) {
    return null;
  }

  return (
    <Button
      type="button_string"
      className={classNames(styles.showMoreButton, className)}
      text={`Show ${showedMore ? 'less' : 'more'}`}
      onClick={() => {
        if (!setShowedMore) {
          return;
        }

        setShowedMore(!showedMore);
      }}
    >
      {withButtonArrow && <ArrowIcon isOpened={isOpened} size="small" />}
    </Button>
  );
}

ShowMoreButton.defaultProps = {
  shown: false,
  withButtonArrow: false,
  showedMore: false,
  setShowedMore: null,
};

ShowMoreButton.propTypes = {
  shown: PropTypes.bool,
  withButtonArrow: PropTypes.bool,
  showedMore: PropTypes.bool,
  setShowedMore: PropTypes.func,
};

export default ShowMoreButton;
