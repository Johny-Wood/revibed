import ErrorWrapper from '@/pages/error/ErrorWrapper';

function Error({ statusCode }) {
  return <ErrorWrapper statusCode={statusCode} />;
}

export default Error;
