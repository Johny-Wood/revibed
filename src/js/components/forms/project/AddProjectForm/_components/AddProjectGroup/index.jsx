function AddProjectGroup({ title = '', afterTitle = '', offsetTop = 15, children }) {
  return (
    <>
      <div className={`inputs-group-name m-bottom-5 m-top-${offsetTop}`}>
        {title}
        {afterTitle && <span className="c-gray-2">{afterTitle}</span>}
      </div>
      {children}
    </>
  );
}

export default AddProjectGroup;
