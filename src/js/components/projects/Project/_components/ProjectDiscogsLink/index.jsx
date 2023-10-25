import classNames from 'classnames';

import LinkDefault from '@/components/ui/links/LinkDefault';
import DiscogsIcon from '@/icons/DiscogsIcon';

import styles from './styles.module.scss';

function ProjectDiscogsLink({ link: discogsLink = '', className }) {
  return (
    <LinkDefault className={classNames([styles.discogsLink, className])} href={discogsLink} title="Discogs link">
      <DiscogsIcon />
    </LinkDefault>
  );
}

export default ProjectDiscogsLink;
