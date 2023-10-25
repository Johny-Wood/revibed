import classNames from 'classnames';
import PropTypes from 'prop-types';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import ShowMore from '@/components/common/show-more/ShowMore';
import Contributor from '@/components/project/_components/Contributor';
import ProjectCardInfoLayout from '@/components/project/ProjectCard/info-details/ProjectCardInfoLayout';

import styles from './styles.module.scss';

function ProjectCardAbout({
  layoutClassName,
  contributorClassName,
  className,
  showMoreClass,
  widthContentTitle,
  contributor,
  sliceLength,
  avatarSize,
  description,
  withShowMore = true,
}) {
  return (
    <ProjectCardInfoLayout
      title={widthContentTitle ? 'Founder' : ''}
      className={classNames(styles.projectCardAbout__founder, layoutClassName)}
      containerClassName={styles.projectCardDetails__container}
    >
      <div className={classNames(styles.projectCardAbout, className, globalStyles.breakWord)}>
        {!!contributor && (
          <Contributor
            className={contributorClassName}
            contributor={contributor}
            withDescriptionRole={false}
            withFollowers
            avatar={{
              size: avatarSize,
            }}
            isRoute
          />
        )}
        <ShowMore
          className={classNames(styles.showMore, showMoreClass)}
          text={description}
          sliceLength={sliceLength}
          withEmoji
          withShowMore={withShowMore}
        />
      </div>
    </ProjectCardInfoLayout>
  );
}

ProjectCardAbout.defaultProps = {
  widthContentTitle: true,
  contributor: undefined,
  sliceLength: 250,
  avatarSize: 50,
  description: '',
};

ProjectCardAbout.propTypes = {
  widthContentTitle: PropTypes.bool,
  contributor: PropTypes.object,
  sliceLength: PropTypes.number,
  avatarSize: PropTypes.number,
  description: PropTypes.string,
};

export default ProjectCardAbout;
