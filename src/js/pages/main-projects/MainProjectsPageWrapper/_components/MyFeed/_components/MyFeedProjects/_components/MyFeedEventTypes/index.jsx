import MyFeedEventType from '@/pages/main-projects/MainProjectsPageWrapper/_components/MyFeed/_components/MyFeedProjects/_components/MyFeedEventType';

import styles from './styles.module.scss';

function MyFeedEventTypes({ types = [] }) {
  return (
    <div className={styles.feedEventTypes}>
      {(types.includes('HOT_OFFER_BY_FOUNDER') ||
        types.includes('BY_JOIN_CONTRIBUTORS') ||
        types.includes('LAST_CALL_BY_FOUNDER') ||
        types.includes('PUBLISH_BY_FOUNDER')) && <MyFeedEventType isTags={false} />}
      {(types.includes('PUBLISH_BY_GENRE') || types.includes('LAST_CALL_BY_GENRE') || types.includes('HOT_OFFER_BY_GENRE')) && (
        <MyFeedEventType isTags />
      )}
    </div>
  );
}

export default MyFeedEventTypes;
