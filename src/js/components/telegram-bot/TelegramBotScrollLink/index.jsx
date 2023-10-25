import RedirectComponent from '@/components/common/RedirectComponent';
import { RoutePathsConstants } from '@/constants/routes/routes';
import NextRouter from '@/services/NextRouter';

const scrollToTelegramBot = () => {
  const { router = {} } = NextRouter.getInstance();

  router.push(RoutePathsConstants.PERSONAL_TELEGRAM_SETTINGS);
};

function TelegramBotScrollLink() {
  return (
    <RedirectComponent callbackAfterRedirect={scrollToTelegramBot}>
      <span className="link c-blue" onClick={scrollToTelegramBot}>
        Telegram bot
      </span>
    </RedirectComponent>
  );
}

export default TelegramBotScrollLink;
