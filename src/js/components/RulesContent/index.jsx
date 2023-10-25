import classNames from 'classnames';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import TextContentLayout from '@/components/layouts/TextContentLayout';
import Preloader from '@/components/ui/Preloader';
import { getDateFormatUtil } from '@/utils/dateUtils';

import styles from './styles.module.scss';

function RulesContent({
  title,
  rulesName,

  loadRulesInProcess,
  rulesContent = {},
}) {
  const rulesContentCurr = rulesContent[rulesName] || {};
  const { updatedAt, text = '' } = rulesContentCurr;

  return (
    <div className={styles.termsPage}>
      <TextContentLayout>
        <>
          <h1>{title}</h1>
          <div className={classNames(globalStyles.relative, 'w-100pct')}>
            <Preloader id="rules-content" type="container" isShown={loadRulesInProcess} />
            <div className={styles.termsPage__lastRevised}>
              {!!updatedAt && (
                <>
                  Last Revised:
                  {getDateFormatUtil(updatedAt, 'MMM DD, YYYY')}
                </>
              )}
            </div>
            {!!text && <>{parse(text)}</>}
          </div>
        </>
      </TextContentLayout>
    </div>
  );
}

RulesContent.propTypes = {
  title: PropTypes.string.isRequired,
  rulesName: PropTypes.string.isRequired,
};

export default connect((state) => ({
  loadRulesInProcess: state.RulesReducer.loadRulesInProcess,
  rulesContent: state.RulesReducer.rulesContent,
}))(RulesContent);
