import { getTrackBackground, Range } from 'react-range';

import styles from './styles.module.scss';

function VideoProcess({ played, videoDuration, onChange }) {
  return (
    <div className={styles.videoPlayerProcess}>
      {videoDuration > 0 && (
        <Range
          values={played}
          max={videoDuration}
          min={0}
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
                    values: played,
                    colors: ['#0066FF', '#1A1A1A'],
                    min: 0,
                    max: videoDuration,
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
              style={{
                ...props.style,
              }}
            />
          )}
        />
      )}
    </div>
  );
}

export default VideoProcess;
