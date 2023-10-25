import { useState } from 'react';

import PropTypes from 'prop-types';

import ListWrapper, { ListWrapperDefaultProps, ListWrapperPropTypes } from '@/components/common/list/ListWrapper';
import MarketplaceGoods from '@/components/marketplace/MarketplaceGoods';
import AudioPlayer from '@/components/player/audio/AudioPlayer';
import MarketplaceAudioPlayerHook from '@/hooks/marketplace/MarketplaceAudioPlayerHook';
import { marketplaceGetPlayListUtil } from '@/utils/marketplace/marketplacePlayerUtil';

const MarketplaceList = ({ location, items, itemComponent, ...props }) => {
  const [playlist, setPlaylist] = useState([]);

  const playlistFunction = (itemId) => {
    const foundActivePlayingGoods = items.find(({ id }) => id === itemId);

    if (!foundActivePlayingGoods) {
      return [];
    }

    const { target: { tracksGoods = [] } = {}, release: { tracks = [] } = {} } = foundActivePlayingGoods;

    const updatedPlaylist = marketplaceGetPlayListUtil({ tracksGoods, tracks });

    setPlaylist(updatedPlaylist);

    return updatedPlaylist;
  };

  const { isPlaying, playingTime, activePlayingItemId, activePlayingTrack, onPause, onPlay, onNextTrack, onChangePlayingTime } =
    MarketplaceAudioPlayerHook({ playlist });

  return (
    <>
      {items.length > 0 && (
        <AudioPlayer
          isPlaying={isPlaying}
          playList={playlist}
          activePlayingTrack={activePlayingTrack}
          activePlayingItemId={activePlayingItemId}
          nextTrack={onNextTrack}
          timeUpdate={onChangePlayingTime}
          onPlay={onPlay}
          onPause={onPause}
        />
      )}
      <ListWrapper
        location={location}
        itemComponent={itemComponent}
        itemRestProps={{
          playList: playlistFunction,
        }}
        itemInnerProps={{
          playButton: {
            isPlaying,
            activePlayingItemId,
            playingTime,
            playList: playlist,
            onClickPlay: onPlay,
            onClickPause: onPause,
          },
        }}
        items={items}
        {...props}
      />
    </>
  );
};

MarketplaceList.defaultProps = {
  itemComponent: MarketplaceGoods,
  ...ListWrapperDefaultProps,
};

MarketplaceList.propTypes = {
  itemComponent: PropTypes.any,
  ...ListWrapperPropTypes,
};

export default MarketplaceList;
