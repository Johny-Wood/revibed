import { connect } from 'react-redux';

import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';

import styles from './styles.module.scss';

function DarkBackgroundOverlay({ darkOverlayIsShown }) {
  return (
    <TransitionSwitchLayout isShown={darkOverlayIsShown} duration={200}>
      <div className={styles.darkBackgroundOverlay} />
    </TransitionSwitchLayout>
  );
}

export default connect((state) => ({
  darkOverlayIsShown: state.DarkOverlayReducer.isShown,
}))(DarkBackgroundOverlay);
