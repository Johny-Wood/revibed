import TruncatedText from '@/components/common/TruncatedText';

function ProjectCountry({ sliceLength = 100, country: { title_en: titleEn = '' } = {} }) {
  return (
    <span title={titleEn}>
      <TruncatedText sliceLength={sliceLength} text={titleEn} />
    </span>
  );
}

export default ProjectCountry;
