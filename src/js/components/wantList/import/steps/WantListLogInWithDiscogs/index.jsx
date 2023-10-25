import { Component } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import WantListImportStep from '@/components/wantList/import/WantListImportStep';
import LogInWithDiscogs from '@/components/wantList/login/LogInWithDiscogs';
import ComponentsCommonConstants from '@/constants/components/common';
import UpdateCircleArrowIcon from '@/icons/arrows/UpdateCircleArrowIcon';

import styles from './styles.module.scss';

class WantListLogInWithDiscogs extends Component {
  componentDidMount() {
    const { callbackImportWantList = () => {}, importByDiscogs } = this.props;

    if (importByDiscogs) {
      callbackImportWantList([], { importType: 'connect_discogs' });
    }
  }

  disabledImport = () => {
    const { inProcess, discogsSocialDisconnectInProcess } = this.props;
    return inProcess || discogsSocialDisconnectInProcess;
  };

  render() {
    const { navigateToSignInOrExecute = () => {}, callbackImportWantList = () => {}, inProcess } = this.props;

    return (
      <WantListImportStep title="Connect Discogs account">
        <LogInWithDiscogs
          className={styles.wantListImportDiscogsLogin}
          loginClassName={styles.discogsLogin}
          discogsLoginButtonsClassName={styles.discogsLoginButtons}
          buttonLogoutDiscogsClassName={styles.buttonLogoutDiscogs}
          buttonLoginDiscogsClassName={styles.buttonLoginDiscogs}
          navigateToSignInOrExecute={navigateToSignInOrExecute}
          payloadQuery="start_import_wantlist=true"
          forConnected={{
            logoutButtonSize: ComponentsCommonConstants.Size.SMALL40,
            importWantListInProcess: inProcess,
            componentRender: (
              <ButtonIcon
                className={classNames(styles.buttonUpdateLoginDiscogs, 'button-transparent m-top-13 m-bottom-30')}
                iconPosition={ComponentsCommonConstants.Position.LEFT}
                transparent
                borderColor="gray-4"
                text="Update wantlist"
                onClick={() => {
                  if (this.disabledImport()) {
                    return;
                  }

                  callbackImportWantList([], { importType: 'connect_discogs' });
                }}
                disabled={this.disabledImport()}
                isInProcess={inProcess}
                size={ComponentsCommonConstants.Size.SMALL40}
              >
                <UpdateCircleArrowIcon />
              </ButtonIcon>
            ),
          }}
        />
      </WantListImportStep>
    );
  }
}

export default connect((state) => ({
  discogsSocialDisconnectInProcess: state.SocialConnectReducer.discogsSocialDisconnectInProcess,
}))(WantListLogInWithDiscogs);
