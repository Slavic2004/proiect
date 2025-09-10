import { CarProps, FilterProps } from "@/types";
import { getMockCars } from "@/constants/mockData";

  export async function fetchCars(filters: FilterProps) {
    const { manufacturer, year, model, limit, fuel }=filters;
    const headers ={
        'X-rapidapi-key': 'b881aaec58mshf6ebef1afdaeaa2p136ca5jsna17fe1873db6',
      'X-rapidapi-host': 'cars-by-api-ninjas.p.rapidapi.com'
      }

      try {
        const params = new URLSearchParams();
        if (manufacturer) params.append('make', manufacturer);
        if (year) params.append('year', String(year));
        if (model) params.append('model', model);
        if (limit) params.append('limit', String(limit));
        if (fuel) params.append('fuel_type', fuel);

        const response = await fetch( `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?${params.toString()}`, { 
          headers: headers,
        });
        
        if (!response.ok) {
          // If we get rate limited (429) or other errors, use mock data
          if (response.status === 429) {
            console.warn('API rate limited, using mock data');
            return getMockCars(filters);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Check if result is an array, if not return mock data
        if (Array.isArray(result)) {
          // If API returns fewer than requested and we need 10, supplement with mock data
          if (limit && result.length < limit) {
            const mock = getMockCars(filters);
            return [...result, ...mock.slice(0, Math.max(0, limit - result.length))];
          }
          return result;
        } else {
          console.warn('API returned non-array result, using mock data:', result);
          return getMockCars(filters);
        }
      } catch (error) {
        console.warn('Error fetching cars, using mock data:', error);
        return getMockCars(filters);
      }
    }
 
    export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50; // Base rental price per day in dollars
  const mileageFactor = 0.1; // Additional rate per mile driven
  const ageFactor = 0.05; // Additional rate per year of vehicle age

  // Calculate additional rate based on mileage and age
  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  // Calculate total rental rate per day
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

  return rentalRatePerDay.toFixed(0);
};

export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  try {
    const url = new URL('https://cdn.imagin.studio/getimage');
    const { make, year, model } = car;
    const normalizedMake = make.toLowerCase();
    const normalizedModelFamily = model
      .split(' ')[0]
      .replace(/[^a-z0-9]/gi, '')
      .toLowerCase();
    
    url.searchParams.append('customer', 'hrjavascript-mastery');
    url.searchParams.append('make', normalizedMake);
    url.searchParams.append('modelFamily', normalizedModelFamily);
    url.searchParams.append('model', model.toLowerCase());
    url.searchParams.append('zoomType', 'fullscreen');
    url.searchParams.append('modelYear', `${year}`);
    url.searchParams.append('angle', angle ?? 'front');

    return `${url}`;
  } catch (error) {
    console.warn('Error generating car image URL:', error);
    // Return a fallback image URL
    return `/placeholder-car.jpg`;
  }
}

export const updatesearchParams = (type: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(type, value);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  
  return newPathname;
}
