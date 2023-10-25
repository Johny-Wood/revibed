import { useMemo } from 'react';

import MarketplaceCardSectionLayout from '@/components/marketplace/MarketplaceCard/_components/MarketplaceCardSectionLayout';
import MarketplaceCardTrack from '@/components/marketplace/MarketplaceCard/_components/MarketplaceCardTrack';
import AudioPlayer from '@/components/player/audio/AudioPlayer';
import MarketplaceAudioPlayerHook from '@/hooks/marketplace/MarketplaceAudioPlayerHook';
import { MarketplaceCardStatusHook } from '@/hooks/marketplace/MarketplaceCardStatusHook';
import { marketplaceGetPlayListUtil } from '@/utils/marketplace/marketplacePlayerUtil';

function MarketplaceCardTracks({
  marketplaceCardId,
  activeTrackId,
  info,
  info: {
    target: { tracksGoods = [] } = {},
    release: { tracks = [] } = {},
    alreadyPurchased: albumAlreadyPurchased,
    inCart: albumInCart,
  },
}) {
  const { isPreOrder } = MarketplaceCardStatusHook(info);

  const playlist = useMemo(() => marketplaceGetPlayListUtil({ tracksGoods, tracks }), [tracksGoods, tracks]);

  const { isPlaying, playingTime, activePlayingTrack, onPause, onPlay, onNextTrack, onChangePlayingTime } =
    MarketplaceAudioPlayerHook({ playlist });

  if (tracks.length === 0) {
    return null;
  }

  return (
    <MarketplaceCardSectionLayout title="Tracks">
      {playlist.length > 0 && (
        <AudioPlayer
          playingTime={playingTime}
          isPlaying={isPlaying}
          activePlayingTrack={activePlayingTrack}
          nextTrack={onNextTrack}
          timeUpdate={onChangePlayingTime}
          onPlay={onPlay}
          onPause={onPause}
        />
      )}
      {tracks.map((track, idx) => {
        const { id } = track;

        const foundBuyTrack = tracksGoods.find(({ target: { trackId } = {} }) => id === trackId);
        const trackInfo = foundBuyTrack?.target || track;
        const {
          id: tracksGoodsId,
          price,
          inCart,
          copyrightHoldersPresent,
          purchaseAvailable,
          alreadyPurchased,
          target: { duration, preview, trackId: playingTrackId } = {},
        } = foundBuyTrack || {};

        return (
          <MarketplaceCardTrack
            {...trackInfo}
            albumAlreadyPurchased={albumAlreadyPurchased}
            marketplaceCardId={marketplaceCardId}
            trackId={tracksGoodsId}
            key={`marketplace-track-${id}`}
            idx={idx}
            playingTrackId={playingTrackId}
            preview={preview}
            isActive={activeTrackId === id}
            price={price}
            inCart={inCart || albumInCart}
            copyrightHoldersPresent={copyrightHoldersPresent}
            purchaseAvailable={purchaseAvailable}
            alreadyPurchased={alreadyPurchased}
            duration={duration}
            preOrder={isPreOrder}
            isPlaying={isPlaying}
            playingTime={playingTime}
            activePlayingTrack={activePlayingTrack}
            onPlay={onPlay}
            onPause={onPause}
          />
        );
      })}
    </MarketplaceCardSectionLayout>
  );
}

export default MarketplaceCardTracks;
