export const parseRuntime = (value) => {
  if (value === 0 || value === null || value === undefined) {
    return null;
  }
  const hour = Math.floor(value / 60) ? `${Math.floor(value / 60)}h` : ``;
  const min = value % 60 ? `${value % 60}m` : ``;

  return `${hour} ${min}`;
};
