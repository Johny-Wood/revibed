import { createRef, useEffect, useState } from 'react';
// import parse from 'react-html-parser'; 


import classNames from 'classnames';
import Image from 'next/image';

import Button from '@/js/components/ui/buttons/Button';

import Modal from './Modal';
import VinilParallax from './Parallax';
import styles from './styles.module.scss';

import imageUrl from '../../_images/mainBanner.png';
import imageVinil from '../../_images/mainVinil.png';
import imageModal1 from '../../_images/Modal-1.png';
import imageModal2 from '../../_images/Modal-2.png';
import imageModal3 from '../../_images/Modal-3.png';

function MainBanner({ scrollValue }) {
  const [startAnimation, setStartAnimation] = useState(false);
  const [modal, setModal] = useState(false);
  const mainAnimationRef = createRef();



  useEffect(() => {
    setStartAnimation(true);
  }, [mainAnimationRef]);

  const modalCards = [
    {
      id: '1',
      title: '1. Join In',
      subtitle: <>Join or start pre-order <br/> (30&nbsp;fans needed for funding)</>,
      url: imageModal1,
      footer: 'Up to 14 days of funding time',
      bottom: <>Get your digital files cheaper <br/> and quicker than anyone else  <br/> <strong>(pay 7.5 eur instead of 10)</strong></>,
    },
    {
      id: '2',
      title: "2. Wait, it's coming",
      subtitle: <>Securing, purchase, delivery &&nbsp;digitisation of the record</>,
      url: imageModal2,
      footer: <>Average time from purchase <br/> to&nbsp;digitisation — X days</>,
      bottom: false,
    },
    {
      id: '3',
      title: '3. Get the music',
      subtitle: 'The digital copy is ready',
      url: imageModal3,
      footer: <>for the first 3 months, <br/> files&nbsp;will&nbsp;be exclusively available  <br/> to fans who pre-ordered</>,
      bottom:
      <>Join 4 successful pre-orders and <strong>get&nbsp;7.5&nbsp;EUR in&nbsp;cashback</strong> (that's <br/> 1&nbsp;release  you get completely for free!)</>,
    },
  ];

  return (
    <div className={styles.MainBanner}>
      <div className={styles.MainBanner__wrapper} direction="column">
        <div ref={mainAnimationRef} className={styles.MainBanner__images}>
          <Image
            className={classNames(styles.MainBanner__vinil, startAnimation && styles.MainBanner__vinilAnimation)}
            src={imageVinil}
            width={222}
            height={222}
            alt="vinil"
            quality={100}
          ></Image>
          <Image
            className={classNames(styles.MainBanner__image, startAnimation && styles.MainBanner__imageAnimation)}
            src={imageUrl}
            alt="phone"
            quality={100}
          ></Image>
        </div>
        <h1 className={styles.MainBanner__title}>
          Digitalizing vinyl is legal. <br /> Get your lossless now!
        </h1>
        <div className={styles.MainBanner__desc}>
          Revibed has forever transformed <br/> the lives of&nbsp;passionate music enthusiasts. Gone are the days of&nbsp;spending a
          fortune on&nbsp;overpriced vinyl&nbsp;and&nbsp;ripping gear just to stay in the loop. <br/> Now, hi-res digitization of musical heritage
          becomes legal and&nbsp;accessible to&nbsp;everyone.
        </div>
        <Button className={styles.MainBanner__button} onClick={() => setModal(true)}>
          Download Now
        </Button>
        <VinilParallax scrollValue={scrollValue}></VinilParallax>
      </div>
      <Modal visible={modal} setVisible={setModal} className={styles.MainBanner__modal}>
        <button className={styles.MainBanner__modalClose} onClick={() => setModal(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 8.4L1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4Z" fill="#1A1A1A" />
          </svg>
        </button>
        <div className={styles.MainBanner__modalTitle}>Here's how <br /> pre-order works!</div>
        <div className={styles.MainBanner__modalSubtitle}>
          Three simple steps to get exclusive music before the crowds do. Anyone can start a pre-order.
        </div>
        <div className={styles.MainBanner__modalCards}>
          {modalCards.map((modalCard) => {
            return (
              <div key={modalCard.id} className={styles.MainBanner__modalCard}>
                <div key={modalCard.id} className={styles.MainBanner__modalCardWrapper}>
                  <div className={styles.MainBanner__modalCardCaption}>{modalCard.title}</div>
                  <div className={styles.MainBanner__modalCardDesc}>{modalCard.subtitle}</div>
                  <div className={styles.MainBanner__modalCardImage}>
                    <Image src={modalCard.url} alt={modalCard.title}></Image>
                  </div>
                  <div className={styles.MainBanner__modalCardFooter}>{modalCard.footer}</div>
                </div>
                {modalCard.bottom !== false && <div className={styles.MainBanner__modalBottom}> {modalCard.bottom} </div>}
              </div>
            );
          })}
        </div>
        <div className={styles.MainBanner__modalFooter}>
            If a pre-order does not receive enough fan support during the funding stage, 
            it&nbsp;will be cancelled. <strong>All participants will receive a full refund</strong>
        </div>
        <button className={styles.MainBanner__modalBtn} onClick={() => setModal(false)}>
          Close
        </button>
      </Modal>
    </div>
  );
}
export default MainBanner;
