import classNames from 'classnames';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import LinkRoute from '@/components/ui/links/LinkRoute';
import ToolTip from '@/components/ui/ToolTip';
import WantListImportByDiscogsCSVFile from '@/components/wantList/import/steps/WantListImportByDiscogsCSVFile';
import WantListImportByDiscogsUserName from '@/components/wantList/import/steps/WantListImportByDiscogsUserName';
import WantListLogInWithDiscogs from '@/components/wantList/import/steps/WantListLogInWithDiscogs';
import WantListImportBotConnectionDescription from '@/components/wantList/import/WantListImportBotConnectionDescription';
import WantListImportText from '@/components/wantList/import/WantListImportText';
import WantListImportWrapper from '@/components/wantList/import/WantListImportWrapper';
import { CommonHeadConstants } from '@/constants/common/head';
import { RoutePathsConstants } from '@/constants/routes/routes';

import styles from './styles.module.scss';

function WantListImportForm({
  title = '',
  tooltipText = '',
  importByDiscogs,
  callbackImport = () => {},

  variablesList: { WANTLIST_MAX_PROCESS_TIME_HOURS = 72 } = {},
}) {
  return (
    <div className={classNames(styles.formWantListImport, globalStyles.breakWord)}>
      <div className="h4 m-bottom-30 f-y-center">
        <b>{title}</b>
        <ToolTip text={tooltipText} color="blue" />
      </div>
      <WantListImportText>
        Use one of&nbsp;three ways to&nbsp;import** your Discogs Wantlist to&nbsp;
        {CommonHeadConstants.SITE_NAME}:
      </WantListImportText>
      <div className={classNames(styles.formWantListImport__steps, 'column-3')}>
        <WantListImportWrapper
          callbackImport={callbackImport}
          component={WantListLogInWithDiscogs}
          componentProps={{
            importByDiscogs,
          }}
        />
        <WantListImportWrapper component={WantListImportByDiscogsUserName} />
        <WantListImportWrapper component={WantListImportByDiscogsCSVFile} />
      </div>
      <WantListImportText>
        *Certain features are not available in&nbsp;beta mode. Find out&nbsp;
        <LinkRoute href={RoutePathsConstants.FAQ} text="more" className="c-blue" />
        .
        <br />
        **The time it&nbsp;takes to&nbsp;process your Wantlist depends on&nbsp;the size and number of&nbsp;requests. It&nbsp;may
        take up&nbsp;to&nbsp;
        {WANTLIST_MAX_PROCESS_TIME_HOURS}
        &nbsp;hours.
      </WantListImportText>
      <WantListImportBotConnectionDescription />
    </div>
  );
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
}))(WantListImportForm);
