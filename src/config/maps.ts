interface IMapsConfig {
  driver: 'google';

  config: {
    google: {
      key: string;
    };
  };
}

export default {
  driver: process.env.LOCATION_DRIVER,

  config: {
    google: {
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
} as IMapsConfig;
