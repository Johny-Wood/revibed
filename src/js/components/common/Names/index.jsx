import classNames from 'classnames';
import PropTypes from 'prop-types';

import TruncatedText from '@/components/common/TruncatedText';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { projectArtistsUtil } from '@/utils/project/projectDetailsUtil';

import styles from './styles.module.scss';

const artistsNamesStr = (artists = []) => projectArtistsUtil({ artists });

const renderContent = ({
  artistsNames,
  albumTitle,
  truncatedText: { sliceLengthAlbum = 0, sliceLengthArtists = 0 } = {},
  afterContent: AfterContent = () => null,
  afterContentProps,
  titleClassName,
  albumClassName,
  isInline,
}) => (
  <>
    {!!artistsNames && (
      <span className={classNames([styles.projectNames__project__title, titleClassName])}>
        {sliceLengthArtists ? <TruncatedText text={artistsNames} sliceLength={sliceLengthArtists} /> : artistsNames}
      </span>
    )}
    <AfterContent {...afterContentProps} />
    {isInline && <>&nbsp;–&nbsp;</>}
    <span className={classNames([styles.projectNames__project__album__title, albumClassName])}>
      {sliceLengthAlbum ? <TruncatedText text={albumTitle} sliceLength={sliceLengthAlbum} /> : albumTitle}
    </span>
  </>
);

const renderNames = ({
  artists,
  albumTitle,
  truncatedText,
  afterContent,
  afterContentProps,
  titleClassName,
  albumClassName,
  titleTagNumber,
  titlesClassName,
  isInline,
}) => {
  const artistsNames = artistsNamesStr(artists);
  const classNamesEnd = classNames([
    styles.projectNames__project__names__title,
    isInline && styles.projectNames__project__names__title_inline,
    titlesClassName,
  ]);

  if (titleTagNumber === 1) {
    return (
      <h1 className={classNamesEnd}>
        {renderContent({
          artistsNames,
          albumTitle,
          truncatedText,
          titleClassName,
          albumClassName,
          afterContent,
          afterContentProps,
          isInline,
        })}
      </h1>
    );
  }

  return (
    <h2 className={classNamesEnd}>
      {renderContent({
        artistsNames,
        albumTitle,
        truncatedText,
        titleClassName,
        albumClassName,
        afterContent,
        afterContentProps,
        isInline,
      })}
    </h2>
  );
};

function Names({
  artists = [],
  albumTitle,
  isRoute,
  truncatedText: { sliceLengthAlbum = 0, sliceLengthArtists = 0 } = {},
  truncatedText,
  href,
  afterContent,
  afterContentProps,
  isInline,
  titleTagNumber,
  onClick,
  className,
  titlesClassName,
  titleClassName,
  albumClassName,
}) {
  const classNamesEnd = classNames([
    styles.projectNames,
    sliceLengthArtists === 0 && styles.projectNames_artists_shadow,
    sliceLengthAlbum === 0 && styles.projectNames_album_shadow,
    className,
  ]);

  const titleText = `${artistsNamesStr(artists) ? `${artistsNamesStr(artists)} - ` : ''}${albumTitle}`;

  if (isRoute) {
    return (
      <LinkRoute className={classNamesEnd} href={href} title={titleText} onClick={onClick}>
        {renderNames({
          artists,
          albumTitle,
          truncatedText,
          afterContent,
          afterContentProps,
          titleClassName,
          albumClassName,
          isInline,
          titlesClassName,
          titleTagNumber,
        })}
      </LinkRoute>
    );
  }

  return (
    <div className={classNamesEnd} title={titleText}>
      {renderNames({
        artists,
        albumTitle,
        truncatedText,
        afterContent,
        afterContentProps,
        titleClassName,
        albumClassName,
        isInline,
        titlesClassName,
        titleTagNumber,
      })}
    </div>
  );
}

Names.defaultProps = {
  artists: [],
  albumTitle: '',
  isRoute: true,
  afterContentProps: {},
  truncatedText: {
    sliceLengthAlbum: 0,
    sliceLengthArtists: 0,
  },
  href: undefined,
  onClick: () => {},
  isInline: false,
  titleTagNumber: 2,
};

Names.propTypes = {
  artists: PropTypes.array,
  albumTitle: PropTypes.string,
  isRoute: PropTypes.bool,
  afterContentProps: PropTypes.object,
  truncatedText: PropTypes.object,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClick: PropTypes.func,
  isInline: PropTypes.bool,
  titleTagNumber: PropTypes.number,
};

export default Names;
