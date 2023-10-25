import PropTypes from 'prop-types';

export const SliderPropTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.array,
  itemsOnPack: PropTypes.number,
  activeSlideIdx: PropTypes.number,
  arrowIcon: PropTypes.any,
  arrowIconColor: PropTypes.string,
  withControls: PropTypes.bool,
  withCount: PropTypes.bool,
  autoPlay: PropTypes.bool,
  withKeyboardControls: PropTypes.bool,
  autoPlayDuration: PropTypes.number,
  onChange: PropTypes.func,
};

export const SliderDefaultProps = {
  items: [],
  itemsOnPack: 1,
  activeSlideIdx: 0,
  arrowIcon: undefined,
  arrowIconColor: undefined,
  withControls: true,
  withCount: true,
  autoPlay: false,
  withKeyboardControls: false,
  autoPlayDuration: 10000,
  onChange: () => {},
};
