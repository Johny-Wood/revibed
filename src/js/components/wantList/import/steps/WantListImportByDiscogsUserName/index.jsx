import { Component } from 'react';

import Button from '@/components/ui/buttons/Button';
import Input from '@/components/ui/inputs/Input';
import WantListImportStep from '@/components/wantList/import/WantListImportStep';
import ComponentsCommonConstants from '@/constants/components/common';
import { changeInputHandler, pressEnterKeyInputHandler } from '@/utils/inputHandlersUtil';

import styles from './styles.module.scss';

class WantListImportByDiscogsUserName extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);

    this.state = {
      userNameOfDiscogs: '',
      userNameOfDiscogsError: false,
      userNameOfDiscogsErrorMsg: '',
    };
  }

  disabledImport = () => {
    const { userNameOfDiscogs, userNameOfDiscogsError } = this.state;

    const { inProcess } = this.props;

    return inProcess || !userNameOfDiscogs || userNameOfDiscogsError;
  };

  onImport = () => {
    const { callbackImportWantList, navigateToSignInOrExecute } = this.props;
    const { userNameOfDiscogs } = this.state;

    if (this.disabledImport()) {
      return;
    }

    navigateToSignInOrExecute({
      executableFunction: () => {
        callbackImportWantList(
          {
            name: 'username',
            value: userNameOfDiscogs,
          },
          { importType: 'parse_discogs' }
        );
      },
    });
  };

  render() {
    const { userNameOfDiscogs, userNameOfDiscogsError, userNameOfDiscogsErrorMsg } = this.state;

    const { inProcess } = this.props;

    return (
      <WantListImportStep title="Parse Discogs without connection">
        <div className={styles.wantListImportDiscogsUserName}>
          <Input
            id="userNameOfDiscogs"
            label="Discogs username"
            value={userNameOfDiscogs}
            invalid={userNameOfDiscogsError}
            invalidMessage={userNameOfDiscogsErrorMsg}
            onChange={this.changeInputHandler}
            labelPosition="center"
            onKeyDown={(e) => pressEnterKeyInputHandler(e, this.onImport)}
          />
          <Button
            className="m-top-13 m-bottom-10 button-transparent"
            text="Upload"
            transparent
            disabled={this.disabledImport()}
            borderColor="gray-4"
            isInProcess={inProcess}
            onClick={() => this.onImport()}
            size={ComponentsCommonConstants.Size.SMALL40}
          />
        </div>
      </WantListImportStep>
    );
  }
}

export default WantListImportByDiscogsUserName;
