export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

export const getAvatarChars = (firstName, lastName) => {
  let result = firstName && firstName[0] ? firstName[0] : '';
  result += lastName && lastName[0] ? lastName[0] : '';
  return result.toUpperCase();
};

export const getFullName = (firstName, lastName, defaultName = '') => {
  let result = firstName ? `${firstName} ` : '';
  result += lastName ? lastName : '';
  return result || defaultName;
};
