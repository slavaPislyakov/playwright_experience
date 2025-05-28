export const stringFormat = (str: string, ...args: (string | number)[]): string => {
  return str.replace(/{(\d+)}/g, (match: string, index: number) => args[index].toString() || match);
};
