import TelegramBotScrollLink from '@/components/telegram-bot/TelegramBotScrollLink';
import WantListImportText from '@/components/wantList/import/WantListImportText';

function WantListImportBotConnectionDescription() {
  return (
    <WantListImportText>
      Connect our&nbsp;
      <TelegramBotScrollLink />
      &nbsp;to&nbsp;enable instant notifications in&nbsp;messenger
    </WantListImportText>
  );
}

export default WantListImportBotConnectionDescription;
