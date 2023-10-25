import { connect } from 'react-redux';

import BannersSlider from '@/components/global/Banners/_components/BannersSlider';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';

function BannersWrapper({ banners }) {
  return (
    <TransitionSwitchLayout isShown={banners.length > 0}>
      <BannersSlider banners={banners} />
    </TransitionSwitchLayout>
  );
}

const mapStateToProps = (state) => ({
  banners: state.BannersReducer.banners,
});

export default connect(mapStateToProps)(BannersWrapper);
