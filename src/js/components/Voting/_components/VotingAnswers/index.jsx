import PropTypes from 'prop-types';

import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import VotingAnswer from '@/components/Voting/_components/VotingAnswer';

import styles from './styles.module.scss';

function VotingAnswers({
  answers,
  activeAnswerId,
  isClosed,
  isEnded,
  notVoted,

  setAnswerCallback,
}) {
  return (
    <div className={styles.votingAnswers}>
      {answers.map((answer) => {
        const { id } = answer;

        return (
          <VotingAnswer
            key={`voting-answer-${id}`}
            answer={answer}
            checked={id === activeAnswerId}
            setAnswerCallback={setAnswerCallback}
            isClosed={isClosed}
            isEnded={isEnded}
            notVoted={notVoted}
          />
        );
      })}
      <TransitionLayout isShown={isClosed || isEnded} duration={300}>
        <VotingAnswer
          answer={{
            ...notVoted,
            text: 'Not voted',
            id: -1,
            isNotVoted: true,
          }}
          setAnswerCallback={setAnswerCallback}
          isClosed={isClosed}
        />
      </TransitionLayout>
    </div>
  );
}

VotingAnswers.defaultProps = {
  activeAnswerId: -1,
  answers: [],
  isClosed: false,
  isEnded: false,

  setAnswerCallback: () => {},
};

VotingAnswers.propTypes = {
  activeAnswerId: PropTypes.number,
  answers: PropTypes.array,
  isClosed: PropTypes.bool,
  isEnded: PropTypes.bool,

  setAnswerCallback: PropTypes.func,
};

export default VotingAnswers;
