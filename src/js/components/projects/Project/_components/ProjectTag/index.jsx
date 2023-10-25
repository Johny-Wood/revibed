import { forwardRef } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const ProjectTag = forwardRef(
  ({ nameClassName, filters = [], tag: { name, queryParam, destinationKey } = {}, withFilter, changeFilterCallBack }, ref) => (
    <div className={styles.tag}>
      <div
        ref={ref}
        className={classNames([
          styles.projectTag,
          withFilter && styles.projectTag_filterable,
          destinationKey === 'CUSTOM_TAG' && styles.projectTag_CUSTOM_TAG,
        ])}
      >
        <span
          className={classNames(styles.projectTag__name, nameClassName)}
          onClick={(e) => {
            e.stopPropagation();

            const { data: { items = [] } = {} } = filters[destinationKey] || {};

            if (!withFilter) {
              return;
            }

            const item = items.find(({ queryParam: queryParamFind }) => queryParamFind === queryParam);

            changeFilterCallBack({
              categoryId: destinationKey,
              items: [item || { id: destinationKey, min: queryParam, max: queryParam }],
              isNowSending: true,
              isApplyFilter: true,
              multi: true,
            });
          }}
        >
          {name}
        </span>
      </div>
    </div>
  )
);

ProjectTag.defaultProps = {
  tag: {},
  withFilter: false,
};

ProjectTag.propTypes = {
  tag: PropTypes.object,
  withFilter: PropTypes.bool,
};

ProjectTag.displayName = 'ProjectTag';

export default ProjectTag;
