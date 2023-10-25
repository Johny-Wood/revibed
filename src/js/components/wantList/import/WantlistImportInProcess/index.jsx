import { connect } from 'react-redux';

import WantListImportBotConnectionDescription from '@/components/wantList/import/WantListImportBotConnectionDescription';
import WantListImportText from '@/components/wantList/import/WantListImportText';
import ProcessIcon from '@/icons/ProcessIcon';

import styles from './styles.module.scss';

function WantlistImportInProcess({ variablesList: { WANTLIST_MAX_PROCESS_TIME_HOURS = 72 } = {} }) {
  return (
    <div className={styles.wantListImportInProcess}>
      <div className={styles.wantListImportInProcess__spinProcess}>
        <ProcessIcon />
      </div>
      <WantListImportText>
        Your Wantlist will become available as&nbsp;soon as&nbsp;all data has been processed.
      </WantListImportText>
      <WantListImportText className="c-gray-2">
        The time it&nbsp;takes to&nbsp;process your Wantlist depends on&nbsp;the size and number of&nbsp;requests. It&nbsp;may
        take up&nbsp;to&nbsp;
        {WANTLIST_MAX_PROCESS_TIME_HOURS}
        &nbsp;hours. You should start receiving notifications within 2&nbsp;hours of&nbsp;connecting.
      </WantListImportText>
      <WantListImportBotConnectionDescription />
    </div>
  );
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
}))(WantlistImportInProcess);
