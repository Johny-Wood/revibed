export const CommonErrorMessages = {
  // API
  API_ERROR: 'API_ERROR',
  API_ERROR_DATA: {
    error: 'API_ERROR',
    errorCode: -1,
  },

  // GLOBAL
  ERROR_MESSAGE: 'An error has occurred! Try later.',
  REQUIRED: 'This field is required',
  ASSERT_TRUE: 'Consent required',
  NOT_NULL: 'Cannot be empty',
  NOT_FOUND: 'Not found',
  ITEM_NOT_FOUND: 'Item not found',
  RELEASE_NOT_FOUND: 'Release not found',
  INSUFFICIENT_FUNDS: 'Insufficient funds',
  MIN_VALUE: 'The value must not be less than ',
  MAX_VALUE: 'The value must not be more than ',
  AGREE: 'Consent required',
  INVALID_LINK: 'Invalid link',

  MIN_LENGTH: 'No less than ',
  MAX_LENGTH: 'No more than ',
  CHARACTERS: ' characters',

  USE_GEM_FOR_CREATE_PROJECT_NOT_ALLOWED: 'Using a gem to create a project is not allowed',
  USE_GOLDEN_COIN_FOR_CREATE_PROJECT_NOT_ALLOWED: 'Using Golden Coin to create a project is not allowed',
  CREATE_PROJECT_GEM_NOT_EXISTS: 'The gem does not exist',

  // FILES
  FILE_MAX: 'Large file size. Size should not include ',
  FILE_SIZE: 'Size should not include ',
  MAX_FILE_SIZE: 'Large file size. Size should not include ',
  MIN_FILE_SIZE: 'Small file size. Size should not include ',
  FILE_TYPE: 'Invalid file format. Possible formats: ',

  // COUNTRY
  COUNTRY_NOT_FOUND: 'Country not found',

  // USER
  NO_SUCH_USER: 'User with this email was not found',
  USER_BANNED: 'Your account is temporary locked',

  // USER_NAME
  USER_NAME_PATTERN: 'Usernames can only contain latin letters, numbers, dashes, underscores, and periods',
  USERNAME_ALREADY_EXISTS: 'This username is already taken',
  USER_NAME_MAX_LENGTH: 255,
  USER_NAME_MAX_LENGTH_ERROR: 'No more than 255 characters',

  AVATAR_WRONG_MIME_TYPE: 'Wrong mime type. Allowed JPEG, JPG or PNG',
  AVATAR_WRONG_RESOLUTION: 'Wrong resolution. Permitted resolution range - 350х350 to 1100х1100 px',

  // EMAIL
  EMAIL_PATTERN: 'Invalid email format',
  EMAIL_NOT_CONFIRMED: 'Email not confirmed',
  EMAIL_ALREADY_EXISTS: 'User with this email already exists',
  EMAIL_MAX_LENGTH: 255,
  EMAIL_MAX_LENGTH_ERROR: 'No more than 255 characters',

  // PASSWORD
  INVALID_PASSWORD: 'Incorrect password',
  PASSWORD_PATTERN: 'Passwords must countain at least one letter and one number',
  REPEAT_PASSWORD_ERROR: 'The passwords entered do not match',
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MIN_LENGTH_ERROR: 'Passwords must be six characters or longer',

  // PROJECT
  PROJECT_INVALID_LINK: 'Please enter a valid link to an item',

  // PROMO
  PROMO_ACTION_NOT_ACTIVE: 'Promo action not active',
  PROMO_CODE_NOT_FOUND: 'Promo code not found or already used',
  PROMO_BCC_CODE_ACTIVATION_LIMIT: 'You can only activate one promo code',
  REFERRAL_CODE_NOT_FOUND: 'Refferal code not found',

  MESSAGE_MAX_LENGTH: 5000,
  MESSAGE_MAX_LENGTH_ERROR: 'No more than 5000 characters',

  COMMENT_MAX_LENGTH: 500,
  COMMENT_MAX_LENGTH_ERROR: 'No more than 500 characters',

  REFERRAL_CODE_MIN_LENGTH: 8,
  REFERRAL_CODE_MIN_LENGTH_ERROR: 'No less than 8 characters',

  PHONE_WRONG: 'Wrong phone number',
  PHONE_ALREADY_CONFIRMED: 'Phone number already confirmed',
  PHONE_ALREADY_EXISTS: 'Phone number already exists',

  CONFIRM_PHONE_CODE_INVALID: 'Invalid confirm code',
};
