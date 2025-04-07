
import Constants from 'expo-constants';

const PROCESS_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_SERVER_URL || "http://13.60.171.34:8000";

const IMAGE_SERVER_URL = `${PROCESS_URL}/api/process_image/`;
const VIDEO_SERVER_URL = `${PROCESS_URL}/api/process_video/`;

const fetchFromServer = async (url, payload, signal) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });

    const responseBody = await response.text(); // Read response as text

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status} - ${responseBody}`);
    }

    return JSON.parse(responseBody); // Parse only if successful
  } catch (error) {
    console.error(`Error in fetchFromServer(${url}):`, error);
    throw error; // Re-throw for handling in UI
  }
};

export const processImageOnServer = (base64Image, signal) =>
  fetchFromServer(IMAGE_SERVER_URL, { image: base64Image }, signal);

export const processVideoOnServer = (base64Video, signal) =>
  fetchFromServer(VIDEO_SERVER_URL, { video: base64Video }, signal);