import { useEffect, useMemo } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import DefaultProject from '@/components/projects/Project/DefaultProject';
import LinkRoute from '@/components/ui/links/LinkRoute';
import Preloader from '@/components/ui/Preloader';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { loadBlogItemRelatedProjectsRequestAction } from '@/redux-actions/blog/blogActions';

import styles from './styles.module.scss';

function RelatedProjects({
  slug,
  articleId,
  blogItemRelatedProjectsInProcess,
  blogItemRelatedProjects,
  loadBlogItemRelatedProjectsRequest,
}) {
  useEffect(() => {
    loadBlogItemRelatedProjectsRequest({ articleId });
  }, [articleId, loadBlogItemRelatedProjectsRequest]);

  const blogItemRelatedProjectsList = useMemo(
    () => blogItemRelatedProjects[articleId] ?? [],
    [blogItemRelatedProjects, articleId]
  );
  const inProcess = useMemo(
    () => blogItemRelatedProjectsInProcess[articleId] ?? true,
    [blogItemRelatedProjectsInProcess, articleId]
  );

  if (blogItemRelatedProjectsList.length === 0 && !inProcess) {
    return null;
  }

  return (
    <div className={classNames(styles.relatedProjects)}>
      <div className={styles.relatedProjects__preload}>
        <Preloader isShown={inProcess} opacity={1} withOffsets={false} withBgColor />
      </div>
      <div className={styles.relatedProjects__title}>Related pre-orders</div>
      {blogItemRelatedProjectsList.map((project) => {
        const { id } = project;
        return (
          <DefaultProject
            userId={articleId}
            target={slug}
            key={`blog-article-related-project-${id}`}
            className={styles.relatedProjects__project}
            coverClassName={styles.relatedProjects__cover}
            coverContainerClassName={styles.relatedProjects__coverContainer}
            founderClassName={styles.relatedProjects__founder}
            showMoreClassName={styles.relatedProjects__shownMore}
            namesClassName={styles.relatedProjects__names}
            headerClassName={styles.relatedProjects__header}
            projectsCount={blogItemRelatedProjectsList.length}
            location={ProjectsLocationsConstants.BLOG}
            project={project}
            isFullType={false}
            withStatus={false}
            withBuyButtons={false}
            withShare={false}
            coverSize={200}
            withFounder
            tagsShowAll
            withFooter={false}
            founderProps={{
              avatarSize: 40,
              sliceLength: 150,
              withShowMore: false,
            }}
          />
        );
      })}
      <LinkRoute
        className={styles.relatedProjects__button}
        href={RoutePathsConstants.PROJECTS}
        type="button"
        transparent
        text="Show more"
        borderColor="gray-4"
      />
    </div>
  );
}

export default connect(
  (state) => ({
    blogItemRelatedProjects: state.BlogReducer.blogItemRelatedProjects,
    blogItemRelatedProjectsInProcess: state.BlogReducer.blogItemRelatedProjectsInProcess,
  }),
  (dispatch) => ({
    loadBlogItemRelatedProjectsRequest: (params) => loadBlogItemRelatedProjectsRequestAction({ ...params, dispatch }),
  })
)(RelatedProjects);
