export interface Weather {
    moisture: number;
    temperature: number;
    turbulence: string;
}

export interface Location {
    latitude: number;
    longitude: number;
    altitude: number;
    timestamp: number;
}

export interface ImageData {
    originalUri: string;
    annotatedUri?: string;
    detection: string;
    remedy: string;
    weather: Weather;
    date: string;
    location: Location | null;
}

export interface Folder {
    id: string;
    name: string;
    plantName: string;
    seedCompany: string;
    images: ImageData[];
    createdAt: string;
    location: Location | null;
    weatherConditions: Weather;
    sowingDate: string;
} 