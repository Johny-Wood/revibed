import { useMemo } from 'react';

import classNames from 'classnames';

import Cover from '@/components/common/Cover';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { getDateFormatUtil } from '@/utils/dateUtils';
import { parseReplaceTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function BlogListItem({
  title,
  coverSize = 305,
  preview,
  slug,
  createdAt,
  className,
  previewClassName,
  titleClassName,
  dateClassName,
}) {
  const href = useMemo(() => parseReplaceTextUtil(RoutePathsConstants.BLOG_ITEM, slug), [slug]);

  return (
    <div className={classNames(styles.blogItem, className)}>
      <Cover
        className={classNames(styles.blogItem__preview, previewClassName)}
        containerClassName={styles.blogItem__previewContainer}
        covers={preview ? [{ path: preview }] : []}
        href={href}
        alt={title}
        isDefault={false}
        size={coverSize}
        withoutNoCoverCircle
      />
      <LinkRoute className={classNames(styles.blogItem__title, titleClassName)} href={href} text={title} />
      <time className={classNames(styles.blogItem__date, dateClassName)}>{getDateFormatUtil(createdAt, 'MMM DD, YYYY')}</time>
    </div>
  );
}

export default BlogListItem;
