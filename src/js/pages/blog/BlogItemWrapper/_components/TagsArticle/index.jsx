import ProjectTag from '@/components/projects/Project/_components/ProjectTag';

import styles from './styles.module.scss';

function TagsArticle({ tags = [] }) {
  return (
    <div className={styles.blogItemTags}>
      {tags.length > 0 && (
        <div className={styles.blogItemTags__list}>
          {tags.map((tag) => {
            const { name, queryParam } = tag;
            return <ProjectTag key={`blog-article-${name}-${queryParam}`} tag={tag} nameClassName={styles.blogItemTags__tag} />;
          })}
        </div>
      )}
    </div>
  );
}

export default TagsArticle;
