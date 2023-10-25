import classNames from 'classnames';

import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import ViewportHook from '@/hooks/viewport/ViewportHook';

type PreloaderProps = {
  id?: string;
  pageHeight?: number | string;
  type?: 'container' | 'block' | 'element';
  color?: string;
  isShown?: boolean;
  withLoader?: boolean;
  duration?: number;
  opacity?: number;
  withOffsets?: boolean;
  fullScreen?: boolean;
  colorDots?: 'threecolor' | 'gray';
  size?: 'small' | 'normal';
  className?: string;
  containerClassName?: string;
  withBgColor?: boolean;
};

function Preloader({
  id,
  type = 'block',
  color = 'white',
  isShown,
  withLoader = true,
  duration,
  opacity = 0.8,
  size = 'normal',
  fullScreen,
  colorDots = 'gray',
  withOffsets = true,
  className,
  containerClassName,
  pageHeight,
  withBgColor,
}: PreloaderProps) {
  const { height } = ViewportHook();

  return (
    <TransitionSwitchLayout id={id} isShown={isShown} duration={duration}>
      <span
        className={classNames(
          'preloader-process',
          color,
          `preloader-process_${type}`,
          withOffsets && 'preloader-process_offsets',
          fullScreen && 'preloader-process_full_screen',
          `preloader-process_type_${type}`,
          `preloader-process_${size}`,
          `preloader-process_color_dots_${colorDots}`,
          withBgColor && 'preloader-process_bg',
          className
        )}
        style={{ backgroundColor: `rgba(255, 255, 255, ${opacity})` }}
      >
        <span
          className={classNames('preloader-process__container', containerClassName)}
          style={{
            height: fullScreen ? pageHeight || height : '100%',
          }}
        >
          {withLoader && (
            <span className="preloader-process__dots">
              <span className="preloader-process__dot" />
            </span>
          )}
        </span>
      </span>
    </TransitionSwitchLayout>
  );
}

export default Preloader;
