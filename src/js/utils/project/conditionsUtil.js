export const conditionOptionUtil = ({ id, title, shortTitle }) => ({
  forProject: true,
  id,
  name: title,
  value: id,
  label: `${title}${shortTitle ? ` (${shortTitle})` : ''}`,
});
