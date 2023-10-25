import { memo } from 'react';

import ReleaseItemsWrapper from '@/components/release/ReleaseWrapper/_components/ReleaseItemsWrapper';

import styles from './styles.module.scss';

const ReleaseListedLast = memo(({ releaseId }) => (
  <div className={styles.releaseListedLast}>
    <ReleaseItemsWrapper releaseId={releaseId} withInitialLoadItems withReleaseLink={false} withShortPagination={false} />
  </div>
));

ReleaseListedLast.displayName = 'ReleaseListedLast';

export default ReleaseListedLast;
