function ProjectConditionInfo({ name, condition: { shortTitle = '', title = '' } = {} }) {
  if (!shortTitle) {
    return null;
  }

  return (
    <>
      {name && (
        <span className="c-gray-2">
          {name}
          :&nbsp;
        </span>
      )}
      <span title={`${title} (${shortTitle})`}>{shortTitle}</span>
    </>
  );
}

export default ProjectConditionInfo;
