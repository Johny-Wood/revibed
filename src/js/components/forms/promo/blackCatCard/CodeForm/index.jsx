import { connect } from 'react-redux';

import ActivatedMessage from '@/components/forms/promo/blackCatCard/CodeForm/_components/ActivatedMessage';
import IssuedCode from '@/components/forms/promo/blackCatCard/CodeForm/_components/IssuedCode';
import MakeCodeButton from '@/components/forms/promo/blackCatCard/CodeForm/_components/MakeCodeButton';

import styles from './styles.module.scss';

function BlackCatCardCodeForm({ promoInfo: { lastOutCode, lastInCode } = {} }) {
  const renderForm = () => {
    if (lastInCode) {
      return <ActivatedMessage />;
    }

    if (lastOutCode) {
      const { code } = lastOutCode;

      return <IssuedCode code={code} />;
    }

    return <MakeCodeButton />;
  };

  return <div className={styles.blackCatCardCodeForm}>{renderForm()}</div>;
}

export default connect((state) => ({
  promoInfo: state.PromoReducer.promoActions.BLACK_CAT_CARD,
}))(BlackCatCardCodeForm);
