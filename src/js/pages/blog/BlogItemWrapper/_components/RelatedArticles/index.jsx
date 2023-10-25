import { useEffect, useMemo } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import Preloader from '@/components/ui/Preloader';
import BlogListItem from '@/pages/blog/BlogList/_components/BlogListItem';
import { loadBlogItemRelatedArticlesRequestAction } from '@/redux-actions/blog/blogActions';

import styles from './styles.module.scss';

function RelatedArticles({
  articleId,
  blogItemRelatedArticles,
  blogItemRelatedArticlesInProcess,
  loadBlogItemRelatedArticlesRequest,
}) {
  useEffect(() => {
    loadBlogItemRelatedArticlesRequest({ articleId });
  }, [articleId, loadBlogItemRelatedArticlesRequest]);

  const blogItemRelatedArticlesList = useMemo(
    () => blogItemRelatedArticles[articleId] ?? [],
    [blogItemRelatedArticles, articleId]
  );
  const inProcess = useMemo(
    () => blogItemRelatedArticlesInProcess[articleId] ?? true,
    [blogItemRelatedArticlesInProcess, articleId]
  );

  if (blogItemRelatedArticlesList.length === 0 && !inProcess) {
    return null;
  }

  return (
    <div className={classNames(styles.RelatedArticles)}>
      <div className={styles.RelatedArticles__preload}>
        <Preloader isShown={inProcess} opacity={1} withOffsets={false} withBgColor />
      </div>
      <h2>Related Articles</h2>
      <SiteWrapperLayout direction="column" className={classNames(styles.RelatedArticles__container)}>
        <div className={classNames(styles.RelatedArticles__wrapper)}>
          <Preloader isShown={inProcess} type="element" />
          {blogItemRelatedArticlesList.map(({ id, ...item }) => (
            <BlogListItem key={`blog-article-${id}`} {...item} />
          ))}
        </div>
      </SiteWrapperLayout>
    </div>
  );
}

export default connect(
  (state) => ({
    blogItemRelatedArticles: state.BlogReducer.blogItemRelatedArticles,
    blogItemRelatedArticlesInProcess: state.BlogReducer.blogItemRelatedArticlesInProcess,
  }),
  (dispatch) => ({
    loadBlogItemRelatedArticlesRequest: (params) => loadBlogItemRelatedArticlesRequestAction({ ...params, dispatch }),
  })
)(RelatedArticles);
