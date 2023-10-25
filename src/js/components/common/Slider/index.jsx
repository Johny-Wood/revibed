import SliderWrapper from '@/components/common/Slider/_components/SliderWrapper';
import { SliderDefaultProps, SliderPropTypes } from '@/components/common/Slider/_config/props';
import ViewportHook from '@/hooks/viewport/ViewportHook';

function Slider(props) {
  const { isNotDesktop, height } = ViewportHook();

  return <SliderWrapper isNotDesktop={isNotDesktop} height={height} {...props} />;
}

Slider.defaultProps = SliderDefaultProps;

Slider.propTypes = SliderPropTypes;

export default Slider;
