/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
