module.exports = function(api) {
  api.cache(true);
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
    
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './app',
            '@assets': './assets',
            '@components': './components'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};