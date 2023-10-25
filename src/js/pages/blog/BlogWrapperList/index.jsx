import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import InfinityScrollWithScrollbarLayout from '@/components/layouts/InfinityScrollWithScrollbarLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import BlogList from '@/pages/blog/BlogList';
import { loadBlogRequestAction } from '@/redux-actions/blog/blogActions';

import styles from './styles.module.scss';

function BlogWrapperList({
  blogList,
  blogListPageSettings,
  loadBlogInProcess,
  loadBlogRequest,

  className,
  wrapperClassName,

  children,
}) {
  const { height, isNotDesktop } = ViewportHook();
  const [list, setList] = useState(blogList);
  const [pageSettingsState, setPageSettingsState] = useState(blogListPageSettings);

  useEffect(() => {
    setList(blogList);
  }, [blogList]);

  useEffect(() => {
    setPageSettingsState(blogListPageSettings);
  }, [blogListPageSettings]);

  return (
    <InfinityScrollWithScrollbarLayout
      width="100%"
      height={height - (isNotDesktop ? 61 : 71)}
      isInProcess={loadBlogInProcess}
      pageSettings={pageSettingsState}
      request={loadBlogRequest}
      requestCallback={({ list: newList, pageSettings: newPageSettings }) => {
        setList([...list, ...newList]);
        setPageSettingsState(newPageSettings);
      }}
      contentLength={list.length}
      className={className}
    >
      <SiteWrapperLayout direction="column" className={styles.BlogWrapperList}>
        <div className={classNames(wrapperClassName)}>
          {children}
          <BlogList blogList={list} />
        </div>
      </SiteWrapperLayout>
    </InfinityScrollWithScrollbarLayout>
  );
}

export default connect(
  (state) => ({
    loadBlogInProcess: state.BlogReducer.loadBlogInProcess,
    blogList: state.BlogReducer.blogList,
    blogListPageSettings: state.BlogReducer.blogListPageSettings,
  }),
  (dispatch) => ({
    loadBlogRequest: (params) => loadBlogRequestAction({ ...params, dispatch }),
  })
)(BlogWrapperList);
