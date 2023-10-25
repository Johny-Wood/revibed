export const marketplaceGetPlayListUtil = ({ tracksGoods = [], tracks = [] }) => {
  const playListTmp = [];
  const tracksIds = tracks.map(({ id }) => id) || [];

  tracksIds.forEach((releaseTrackId) => {
    const foundTrack = tracksGoods.find(({ target: { trackId } = {} }) => trackId === releaseTrackId);

    if (foundTrack) {
      const { target: { trackId, preview } = {} } = foundTrack;
      playListTmp.push({ src: preview, id: trackId });
    }
  });

  return playListTmp;
};

export const marketplaceGetPlayListFundingNowUtil = ({ tracks = [] }) => {
  const playListTmp = [];
  const tracksIds = tracks.map(({ track: { id } }) => id) || [];

  tracksIds.forEach((releaseTrackId) => {
    const foundTrack = tracks.find(({ file: { trackId } = {} }) => trackId === releaseTrackId);

    if (foundTrack) {
      const { file: { trackId, preview } = {} } = foundTrack;
      playListTmp.push({ src: preview, id: trackId });
    }
  });

  return playListTmp;
};

export const marketplaceNextTrackUtil = ({ activePlayingTrack, playlist = [], setActivePlayingTrack }) => {
  if (!setActivePlayingTrack) {
    return;
  }

  const foundActiveTrackInPlaylistIndex = playlist.findIndex(({ id }) => id === activePlayingTrack.id);

  if (foundActiveTrackInPlaylistIndex === -1 || playlist.length === foundActiveTrackInPlaylistIndex + 1) {
    setActivePlayingTrack(playlist[0]);
  }

  setActivePlayingTrack(playlist[foundActiveTrackInPlaylistIndex + 1]);
};
