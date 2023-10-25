import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import Button from '@/components/ui/buttons/Button';
import { applyProjectsFilterAction } from '@/redux-actions/projects/projectsActions';

import styles from './styles.module.scss';

function ApplyFilterButton({
  positionTop,
  isShown,
  onClick,
  location,
  disabled,

  filterApplyAction,
}) {
  return (
    <TransitionSwitchLayout name="fade" isShown={isShown} duration={300}>
      <Button
        type="button_tooltip"
        className={styles.buttonApplyFilter}
        text="Show"
        style={{ transform: `translateY(${positionTop}px)` }}
        onClick={() => {
          filterApplyAction(location);

          onClick();
        }}
        disabled={disabled}
      />
    </TransitionSwitchLayout>
  );
}

ApplyFilterButton.defaultProps = {
  location: '',
  positionTop: 0,
  isShown: false,
  onClick: () => {},
};

ApplyFilterButton.propTypes = {
  location: PropTypes.string,
  positionTop: PropTypes.number,
  isShown: PropTypes.bool,
  onClick: PropTypes.func,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    filterApplyAction: (location) => {
      dispatch(applyProjectsFilterAction(location));
    },
  })
)(ApplyFilterButton);
