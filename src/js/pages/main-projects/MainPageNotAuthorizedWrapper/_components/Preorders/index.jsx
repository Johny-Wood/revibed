import Image from 'next/image';

import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';

import Button from '@/js/components/ui/buttons/Button';
import styles from './styles.module.scss';

import cover1 from '../../_images/Cover-6.png';
import cover2 from '../../_images/Cover-7.png';
import cover3 from '../../_images/Cover-8.png';
import cover4 from '../../_images/Cover-9.png';

function Preorders() {

  const cardsData = [
    { id: '1', url: cover1, name: 'Saka Mazouki And His...', desc: 'African Fascination' },
    { id: '2', url: cover2, name: 'Saka Mazouki And His...', desc: 'African Fascination' },
    { id: '3', url: cover3, name: 'Saka Mazouki And His...', desc: 'African Fascination' },
    { id: '4', url: cover4, name: 'Saka Mazouki And His...', desc: 'African Fascination' }
  ];


  return (
    <SiteWrapperLayout direction="column" className={styles.Preorders}>
      <div className={styles.Preorders__content}>
        <div className={styles.Preorders__title}>
          Preorders
        </div>
        <div className={styles.Preorders__items}>
          {cardsData.map((card) => {
            return (
              <div key={card.id} className={styles.PreordersCard}>
                <div className={styles.PreordersCard__cover}>
                  <Image width={180} height={180} src={card.url} alt={card.desc}></Image>
                </div>
                <div className={styles.PreordersCard__info}>
                  <div className={styles.PreordersCard__infoTitle}>{card.name}</div>
                  <div className={styles.PreordersCard__infoDesc}>{card.desc}</div>
                  <div className={styles.PreordersCard__footer}>
                    <div className={styles.PreordersCard__footerItem}>
                      <strong>24</strong> of <strong>30</strong>
                    </div>  
                    <div className={styles.PreordersCard__footerItem}>
                      <strong>25 hours</strong> left
                    </div>
                  </div>
                  <div className={styles.PreordersCard__progress}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Button className={styles.Preorders__more}>Find More</Button>
    </SiteWrapperLayout>
  )
}

export default Preorders;