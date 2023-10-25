import { Component, createRef } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import Collapse from 'react-collapse';

import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import ProjectTag from '@/components/projects/Project/_components/ProjectTag';
import Button from '@/components/ui/buttons/Button';
import ToolTip from '@/components/ui/ToolTip';
import ComponentsCommonConstants from '@/constants/components/common';
import ArrowIcon from '@/icons/arrows/ArrowIcon';
import EllipsisIcon from '@/icons/EllipsisIcon';

import styles from './styles.module.scss';

class ProjectTags extends Component {
  constructor(props) {
    super(props);

    this.targetRef = createRef();

    this.state = {
      maxTags: 10,
      showMoreTags: false,
    };
  }

  componentDidMount() {
    const { showAll } = this.props;

    if (!showAll) {
      this.updateMaxTags();
    }
  }

  componentDidUpdate(prevProps) {
    const { tags, type, showAll } = this.props;
    const { tags: tagsPrev, type: typePrev } = prevProps;

    if ((!isEqual(tags, tagsPrev) || type !== typePrev) && !showAll) {
      this.updateMaxTags();
    }
  }

  updateMaxTags = () => {
    const { tags } = this.props;

    let tagsCountWidth = 0;
    let tagsCount = 0;
    const { current: { offsetWidth: offsetWidthSection, children = [] } = {} } = this.targetRef;

    tags.forEach((tag, idx) => {
      if (children[idx]) {
        const { offsetWidth: offsetWidthTag } = children[idx];
        tagsCountWidth += offsetWidthTag;

        if (tagsCountWidth < offsetWidthSection - 35) {
          tagsCount += 1;
        }
      }
    });

    this.setState({
      maxTags: tagsCount,
    });
  };

  renderTagsMore = () => {
    const { projectId, tags, changeFilterCallBack, filters, withFilter } = this.props;

    const tagsTmp = cloneDeep(tags);
    const { maxTags } = this.state;
    tagsTmp.splice(0, maxTags);

    return tagsTmp.map((tag) => {
      const { name, queryParam } = tag;

      return (
        <ProjectTag
          key={`project-tags-${projectId}-${name}-${queryParam}`}
          changeFilterCallBack={changeFilterCallBack}
          tag={tag}
          filters={filters}
          withFilter={withFilter}
        />
      );
    });
  };

  renderTags = () => {
    const { projectId, tags, changeFilterCallBack, filters, withFilter, showAll } = this.props;
    const { maxTags } = this.state;
    const tagsTmp = cloneDeep(tags);

    if (!showAll) {
      tagsTmp.splice(maxTags, tagsTmp.length);
    }

    return tagsTmp.map((tag) => {
      const { name, queryParam } = tag;

      return (
        <ProjectTag
          key={`project-tags-${projectId}-${name}-${queryParam}`}
          changeFilterCallBack={changeFilterCallBack}
          tag={tag}
          filters={filters}
          withFilter={withFilter}
        />
      );
    });
  };

  render() {
    const { type, tags, widthTooltip, className, showAll } = this.props;

    const { maxTags, showMoreTags } = this.state;

    const hasMoreTags = maxTags < tags.length && !showAll;

    return (
      <div className={classNames([styles.projectTags, className])} ref={this.targetRef}>
        {this.renderTags()}
        {type === 'DEFAULT' && (
          <>
            {hasMoreTags && (
              <Button
                type="button_string"
                className={classNames([styles.projectTags__more])}
                onClick={() => {
                  if (!showMoreTags && hasMoreTags) {
                    this.setState({
                      showMoreTags: true,
                    });
                  }
                }}
              >
                <TransitionLayout isShown={!showMoreTags && hasMoreTags}>
                  <span className={styles.projectTags__more__button}>
                    <EllipsisIcon />
                  </span>
                </TransitionLayout>
              </Button>
            )}
            <Collapse isOpened={showMoreTags}>
              {this.renderTagsMore()}
              <Button
                type="button_string"
                className={styles.projectTags__less}
                onClick={() => {
                  this.setState({
                    showMoreTags: false,
                  });
                }}
              >
                <span className="title_xs">Show less</span>
                <ArrowIcon size="small" />
              </Button>
            </Collapse>
          </>
        )}
        {type !== 'DEFAULT' && hasMoreTags && (
          <ToolTip
            width={widthTooltip}
            color="white"
            size={ComponentsCommonConstants.Size.SMALL}
            button={EllipsisIcon}
            buttonClassName={styles.projectTags__more__button}
            position="top"
          >
            {this.renderTags()}
            {this.renderTagsMore()}
          </ToolTip>
        )}
      </div>
    );
  }
}

ProjectTags.defaultProps = {
  projectId: -1,
  tags: [],
  filters: {},
  withFilter: false,
  changeFilterCallBack: () => {},
  widthTooltip: 245,
  type: 'TOOLTIP',
};

ProjectTags.propTypes = {
  projectId: PropTypes.number,
  tags: PropTypes.array,
  filters: PropTypes.object,
  withFilter: PropTypes.bool,
  changeFilterCallBack: PropTypes.func,
  widthTooltip: PropTypes.number,
  type: PropTypes.oneOf(['DEFAULT', 'TOOLTIP']),
};

export default ProjectTags;
