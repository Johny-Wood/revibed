import { useCallback, useEffect } from 'react';

import classNames from 'classnames';
import orderBy from 'lodash/orderBy';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import NoCover from '@/components/common/NoCover';
import LinkRoute from '@/components/ui/links/LinkRoute';
import ImageLiteBoxService from '@/services/ImageLiteBoxService';
import { projectCoverAltUtil } from '@/utils/project/projectDetailsUtil';

import styles from './styles.module.scss';

const StartPlayVideo = dynamic(() => import('@/components/player/video/StartPlayVideo'), { ssr: false });

const Cover = ({
  withPlayVideo,
  withPlayDisabled,
  projectInfo,
  projectInfo: { id } = {},
  location,
  playingId,
  playing,
  children,
  videoShown,
  videoInProcess,
  userId,
  target,
  shown,
  playButton: { component: PlayButton, isPlaying, ...playButtonProps } = {},
  containerClassName,
  noCoverClassName,
  isProject,
  albumTitle,
  artists,
  alt,
  withImageLiteBox,
  isDefault,
  covers,
  inProcess,
  isNoCover,
  href,
  onClick,
  className,
  loading,
  withoutNoCoverCircle,
}) => {
  const coversSortMain = useCallback(
    ({ withPrefix } = {}) =>
      orderBy(covers, ['isMain', 'id'], ['desc', 'asc']).map((cover, idx) => ({
        ...cover,
        alt: isProject
          ? projectCoverAltUtil({
              artists,
              albumTitle,
              prefix: covers.length > 1 && withPrefix ? idx + 1 : '',
            })
          : alt,
      })),
    [albumTitle, alt, artists, covers, isProject]
  );

  const renderCoverType = useCallback(() => {
    const classNameCover = classNames([styles.projectCover, className]);
    const classNameBlock = [classNameCover, withImageLiteBox && covers.length > 0 && globalStyles.cursorPointer];

    const src = coversSortMain()[0]?.path;
    const imgAlt = coversSortMain()[0]?.alt || alt;

    const renderContent = () => {
      if (inProcess) {
        return <span className={classNameCover} />;
      }

      if (isNoCover || ((isDefault || withImageLiteBox) && covers.length <= 0) || covers.length <= 0) {
        return (
          <span className={classNameCover}>
            <NoCover className={noCoverClassName} withOutCircle={withoutNoCoverCircle} />
          </span>
        );
      }

      return (
        <picture>
          <source srcSet={src} />
          <img src={src} alt={imgAlt} loading={loading} />
        </picture>
      );
    };

    if (withImageLiteBox && covers.length > 0) {
      return (
        <span
          className={classNames(...classNameBlock)}
          onClick={(e) => {
            e.stopPropagation();

            if (withImageLiteBox) {
              ImageLiteBoxService.setImages(coversSortMain({ withPrefix: true }));
              ImageLiteBoxService.open();
            }
          }}
        >
          <picture>
            <source srcSet={src} />
            <img src={src} alt={imgAlt} loading={loading} />
          </picture>
        </span>
      );
    }

    if (isDefault && !withImageLiteBox && covers.length <= 0) {
      return <>{renderContent()}</>;
    }

    if (isDefault || (withImageLiteBox && covers.length <= 0)) {
      return (
        <span className={classNames(...classNameBlock)}>
          <picture>
            <source srcSet={src} />
            <img src={src} alt={imgAlt} loading={loading} />
          </picture>
        </span>
      );
    }

    return (
      <LinkRoute
        className={classNames(...classNameBlock)}
        aria-label={`project-${id}`}
        href={href}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {renderContent()}
      </LinkRoute>
    );
  }, [
    alt,
    className,
    covers.length,
    coversSortMain,
    href,
    id,
    inProcess,
    isDefault,
    isNoCover,
    loading,
    noCoverClassName,
    onClick,
    withImageLiteBox,
    withoutNoCoverCircle,
  ]);

  useEffect(() => {
    if (withImageLiteBox && covers.length > 0) {
      ImageLiteBoxService.setImages(coversSortMain({ withPrefix: true }));
    }
  }, [covers.length, coversSortMain, withImageLiteBox]);

  return (
    <span
      className={classNames([
        styles.projectCoverContainer,
        withPlayVideo && styles.projectCoverContainer_with_video,
        !withPlayVideo && isDefault && !withImageLiteBox && styles.projectCoverContainer_with_liteBox,
        ((playingId === id && videoShown) || (isPlaying && !!PlayButton)) &&
          withPlayVideo &&
          styles.projectCoverContainer_playing,
        containerClassName,
      ])}
    >
      {renderCoverType()}
      {withPlayVideo &&
        (!PlayButton ? (
          <StartPlayVideo
            userId={userId}
            target={target}
            withPlayDisabled={withPlayDisabled}
            location={location}
            projectInfo={projectInfo}
            isPlayingProject={playingId === id && shown && (playing || videoInProcess)}
            className={styles.startPlayVideo}
            disabledClassName={styles.startPlayVideo_disabled}
            contentClassName={styles.startPlayVideo__content}
          />
        ) : (
          <PlayButton
            disabled={withPlayDisabled}
            className={styles.startPlayVideo}
            disabledClassName={styles.startPlayVideo_disabled}
            contentClassName={styles.startPlayVideo__content}
            isPlaying={isPlaying}
            {...playButtonProps}
          />
        ))}
      {children}
    </span>
  );
};

Cover.defaultProps = {
  size: 195,
  covers: [],
  withImageLiteBox: false,
  isDefault: false,
  href: undefined,
  inProcess: false,
  isNoCover: false,
  withPlayVideo: false,
  withPlayDisabled: false,
  onClick: () => {},
  loading: 'lazy',
  alt: 'cover',
  withoutNoCoverCircle: false,
};

Cover.propTypes = {
  size: PropTypes.number,
  covers: PropTypes.array,
  withImageLiteBox: PropTypes.bool,
  isDefault: PropTypes.bool,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  inProcess: PropTypes.bool,
  isNoCover: PropTypes.bool,
  withPlayVideo: PropTypes.bool,
  withPlayDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  loading: PropTypes.oneOf(['eager', 'lazy']),
  alt: PropTypes.string,
  withoutNoCoverCircle: PropTypes.bool,
};

export default connect((state) => ({
  playingId: state.VideoPlayerReducer.playingId,
  playing: state.VideoPlayerReducer.playing,
  videoShown: state.VideoPlayerReducer.shown,
  videoInProcess: state.VideoPlayerReducer.inProcess,
  shown: state.VideoPlayerReducer.shown,
}))(Cover);
