import { useMemo } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import Like from '@/components/common/Like';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import TextContentLayout from '@/components/layouts/TextContentLayout';
import LinkRoute from '@/components/ui/links/LinkRoute';
import Preloader from '@/components/ui/Preloader';
import UserAvatar from '@/components/user/UserAvatar';
import { CommonHeadConstants } from '@/constants/common/head';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import RelatedArticles from '@/pages/blog/BlogItemWrapper/_components/RelatedArticles';
import RelatedProjects from '@/pages/blog/BlogItemWrapper/_components/RelatedProjects';
import ShareArticle from '@/pages/blog/BlogItemWrapper/_components/ShareArticle';
import TagsArticle from '@/pages/blog/BlogItemWrapper/_components/TagsArticle';
import { createMetaImageUtil } from '@/utils/coverUtils';
import { getDateFormatUtil } from '@/utils/dateUtils';
import { parseBodyHtmlUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const metaDescription = `Updates, inspiration, and more from the ${CommonHeadConstants.SITE_NAME} community`;

function BlogItemWrapper({ blogItems, slug, blogItemsInProcess }) {
  const { isNotDesktop } = ViewportHook();
  const item = useMemo(() => blogItems[slug] || {}, [blogItems, slug]);

  const { id, title = '', createdAt, image = '', body = '', tags = [] } = item;

  return (
    <BaseWebsiteLayout
      headSettings={{
        title,
        description: metaDescription,
        withSiteName: false,
        social: {
          url: `Blog - ${CommonHeadConstants.SITE_NAME}`,
          title,
          description: metaDescription,
          image: createMetaImageUtil({ covers: [{ path: image }] }),
        },
      }}
    >
      <Preloader isShown={!!blogItemsInProcess[slug]} opacity={1} />
      <div className={styles.blogItem}>
        <SiteWrapperLayout direction="column" className={styles.blogItem__head}>
          <LinkRoute className={styles.blogItemBack} href={RoutePathsConstants.BLOG} text="Back to Blog List" />
          <div className={styles.blogItem__container}>
            <h1 className={styles.blogItem__title}>{title}</h1>
            <div className={styles.blogItem__info}>
              <div className={styles.blogItem__creater}>
                <UserAvatar kollektivxAvatar size={isNotDesktop ? 35 : 45} />
                <span>{CommonHeadConstants.SITE_NAME} Team</span>
              </div>
              <time>{getDateFormatUtil(createdAt, 'DD MMM YYYY')}</time>
            </div>
          </div>
        </SiteWrapperLayout>
        {!!image && (
          <div className={styles.blogItem__image}>
            <picture>
              <source srcSet={image} />
              <img src={image} alt={title} />
            </picture>
          </div>
        )}
        <SiteWrapperLayout direction={isNotDesktop ? 'column' : 'row'} withYPadding={false}>
          <div className={styles.blogItem__aside}>
            {!!id && <Like id={id} type="ARTICLE" />}
            <TagsArticle tags={tags} />
          </div>
          <TextContentLayout className={styles.blogItem__content}>
            <div className={styles.blogItem__body}>{parseBodyHtmlUtil({ body })}</div>
            <ShareArticle slug={slug} />
          </TextContentLayout>
          <div className={classNames(styles.blogItem__projects)}>{!!id && <RelatedProjects articleId={id} slug={slug} />}</div>
        </SiteWrapperLayout>
      </div>
      {!!id && <RelatedArticles articleId={id} />}
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  blogItems: state.BlogReducer.blogItems,
  blogItemsInProcess: state.BlogReducer.blogItemsInProcess,
}))(BlogItemWrapper);
