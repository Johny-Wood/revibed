import TabsWrapper from '@/components/common/tabs/TabsWrapper';
import { RoutePathsConstants } from '@/constants/routes/routes';

const ACCOUNT_NOTIFICATIONS_SETTINGS_TABS = [
  {
    id: 1,
    title: 'Email',
    keyMenu: 'EMAIL',
    href: RoutePathsConstants.PERSONAL_NOTIFICATIONS_EMAIL_SETTINGS,
  },
  {
    id: 2,
    title: 'Telegram Bot',
    keyMenu: 'TELEGRAM_BOT',
    href: RoutePathsConstants.PERSONAL_NOTIFICATIONS_TELEGRAM_SETTINGS,
  },
];

function AccountSettingsNotificationsTabs() {
  return <TabsWrapper withButtonBorder={false} tabs={ACCOUNT_NOTIFICATIONS_SETTINGS_TABS} type="NAVIGATION" />;
}

export default AccountSettingsNotificationsTabs;
