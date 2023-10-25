// import acceptLanguageParser from 'accept-language-parser';

type DetectDefaultSelectedLanguageConfig = {
  userLanguage: {
    language: string;
  };
};

const detectDefaultSelectedLanguage = ({
  userLanguage,
} // headersAcceptLanguage,
: DetectDefaultSelectedLanguageConfig): string => {
  if (userLanguage && userLanguage.language) {
    return userLanguage.language;
  }

  return 'en';

  // const fromHeaders = acceptLanguageParser.parse(headersAcceptLanguage || '');
  //
  // if (fromHeaders) {
  //   if (Array.isArray(fromHeaders) && fromHeaders[0]) {
  //     return fromHeaders[0].code;
  //   }
  //
  //   return fromHeaders.code;
  // }
  //
  // return null;
};

export default detectDefaultSelectedLanguage;
