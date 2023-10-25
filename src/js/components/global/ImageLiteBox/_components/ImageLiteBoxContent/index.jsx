import { Component } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import Slider from '@/components/common/Slider';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import Button from '@/components/ui/buttons/Button';
import CloseBigIcon from '@/icons/control/close/CloseBigIcon';
import { youTubeEnableJsapiLinkUtil } from '@/utils/linkUtils';

import styles from './styles.module.scss';

class ImageLiteBoxContent extends Component {
  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  keyUpListener = ({ keyCode }) => {
    switch (keyCode) {
      case 27: {
        const { onSetShowLiteBox } = this.props;

        onSetShowLiteBox();
        break;
      }
      default:
        break;
    }
  };

  addListeners = () => {
    document.addEventListener('keydown', this.keyUpListener, false);
  };

  removeListeners = () => {
    document.removeEventListener('keydown', this.keyUpListener, false);
  };

  render() {
    const {
      images,
      shownLiteBox,
      activeSlideIdx,
      onSetShowLiteBox,
      className,
      footerContent: FooterContent,
      withControls,
      iframe,
    } = this.props;

    return (
      <TransitionLayout isShown={shownLiteBox} duration={300}>
        <div className={classNames([styles.imageLiteBox, className])}>
          <Button type="button_string" className={styles.imageLiteBox__close} transparent onClick={() => onSetShowLiteBox()}>
            <CloseBigIcon />
          </Button>
          {!!iframe && (
            <div className={styles.imageLiteBox__video}>
              <iframe
                src={youTubeEnableJsapiLinkUtil(iframe)}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          {images.length > 0 && (
            <Slider
              className={styles.imageLiteBox__slider}
              id="imageLiteBox"
              activeSlideIdx={activeSlideIdx}
              withControls={withControls}
              withKeyboardControls
              items={images.map(({ id, file, path, fileName, alt }) => ({
                path: file || path,
                fileName: fileName || id,
                alt,
              }))}
            />
          )}
          {!!FooterContent && <FooterContent />}
        </div>
      </TransitionLayout>
    );
  }
}

ImageLiteBoxContent.defaultProps = {
  shownLiteBox: false,
  withControls: true,
  images: [],
  activeSlideIdx: 0,
  onSetShowLiteBox: () => {},
};

ImageLiteBoxContent.propTypes = {
  shownLiteBox: PropTypes.bool,
  withControls: PropTypes.bool,
  images: PropTypes.array,
  activeSlideIdx: PropTypes.number,
  onSetShowLiteBox: PropTypes.func,
};

export default ImageLiteBoxContent;
