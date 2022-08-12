export const isArrayOfString = (possibleArray: any): boolean => {
  const isArray = Array.isArray(possibleArray);
  if (!isArray) return false;
  return !possibleArray.some((item) => typeof item !== "string");
};
