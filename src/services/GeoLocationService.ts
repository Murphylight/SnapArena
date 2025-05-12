interface GeoLocationData {
  country_code: string;
  country_name: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Get user's geolocation data / Obtenir les données de géolocalisation de l'utilisateur
export const getGeoLocation = async (): Promise<GeoLocationData> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch geolocation data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting geolocation:', error);
    throw error;
  }
};

// Get user's current position / Obtenir la position actuelle de l'utilisateur
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}; 