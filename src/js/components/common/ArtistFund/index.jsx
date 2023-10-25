import Coin from '@/components/ui/currency/Coin';
import LinkRoute from '@/components/ui/links/LinkRoute';
import Preloader from '@/components/ui/Preloader';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { numberWithSpacesUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function ArtistFund({ description, value, inProcess, shown }) {
  return (
    <div className={styles.artistFund}>
      <Preloader isShown={inProcess} opacity={1} withOffsets={false} />
      {shown && (
        <LinkRoute href={RoutePathsConstants.FAQ_PROJECT_ARTIST_FUND} className={styles.artistFundContent}>
          <div className={styles.artistFundContent__description}>{description}</div>
          <div className={styles.artistFundContent__value}>
            <Coin size={14}>{numberWithSpacesUtil(value, 6)}</Coin>
          </div>
        </LinkRoute>
      )}
    </div>
  );
}

export default ArtistFund;
