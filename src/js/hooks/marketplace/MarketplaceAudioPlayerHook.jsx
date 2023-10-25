import { useCallback, useState } from 'react';

import { marketplaceNextTrackUtil } from '@/utils/marketplace/marketplacePlayerUtil';

const activePlayingTrackInitial = { id: -1, src: '' };

const MarketplaceAudioPlayerHook = ({ playlist }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTime, setPlayingTime] = useState(0);
  const [activePlayingItemId, setActivePlayingItemId] = useState(-1);
  const [activePlayingTrack, setActivePlayingTrack] = useState(activePlayingTrackInitial);

  const onSetActivePlayingTrack = useCallback(
    (track) => {
      if (!track) {
        return;
      }

      if (activePlayingTrack.id !== track.id) {
        setPlayingTime(0);
      }

      setActivePlayingTrack(track);

      setIsPlaying(true);
    },
    [activePlayingTrack.id]
  );

  const onPlay = useCallback(
    (track, id) => {
      if (!track) {
        return;
      }

      onSetActivePlayingTrack(track);

      setIsPlaying(true);

      setActivePlayingItemId(id || activePlayingItemId);
    },
    [activePlayingItemId, onSetActivePlayingTrack]
  );

  const onPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const onNextTrack = useCallback(() => {
    marketplaceNextTrackUtil({
      activePlayingTrack,
      playlist,
      setActivePlayingTrack: onSetActivePlayingTrack,
    });
  }, [activePlayingTrack, onSetActivePlayingTrack, playlist]);

  const onChangePlayingTime = useCallback((newPlayingTime, callback) => {
    setPlayingTime(newPlayingTime);

    if (!callback) {
      return;
    }

    callback();
  }, []);

  return {
    isPlaying,
    playingTime,
    activePlayingTrack,
    activePlayingItemId,
    onPlay,
    onPause,
    onNextTrack,
    onChangePlayingTime,
  };
};

export default MarketplaceAudioPlayerHook;
