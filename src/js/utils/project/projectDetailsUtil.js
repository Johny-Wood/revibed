export const projectArtistsUtil = ({ artists = [] }) => {
  let artistsNamesStr = '';

  artists.forEach(({ name }, idx) => {
    artistsNamesStr = `${artistsNamesStr}${name}${idx < artists.length - 1 ? ', ' : ''}`;
  });

  return artistsNamesStr;
};

export const projectLabelsUtil = ({ labels = [] }) => {
  let labelsNamesStr = '';

  labels.forEach(({ name }, idx) => {
    labelsNamesStr = `${labelsNamesStr}${name}${idx < labels.length - 1 ? ', ' : ''}`;
  });

  return labelsNamesStr;
};

export const projectNameUtil = ({ artists = [], albumTitle = '', separator = ' - ' }) =>
  `${artists.length > 0 ? `${projectArtistsUtil({ artists })}${separator}` : ''}${albumTitle}`;

export const releaseFormatsDescriptionUtil = (descriptions = []) => {
  let formatDescriptionStr = '';

  descriptions.forEach((description, idx) => {
    formatDescriptionStr = `${formatDescriptionStr}${description}${idx < descriptions.length - 1 ? ', ' : ''}`;
  });

  return formatDescriptionStr;
};

export const releaseFormatsUtil = ({ formats = [] }) => {
  let formatsStr = '';

  formats.forEach((item, idx) => {
    const { name, descriptions } = item;

    formatsStr = `${formatsStr}${name}${descriptions.length > 0 ? ', ' : ''}${releaseFormatsDescriptionUtil(descriptions)}${
      idx !== formats.length - 1 ? ', ' : ''
    }`;
  });

  return formatsStr;
};

export const releaseGenresUtil = ({ genres = [] }) => {
  let genresStr = '';

  genres.forEach((item, idx) => {
    const { name } = item;

    genresStr = `${genresStr}${name}${idx < genres.length - 1 ? ', ' : ''}`;
  });

  return genresStr;
};

export const projectCoverAltUtil = ({ artists, albumTitle, prefix = '' }) =>
  `${prefix ? `${prefix}.` : ''}The music release of ${projectNameUtil({
    artists,
    albumTitle,
    separator: ', ',
  })}`;
