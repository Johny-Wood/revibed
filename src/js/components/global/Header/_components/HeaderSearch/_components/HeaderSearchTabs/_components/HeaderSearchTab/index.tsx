import { useMemo } from 'react';

import classNames from 'classnames';

import Cover from '@/components/common/Cover';
import Names from '@/components/common/Names';
import ProjectStatus from '@/components/projects/Project/_components/ProjectStatus';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { createGoodsUrlUtil } from '@/utils/project/goodsUrlUtil';
import { createProjectUrlUtil } from '@/utils/project/projectUrlUtil';

import styles from './styles.module.scss';

export type HeaderSearchTabItem = {
  id: string | number;
  covers: unknown[];
  artists: unknown[];
  title: string;
  albumTitle: string;
  release?: {
    artists: unknown[];
    title: string;
    album: string;
  };
  status?: unknown;
};

type HeaderSearchTabProps = {
  item: HeaderSearchTabItem;
  location: number;
  focused: boolean;
};

const HeaderSearchTab = ({
  item: { id, covers, title: titleG, artists: artistsG, albumTitle: albumTitleG, release, status },
  location,
  focused,
}: HeaderSearchTabProps) => {
  const { title = titleG, album = albumTitleG, artists = artistsG } = release ?? {};

  const href = useMemo(() => (location === 0 ? createGoodsUrlUtil(id) : createProjectUrlUtil(id, title)), [id, location, title]);

  return (
    <LinkRoute className={classNames(styles.HeaderSearchTab)} href={href} focused={focused}>
      {/* @ts-ignore */}
      <Cover
        isDefault
        covers={covers}
        size={60}
        className={classNames(styles.HeaderSearchTab__cover)}
        containerClassName={classNames(styles.HeaderSearchTab__coverContainer)}
      />
      <div className={classNames(styles.HeaderSearchTab__content)}>
        {location === 0 ? (
          <div className={classNames(styles.HeaderSearchTab__status)}>ALBUM</div>
        ) : (
          <ProjectStatus projectInfo={{ status }} className={styles.HeaderSearchTab__status} />
        )}
        <Names
          // @ts-ignore
          title={title}
          isRoute={false}
          artists={artists}
          albumTitle={album}
          className={styles.HeaderSearchTab__names}
          titleClassName={styles.HeaderSearchTab__title}
          albumClassName={styles.HeaderSearchTab__album}
        />
      </div>
    </LinkRoute>
  );
};

export default HeaderSearchTab;
