const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  /node_modules\/drizzle-kit\/.*/,
  /node_modules\/undici\/.*/,
];

module.exports = config;