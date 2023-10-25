import { CommonMessagesConstants } from '@/constants/common/message';

type MarketplaceCardInfoStatusProps = {
  isPreOrder: boolean;
};

const MarketplaceCardInfoStatus = ({ isPreOrder }: MarketplaceCardInfoStatusProps) => {
  if (!isPreOrder) {
    return null;
  }

  return (
    <div className="project-status">
      <div className="status status_SOLD">
        <span className="status__name">{CommonMessagesConstants.COMING_SOON}</span>
      </div>
    </div>
  );
};

export default MarketplaceCardInfoStatus;
