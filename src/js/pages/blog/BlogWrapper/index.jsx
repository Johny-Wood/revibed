import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import { CommonHeadConstants } from '@/constants/common/head';
import TitlesConstants from '@/constants/titles/titlesConstants';
import BlogWrapperList from '@/pages/blog/BlogWrapperList';

import styles from './styles.module.scss';

const metaTitle = TitlesConstants.BLOG;
const metaDescription = `Updates, inspiration, and more from the ${CommonHeadConstants.SITE_NAME} community`;

function BlogWrapper() {
  return (
    <BaseWebsiteLayout
      withoutFooter
      headSettings={{
        title: metaTitle,
        description: metaDescription,
      }}
    >
      <BlogWrapperList className={styles.blog} wrapperClassName={styles.blog__wrapper}>
        <h1 className={styles.blog__title}>
          {CommonHeadConstants.SITE_NAME} {metaTitle}
        </h1>
        <h2 className={styles.blog__description}>
          Updates, inspiration, and more from the&nbsp;{CommonHeadConstants.SITE_NAME} community
        </h2>
      </BlogWrapperList>
    </BaseWebsiteLayout>
  );
}

export default BlogWrapper;
