import styles from './styles.module.scss';

function MyFeedEventType({ isTags }) {
  return <div className={styles.feedEventType}>{isTags ? 'Tags subscription' : 'User subscription'}</div>;
}

export default MyFeedEventType;
