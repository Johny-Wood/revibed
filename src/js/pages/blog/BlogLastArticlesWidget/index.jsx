import { useEffect } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import NoResults from '@/components/common/NoResults';
import SecondaryTitle from '@/components/common/titles/SecondaryTitle';
import Preloader from '@/components/ui/Preloader';
import BlogList from '@/pages/blog/BlogList';
import { loadBlogRequestAction } from '@/redux-actions/blog/blogActions';

import styles from './styles.module.scss';

function BlogLastArticlesWidget({ loadShortBlogFromApi, loadBlogInProcess, blogList, loadBlogRequest }) {
  useEffect(() => {
    if (!loadShortBlogFromApi && !loadBlogInProcess) {
      loadBlogRequest({ size: 4, type: 'SHORT' });
    }
  }, [loadShortBlogFromApi, loadBlogInProcess, loadBlogRequest]);

  return (
    <div className={classNames(styles.BlogLastArticlesWidget)}>
      <SecondaryTitle title="Last posts" />
      <div className={classNames(styles.BlogLastArticlesWidget__wrapper)}>
        {loadShortBlogFromApi &&
          (blogList.length > 0 ? (
            <BlogList
              blogList={blogList}
              coverSize={250}
              className={styles.BlogLastArticlesWidget__list}
              itemClassName={styles.BlogLastArticlesWidget__item}
              itemPreviewClassName={styles.BlogLastArticlesWidget__preview}
              itemTitleClassName={styles.BlogLastArticlesWidget__title}
              itemDateClassName={styles.BlogLastArticlesWidget__date}
            />
          ) : (
            <NoResults minPaddings />
          ))}
        <Preloader isShown={loadBlogInProcess && !loadShortBlogFromApi} withOffsets={false} opacity={1} withBgColor />
      </div>
    </div>
  );
}

export default connect(
  (state) => ({
    loadShortBlogFromApi: state.BlogReducer.loadShortBlogFromApi,
    loadBlogInProcess: state.BlogReducer.loadBlogInProcess,
    blogList: state.BlogReducer.blogList,
  }),
  (dispatch) => ({
    loadBlogRequest: (params) => loadBlogRequestAction({ ...params, dispatch }),
  })
)(BlogLastArticlesWidget);
