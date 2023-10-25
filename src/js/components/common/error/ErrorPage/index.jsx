import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonMessagesConstants } from '@/constants/common/message';

function ErrorPage({ numberError = '', textError = CommonMessagesConstants.ERROR, withGoMainPage = true }) {
  return (
    <div className="t-center">
      <h2 className="t-size_64">
        <b>{numberError}</b>
      </h2>
      <div className="m-top-10">
        <h1 className="t-size_32">{textError}</h1>
      </div>
      {withGoMainPage && (
        <div className="m-top-55 c-gray-2">
          <h3>
            Go back to&nbsp;
            <LinkRoute href="/" className="c-blue underline" text="main page" />
          </h3>
        </div>
      )}
    </div>
  );
}

export default ErrorPage;
