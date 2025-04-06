import React, {useCallback, useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import {processImageOnServer, processVideoOnServer} from "@/services/imageService";
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import FolderManagementModal from '@/components/drone/FolderManagementModal';

import DiseasePage from '@/components/drone/DiseasePage'
import ImageInputForm from '@/components/drone/ImageInputForm'

export default function MediaProcessor() {
    const [showDiseasePage, setShowDiseasePage] = useState(false);
    const [mediaUri, setMediaUri] = useState(null);
    const [processedMediaUri, setProcessedMediaUri] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [abortController, setAbortController] = useState(null);
    const [detection, setDetection] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [isHome, setIsHome] = useState(false);
    const [remedy, setRemedy] = useState(null);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationPermissionStatus, setLocationPermissionStatus] = useState(null);

    useEffect(() => {
        checkLocationPermission();
    }, []);

    const checkLocationPermission = async () => {
        try {
            const { status } = await Location.getForegroundPermissionsAsync();
            setLocationPermissionStatus(status);
        } catch (error) {
            console.error('Error checking location permission:', error);
        }
    };

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermissionStatus(status);
            return status === 'granted';
        } catch (error) {
            console.error('Error requesting location permission:', error);
            return false;
        }
    };

    const getLocation = async () => {
        try {
            // If permission status is not set, check it first
            if (!locationPermissionStatus) {
                await checkLocationPermission();
            }

            // If permission is denied, ask again
            if (locationPermissionStatus === 'denied') {
                Alert.alert(
                    'Location Permission',
                    'Would you like to enable location tracking for your images? This helps track where each image was taken.',
                    [
                        {
                            text: 'Not Now',
                            style: 'cancel',
                            onPress: () => {
                                setLocation(null);
                                return null;
                            }
                        },
                        {
                            text: 'Enable',
                            onPress: async () => {
                                const granted = await requestLocationPermission();
                                if (granted) {
                                    return await getCurrentLocation();
                                }
                                return null;
                            }
                        }
                    ]
                );
                return null;
            }

            // If permission is granted, get location
            if (locationPermissionStatus === 'granted') {
                return await getCurrentLocation();
            }

            // If permission is not determined yet, request it
            const granted = await requestLocationPermission();
            if (granted) {
                return await getCurrentLocation();
            }

            return null;
        } catch (error) {
            console.error('Error getting location:', error);
            return null;
        }
    };

    const getCurrentLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });
            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                altitude: location.coords.altitude,
                timestamp: location.timestamp
            };
        } catch (error) {
            console.error('Error getting current location:', error);
            return null;
        }
    };

    const handleImageSelection = async (result) => {
        if (!result.canceled) {
            const currentLocation = await getLocation();
            setLocation(currentLocation);
            setMediaUri(result.assets[0].uri);
            setMediaType('image');
            setError(null);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });
        await handleImageSelection(result);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        await handleImageSelection(result);
    };

    const pickVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
        });
        if (!result.canceled) {
            setMediaUri(result.assets[0].uri);
            setMediaType('video');
            setError(null);
        }
    };

    const processMedia = async () => {
        console.log('processMedia: Function called');
        if (isLoading || !mediaUri || !mediaType) {
            console.log('processMedia: Validation failed', { isLoading, mediaUriExists: !!mediaUri, mediaType });
            return;
        }

        console.log('processMedia: Starting processing', { mediaType });
        setIsLoading(true);
        const controller = new AbortController();
        setAbortController(controller);

        try {
            console.log('processMedia: Reading file as base64');
            const base64Media = await FileSystem.readAsStringAsync(mediaUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            console.log('processMedia: Base64 conversion complete', {
                base64Length: base64Media.length,
                previewBase64: base64Media.substring(0, 50) + '...'
            });

            let response;
            console.log('processMedia: Sending to server');
            if (mediaType === 'video') {
                response = await processVideoOnServer(base64Media, controller.signal);
            } else {
                response = await processImageOnServer(base64Media, controller.signal);
            }
            console.log('processMedia: Server response received', response);

            setProcessedMediaUri(response.media || response.image || response.video);
            console.log('processMedia: Updated processedMediaUri', response.media || response.image || response.video);

            if (response.detections && response.detections.length > 0) {
                console.log('processMedia: Processing detections', response.detections);
                const detectionText = response.detections.map((det, index) => {
                    return `Detection ${index + 1}: ${det.label} (Confidence: ${det.confidence.toFixed(2)})`;
                }).join('\n');

                setDetection(detectionText);
                const uniqueDiseases = [...new Set(response.detections.map(det => det.disease))].join(';');
                setRemedy(uniqueDiseases);
                setMediaUri(response.media || response.image || response.video);
                console.log('processMedia: Detection results', { detectionText, uniqueDiseases });
            } else {
                console.log('processMedia: No detections found');
                setDetection(response.message || 'Healthy crop - no diseases detected');
                setRemedy('');
            }
            setError(null);
        } catch (err) {
            console.log('processMedia: Error occurred', err);
            if (err.name === 'AbortError') {
                console.error("Processing was aborted by user.");
            } else {
                setError(err.message || 'An error occurred during processing.');
            }
        } finally {
            console.log('processMedia: Processing complete');
            setIsLoading(false);
            setAbortController(null);
        }
    };

    const interruptProcessing = () => {
        if (abortController) {
            abortController.abort();
            setIsLoading(false);
            setAbortController(null);
        }
    };

    const reset = () => {
        setMediaUri(null);
        setProcessedMediaUri(null);
        setError(null);
        setDetection(null);
        setMediaType(null);
        if (abortController) {
            abortController.abort();
            setAbortController(null);
        }
    };

    const handleSaveToFolder = () => {
        setShowFolderModal(true);
    };

    const handleSaveComplete = () => {
        console.log('Image saved successfully');
    };

    const onMessage = (event) => {
        if (event.nativeEvent.data === "openDiseasePage") {
            setShowDiseasePage(true);
            setIsHome(true);
        }
    };

    return showDiseasePage ? (
        <WebView
            onMessage={onMessage}
            style={styles.container}
            source={{uri: 'https://google.com'}}
        />
    ) : (
        <>
            <ImageInputForm 
                remedy={remedy} 
                reset={reset} 
                takePhoto={takePhoto} 
                isLoading={isLoading} 
                pickImage={pickImage} 
                processMedia={processMedia} 
                interruptProcessing={interruptProcessing} 
                detection={detection} 
                error={error} 
                mediaUri={mediaUri}
                saveToFolder={handleSaveToFolder}
            />
            <FolderManagementModal
                visible={showFolderModal}
                onClose={() => setShowFolderModal(false)}
                onSave={handleSaveComplete}
                imageUri={mediaUri}
                processedMediaUri={processedMediaUri}
                detection={detection}
                remedy={remedy}
                location={location}
            />
        </>
    );
}
