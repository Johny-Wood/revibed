import BannersWrapper from '@/components/global/Banners/_components/BannersWrapper';

import styles from './styles.module.scss';

type BannersProps = {
  isShown?: boolean;
};

function Banners({ isShown }: BannersProps) {
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
