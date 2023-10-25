import cloneDeep from 'lodash/cloneDeep';

export const loadYTPlayerUtil = (callback = () => {}) => {
  if (typeof window.YT === 'undefined' || typeof window.YT.Player === 'undefined') {
    const tag = document.createElement('script');
    const firstScriptTag = document.getElementsByTagName('script')[0];

    tag.src = 'https://www.youtube.com/iframe_api';
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    tag.addEventListener('load', () => {
      setTimeout(() => {
        callback();
      }, 500);
    });
  } else {
    callback();
  }
};

export const mapProjectToPlaylistItemUtil = ({ id: projectId, albumTitle, title, artists, youtubeLink }) => ({
  id: projectId,
  projectId,
  albumTitle,
  title,
  artists,
  youtubeLink,
});

export const mapWantedToPlaylistItemUtil = ({
  id,
  releaseInfo: { id: projectId, album: albumTitle, artists, youtubeLink } = {},
}) => ({
  id,
  projectId,
  albumTitle,
  artists,
  youtubeLink,
});

export const getWithoutEmptyLinksFromPlaylistUtil = (playList = []) =>
  cloneDeep(playList).filter(({ youtubeLink }) => youtubeLink);

export const getWithoutDuplicateLinksFromProjectsUtil = ({ projects = [], playingId = -1, playingProjectId = -1 } = {}) => {
  const list = [];

  const playingIdx = projects.findIndex(({ id }) => id === playingId);

  projects.forEach((item) => {
    const { id, projectId } = item;

    const foundDoubleProjectIdx = list.findIndex(({ projectId: foundProjectId }) => projectId === foundProjectId);

    if (playingId === id || playingProjectId !== projectId) {
      if (foundDoubleProjectIdx > -1) {
        if (playingIdx > foundDoubleProjectIdx) {
          list.splice(foundDoubleProjectIdx, 1);
          list.push(item);
        }
      } else {
        list.push(item);
      }
    }
  });

  return list;
};
