"use server"

import { GooglePlacesResponse } from "../types";

// Returns 5 latest Google reveiws for given Place ID
export async function getNewestReviews(placeID: string): Promise<GooglePlacesResponse | null> {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=reviews&reviews_sort=newest&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }

    const rawData: GooglePlacesResponse = await response.json();
    return rawData;

  } catch (error) {
    // Handle network errors or other exceptions
    console.error("Failed to fetch provider data:", error);
    return null;
  }
}
