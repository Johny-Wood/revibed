import BannersWrapper from '@/components/global/Banners/_components/BannersWrapper';

import styles from './styles.module.scss';

function Banners({ isShown }) {
  if (!isShown) {
    return null;
  }

  return (
    <div className={styles.bannersWrapperBlock}>
      <BannersWrapper />
    </div>
  );
}

export default Banners;
