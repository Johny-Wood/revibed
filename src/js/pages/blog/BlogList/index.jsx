import classNames from 'classnames';

import BlogListItem from '@/pages/blog/BlogList/_components/BlogListItem';

import styles from './styles.module.scss';

function BlogList({
  blogList,
  coverSize,

  className,
  itemClassName,
  itemPreviewClassName,
  itemTitleClassName,
  itemDateClassName,
}) {
  return (
    <div className={classNames(styles.BlogList, className)}>
      {blogList.map(({ id, ...item }) => (
        <BlogListItem
          key={`blog-article-${id}`}
          {...item}
          coverSize={coverSize}
          className={itemClassName}
          previewClassName={itemPreviewClassName}
          titleClassName={itemTitleClassName}
          dateClassName={itemDateClassName}
        />
      ))}
    </div>
  );
}

export default BlogList;
