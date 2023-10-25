import styles from './styles.module.scss';

function VotingQuestion({ question = '' }) {
  return <div className={styles.votingQuestion}>{question}</div>;
}

export default VotingQuestion;
