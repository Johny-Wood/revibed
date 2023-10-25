function ProjectShipFrom({ name, country = '' }) {
  if (!country) {
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
      <span>{country}</span>
    </>
  );
}

export default ProjectShipFrom;
