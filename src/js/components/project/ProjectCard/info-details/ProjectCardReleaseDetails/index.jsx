import { Fragment } from 'react';

import classNames from 'classnames';

import ProjectCardInfoLayout from '@/components/project/ProjectCard/info-details/ProjectCardInfoLayout';
import ProjectCountry from '@/components/projects/Project/_components/ProjectCountry';
import ProjectFormats from '@/components/projects/Project/_components/ProjectFormats';
import ProjectGenres from '@/components/projects/Project/_components/ProjectGenres';
import ProjectStyles from '@/components/projects/Project/_components/ProjectStyles';

import styles from './styles.module.scss';

const renderReleaseLabels = (labels) =>
  labels.map((label, idx) => {
    const { name, id } = label;
    return (
      <Fragment
        // eslint-disable-next-line react/no-array-index-key
        key={`release-label-${id}-${name}-${idx}`}
      >
        <>
          {name}
          {idx < labels.length - 1 && <>, </>}
        </>
      </Fragment>
    );
  });

const renderReleaseDetail = ({
  key,
  releaseDetails: { year, country, formats = [], labels = [], genres = [], styles: releaseStyles = [], ratio } = {},
}) => {
  switch (key) {
    case 'label': {
      return <span>{labels.length > 0 ? renderReleaseLabels(labels) : <span className="c-gray-1">-----</span>}</span>;
    }
    case 'released':
    case 'year': {
      return <span>{year || <span className="c-gray-1">-----</span>}</span>;
    }
    case 'ratio': {
      return <span>{ratio >= 0 ? ratio : <span className="c-gray-1">-----</span>}</span>;
    }
    case 'format': {
      return <span>{formats.length > 0 ? <ProjectFormats items={formats} /> : <span className="c-gray-1">-----</span>}</span>;
    }
    case 'country': {
      return <span>{country ? <ProjectCountry country={country} /> : <span className="c-gray-1">-----</span>}</span>;
    }
    case 'styles': {
      return (
        <span>
          {releaseStyles.length > 0 ? <ProjectStyles items={releaseStyles} /> : <span className="c-gray-1">-----</span>}
        </span>
      );
    }
    case 'genres': {
      return <span>{genres.length > 0 ? <ProjectGenres items={genres} /> : <span className="c-gray-1">-----</span>}</span>;
    }
    default: {
      return null;
    }
  }
};

function ProjectCardReleaseDetails({
  releaseDetails,
  items = ['label', 'genres', 'styles', 'country', 'year', 'format', 'ratio'],
  title,
  className,
  containerClassName,
  itemClassName,
}) {
  return (
    <ProjectCardInfoLayout title={title} className={className}>
      <div className={classNames(styles.projectCardReleaseDetails, containerClassName)}>
        <div className={styles.projectCardReleaseDetails__info}>
          {items.map((key) => (
            <div key={`release-details-${key}`} className={classNames(styles.projectCardReleaseDetails__item, itemClassName)}>
              <span className={styles.projectCardReleaseDetails__description}>{key}:</span>
              {renderReleaseDetail({ key, releaseDetails })}
            </div>
          ))}
        </div>
      </div>
    </ProjectCardInfoLayout>
  );
}

export default ProjectCardReleaseDetails;
