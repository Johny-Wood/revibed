const renderReleaseStyles = (items) => {
  let stylesStr = '';

  items.forEach((item, idx) => {
    const { name } = item;

    stylesStr = `${stylesStr}${name}${idx < items.length - 1 ? ', ' : ''}`;
  });

  return stylesStr;
};

const ProjectStyles = ({ items = [] }) => renderReleaseStyles(items);

export default ProjectStyles;
