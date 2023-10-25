function ActiveYoutubeTitleAfterContent({ foundActiveIndex, youtubeLinks = [] }) {
  return (
    <span className="t-size_12 m-bottom-10">
      {foundActiveIndex}/{youtubeLinks.length}
    </span>
  );
}

export default ActiveYoutubeTitleAfterContent;
