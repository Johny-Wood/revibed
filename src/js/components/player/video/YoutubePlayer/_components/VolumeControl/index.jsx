import { useState } from 'react';

import { Direction, getTrackBackground, Range } from 'react-range';

import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import Button from '@/components/ui/buttons/Button';
import CloseIcon from '@/icons/control/close/CloseIcon';
import SoundIcon from '@/icons/player/SoundIcon';
import SoundOnIcon from '@/icons/player/SoundOnIcon';

import styles from './styles.module.scss';

const MIN_VOLUME = 0;
const MAX_VOLUME = 100;

function VolumeControl({ volume, isMuted, onChange, onClick }) {
  const [isHoveredVolume, setIsHoveredVolume] = useState(false);

  return (
    <div
      className={styles.videoPlayerVolumeVideo}
      onMouseEnter={() => {
        if (isHoveredVolume) {
          return;
        }
        setIsHoveredVolume(true);
      }}
      onMouseLeave={() => {
        if (!isHoveredVolume) {
          return;
        }
        setIsHoveredVolume(false);
      }}
    >
      <Button type="button_string" className={styles.videoPlayerVolumeVideo__button} onClick={onClick}>
        <SoundIcon />
        <span className={styles.videoPlayerVolumeVideo__button__icon_toggle}>
          {!isMuted && volume > 0 ? <SoundOnIcon /> : <CloseIcon isSmall />}
        </span>
      </Button>
      <DesktopLayout>
        <TransitionSwitchLayout isShown={isHoveredVolume}>
          <div className={styles.videoPlayerVolumeVideo__range}>
            <div className={styles.videoPlayerVolumeVideo__range__content}>
              <Range
                max={MAX_VOLUME}
                min={MIN_VOLUME}
                step={1}
                onChange={onChange}
                renderTrack={({ props, children }) => (
                  <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    className={styles.rangeTrack}
                    style={{
                      ...props.style,
                    }}
                  >
                    <div
                      ref={props.ref}
                      className={styles.rangeTrack__line}
                      style={{
                        background: getTrackBackground({
                          values: !isMuted ? volume : [MIN_VOLUME],
                          colors: ['#1A1A1A', '#BDBDBD'],
                          direction: Direction.Up,
                          min: MIN_VOLUME,
                          max: MAX_VOLUME,
                        }),
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className={styles.rangeThumb}
                    style={{
                      ...props.style,
                    }}
                  />
                )}
                values={!isMuted ? volume : [MIN_VOLUME]}
                direction={Direction.Up}
              />
            </div>
          </div>
        </TransitionSwitchLayout>
      </DesktopLayout>
    </div>
  );
}

export default VolumeControl;
