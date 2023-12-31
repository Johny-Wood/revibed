export const CommonRegExpConstants = {
  EMAIL_VALIDATE: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
  NAME_VALIDATE: /^[A-Za-z0-9.,_-]+$/,
  FIELD_VALIDATE: /^[\w\s.,()-]+$/,
  LATIN_AND_NUMBERS_VALIDATE: /^[A-Za-z0-9]+$/,
  PASSWORD_VALIDATE: /^(?=.{6,}$)(?=.*\d)(?=.*\D).*$/,
  FLOAT_DIGIT: /^[0-9.,]*$/,
  INT: /^[0-9]*$/,
};
