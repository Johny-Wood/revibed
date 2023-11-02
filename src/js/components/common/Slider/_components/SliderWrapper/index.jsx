import { Component, createRef } from 'react';

import classNames from 'classnames';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import SliderControls from '@/components/common/Slider/_components/SliderControls';
import SliderCounter from '@/components/common/Slider/_components/SliderCounter';
import SliderList from '@/components/common/Slider/_components/SliderList';
import { SliderDefaultProps, SliderPropTypes } from '@/components/common/Slider/_config/props';

import styles from './styles.module.scss';

const getPrevIdx = (currentIdx, maxCount) => {
  if (currentIdx === 0) {
    return maxCount - 1;
  }
  return currentIdx - 1;
};

const getNextIdx = (currentIdx, maxCount) => {
  if (currentIdx === maxCount - 1) {
    return 0;
  }

  return currentIdx + 1;
};

class SliderWrapper extends Component {
  constructor(props) {
    super(props);

    this.autoPlayRef = createRef();

    this.autoPlayInterval = null;
    this.delayTimer = createRef();
    this.disabled = false;

    const { activeSlideIdx = 0 } = props;

    this.state = {
      activeId: activeSlideIdx,
      inProcess: false,
      inProcessCircle: false,
    };
  }

  componentDidMount() {
    this.autoPlayRef.current = () => {
      this.next(true);
    };

    this.startAutoPlay();
    this.addListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeSlideIdx = 0, customCircle, autoPlayDuration, items, duration = 0 } = this.props;

    const { autoPlayDuration: autoPlayDurationPrev } = prevProps;

    const { activeId, inProcess } = this.state;

    const { activeId: activeIdPrev } = prevState;

    if (autoPlayDuration !== autoPlayDurationPrev) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }

    if (activeId !== activeIdPrev && inProcess && this.disabled) {
      this.delayTimer.current = setTimeout(() => {
        this.toggleInProcess(false);

        if (customCircle) {
          if (activeId === items.length - 1) {
            this.setState(
              {
                inProcessCircle: true,
                activeId: activeSlideIdx,
              },
              () => {
                this.disabled = false;
              }
            );
          } else if (activeId === 0) {
            this.setState(
              {
                inProcessCircle: true,
                activeId: items.length - 2,
              },
              () => {
                this.disabled = false;
              }
            );
          } else {
            this.disabled = false;
          }
        } else {
          this.disabled = false;
        }
      }, duration);
    }
  }

  componentWillUnmount() {
    this.stopAutoPlay();
    this.removeListeners();

    clearTimeout(this.delayTimer.current);
  }

  toggleInProcess = (inProcess) => {
    this.setState({
      inProcess,
    });
  };

  startAutoPlay = () => {
    const { autoPlay, autoPlayDuration, items } = this.props;
    const start = () => this.autoPlayRef.current();

    if (!autoPlay || items.length < 2) {
      return;
    }

    this.autoPlayInterval = setInterval(start, autoPlayDuration);
  };

  stopAutoPlay = () => {
    clearInterval(this.autoPlayInterval);
  };

  keyUpListener = ({ keyCode }) => {
    switch (keyCode) {
      case 37: {
        this.prev();
        break;
      }
      case 39: {
        this.next();
        break;
      }
      default:
        break;
    }
  };

  addListeners = () => {
    const { items, withKeyboardControls } = this.props;

    if (items.length < 2 || !withKeyboardControls) {
      return;
    }

    document.addEventListener('keydown', this.keyUpListener, false);
  };

  removeListeners = () => {
    document.removeEventListener('keydown', this.keyUpListener, false);
  };

  next = (clearInterval = true) => {
    const { activeId, disabled } = this.state;

    const { onChange, items, itemsOnPack } = this.props;

    if (this.disabled || disabled) {
      return;
    }

    this.setState({
      inProcessCircle: false,
    });

    this.toggleInProcess(true);

    this.disabled = true;

    if (clearInterval) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }

    const newIndex = getNextIdx(activeId, Math.ceil(items.length / itemsOnPack));

    onChange(newIndex, 'next');

    this.setState({
      activeId: newIndex,
    });
  };

  prev = (clearInterval = true) => {
    const { activeId } = this.state;

    const { onChange, items, itemsOnPack, disabled } = this.props;

    if (this.disabled || disabled) {
      return;
    }

    this.setState({
      inProcessCircle: false,
    });

    this.toggleInProcess(true);

    this.disabled = true;

    if (clearInterval) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }

    const newIndex = getPrevIdx(activeId, Math.ceil(items.length / itemsOnPack));

    onChange(newIndex, 'prev');

    this.setState({
      activeId: newIndex,
    });
  };

  render() {
    const {
      duration = 0,
      id,
      itemsOnPack,
      items,
      titleComponent,
      button,
      withControls,
      withCount,
      arrowIconColor,
      arrowIconType,
      isNotDesktop,
      height,
      customCircle,
      className,
      listClassNames,
      arrowClassNames,
      controlsClassName,
      controlClassName,
    } = this.props;

    const { activeId, inProcessCircle } = this.state;

    const mobileType = isNotDesktop || (!isNotDesktop && height <= 736);

    return (
      <div className={classNames([styles.slider, globalStyles.breakWord, className])}>
        <SliderList
          duration={duration}
          inProcessCircle={inProcessCircle}
          customCircle={customCircle}
          listClassNames={listClassNames}
          mobileType={mobileType}
          id={id}
          titleComponent={titleComponent}
          items={items}
          activeId={activeId}
          itemsOnPack={itemsOnPack}
          packCount={Math.ceil(items.length / itemsOnPack)}
        />
        {items.length > 1 && withControls && (
          <SliderControls
            arrowClassNames={arrowClassNames}
            mobileType={mobileType}
            arrowIconColor={arrowIconColor}
            arrowIconType={arrowIconType}
            next={this.next}
            prev={this.prev}
          />
        )}
        {withControls && withCount && (
          <SliderCounter
            controlsClassName={controlsClassName}
            controlClassName={controlClassName}
            mobileType={mobileType}
            id={id}
            count={Math.ceil(items.length / itemsOnPack)}
            activeId={activeId}
            items={items}
            button={button}
          />
        )}
      </div>
    );
  }
}

SliderWrapper.defaultProps = SliderDefaultProps;

SliderWrapper.propTypes = SliderPropTypes;

export default SliderWrapper;
