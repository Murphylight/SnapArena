export interface GeoLocationData {
  country_code: string;
  country_name: string;
  city: string;
  region: string;
  currency: string;
  currency_name: string;
}

export const getGeoLocation = async (): Promise<GeoLocationData> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching location:', error);
    // Retourner les valeurs par défaut en cas d'erreur
    return {
      country_code: 'US',
      country_name: 'United States',
      city: 'Unknown',
      region: 'Unknown',
      currency: 'USD',
      currency_name: 'US Dollar'
    };
  }
}; 