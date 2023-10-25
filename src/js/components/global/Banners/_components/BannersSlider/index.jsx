import { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Slider from '@/components/common/Slider';
import Banner from '@/components/global/Banners/_components/Banner';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import { setActiveBannerAction } from '@/redux-actions/common/bannersActions';

import styles from './styles.module.scss';

const renderSlide = ({ banners = [], bannerItem }) => <Banner count={banners.length} {...bannerItem} />;

class BannersSlider extends Component {
  changeActiveBanner = (idx) => {
    const { setActiveBanner } = this.props;
    const activeBanner = this.getBannerByIdx(idx) || {};

    setActiveBanner({ activeBanner });
  };

  getBannerByIdx = (idx) => {
    const { banners } = this.props;
    const newIdx = banners.length - 1 >= idx && idx >= 0 ? idx : 0;

    return banners[newIdx];
  };

  bannersList = () => {
    const { banners } = this.props;

    if (banners.length === 0) {
      return [];
    }

    return banners.map((bannerItem) => {
      const { id } = bannerItem;

      return {
        id,
        sliderComponent: renderSlide,
        sliderComponentProps: { banners, bannerItem },
      };
    });
  };

  render() {
    const { banners, activeBanner } = this.props;
    const { duration, id: activeId } = activeBanner || {};
    const foundActiveIndex = banners.findIndex(({ id }) => id === activeId);
    const activeSlideIdx = foundActiveIndex > 0 ? foundActiveIndex : 0;

    return (
      <div className={styles.banners}>
        <SiteWrapperLayout className={styles.banners__siteWrapper}>
          <div className={styles.banners__wrapper}>
            <Slider
              id="banners-slider"
              className={styles.bannersSlider}
              items={this.bannersList()}
              autoPlay
              autoPlayDuration={duration * 1000}
              withCount={false}
              withControls={false}
              onChange={this.changeActiveBanner}
              activeSlideIdx={activeSlideIdx}
              listClassNames={{
                listClassName: styles.bannersSlider_sliderList,
              }}
            />
          </div>
        </SiteWrapperLayout>
      </div>
    );
  }
}

BannersSlider.defaultProps = {
  banners: [],
};

BannersSlider.propTypes = {
  banners: PropTypes.array,
};

export default connect(
  (state) => ({
    activeBanner: state.BannersReducer.activeBanner,
  }),
  (dispatch) => ({
    setActiveBanner: ({ activeBanner }) => {
      dispatch(setActiveBannerAction({ activeBanner }));
    },
  })
)(BannersSlider);
