import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import type { RootState } from '@/js/redux/reducers';

import styles from './styles.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

type DarkBackgroundOverlayProps = PropsFromRedux;

function DarkBackgroundOverlay({ darkOverlayIsShown }: DarkBackgroundOverlayProps) {
  return (
    <TransitionSwitchLayout isShown={darkOverlayIsShown} duration={200}>
      <div className={styles.darkBackgroundOverlay} />
    </TransitionSwitchLayout>
  );
}

const connector = connect((state: RootState) => ({
  darkOverlayIsShown: state.DarkOverlayReducer.isShown,
}));

export default connector(DarkBackgroundOverlay);
