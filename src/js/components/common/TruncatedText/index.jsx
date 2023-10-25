import { splitTextUtil } from '@/utils/textUtils';

function TruncatedText({ text = '', sliceLength = 0 }) {
  const { introText } = splitTextUtil(text, sliceLength);

  return <span>{introText}</span>;
}

export default TruncatedText;
