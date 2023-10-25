import { memo, useMemo } from 'react';

import classNames from 'classnames';

import Button from '@/components/ui/buttons/Button';
import ProgressCircleIcon from '@/icons/ProgressCircleIcon';

import styles from './styles.module.scss';

const PlayerPlayPauseButton = memo(
  ({
    isPlaying,
    disabled,
    playingTime,
    className,
    disabledClassName,
    contentClassName,
    onClickPause = () => {},
    onClickPlay = () => {},
  }) => {
    const classNameButton = useMemo(
      () =>
        classNames(styles.startPlayVideo, disabled && styles.startPlayVideo_disabled, disabled && disabledClassName, className),
      [disabled, className, disabledClassName]
    );

    if (isPlaying) {
      return (
        <Button
          type="button_string"
          className={classNames(classNameButton, isPlaying && styles.startPlayVideo_playing)}
          disabled={disabled}
          onClick={onClickPause}
          aria-label="pause project video"
        >
          <span className={classNames(styles.startPlayVideo__content, contentClassName)}>
            <ProgressCircleIcon value={playingTime} />
            <span className={styles.lines}>
              <span className={styles.line} />
              <span className={styles.line} />
            </span>
          </span>
        </Button>
      );
    }

    return (
      <Button
        type="button_string"
        className={classNameButton}
        disabled={disabled}
        onClick={onClickPlay}
        aria-label="play project video"
      >
        <span className={classNames(styles.startPlayVideo__content, contentClassName)}>
          <ProgressCircleIcon value={playingTime} />
          <span className={classNames(styles.triangle)} />
        </span>
      </Button>
    );
  }
);

export default PlayerPlayPauseButton;
