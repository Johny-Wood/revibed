import classNames from 'classnames';
import { connect } from 'react-redux';

import styles from './styles.module.scss';

function ProjectRatio({
  className,
  infoClassName,
  valueClassName,
  withDescription = true,
  ratio,
  have,
  want,
  variablesList: { WANTLIST_RATIO } = {},
}) {
  return (
    <div className={classNames(styles.projectRatio, className)}>
      {ratio >= 0 ? (
        <div>
          {withDescription && <>Ratio:&nbsp;</>}
          <span className={classNames(WANTLIST_RATIO >= 0 && ratio >= 0 && WANTLIST_RATIO > ratio && 'c-green')}>{ratio}</span>
        </div>
      ) : (
        '---'
      )}
      <div className={classNames(styles.projectRatio__info, infoClassName)}>
        {have >= 0 && (
          <span className={styles.projectRatio__have} title="have">
            <span className={classNames(styles.projectRatio__value, valueClassName)}>{have}</span>
          </span>
        )}
        {want >= 0 && (
          <span className={styles.projectRatio__want} title="want">
            <span className={classNames(styles.projectRatio__value, valueClassName)}>{want}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
}))(ProjectRatio);
