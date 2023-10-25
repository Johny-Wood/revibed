import { Component, createRef } from 'react';

import SettingsSynchronizeWithDiscogs from '@/components/forms/personal/profile/WantListSettingsForm/_components/SettingsSynchronizeWithDiscogs';
import WantListSettingsSubscriptionFilter from '@/components/forms/personal/profile/WantListSettingsForm/_components/WantListSettingsSubscriptionFilter';
import ProfileFormLayout from '@/components/layouts/ProfileFormLayout';
import LogInWithDiscogs from '@/components/wantList/login/LogInWithDiscogs';

import styles from './styles.module.scss';

class WantListSettingsForm extends Component {
  constructor(props) {
    super(props);

    this.wantListSettingsRef = createRef();
  }

  render() {
    return (
      <ProfileFormLayout
        ref={this.wantListSettingsRef}
        shortColumn={false}
        id="wantlist"
        name={styles.wantlistSettings}
        formContentClassName={styles.wantlistSettings__formContent}
      >
        <LogInWithDiscogs />
        <SettingsSynchronizeWithDiscogs />
        <WantListSettingsSubscriptionFilter />
      </ProfileFormLayout>
    );
  }
}

export default WantListSettingsForm;
