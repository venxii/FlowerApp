import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';

const FolderManagementModal = ({ visible, onClose, onSave, imageUri, detection, remedy, processedMediaUri, location }) => {
    const [folders, setFolders] = useState([]);
    const [showNewFolderForm, setShowNewFolderForm] = useState(false);
    const [showFolderInfo, setShowFolderInfo] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [newFolderData, setNewFolderData] = useState({
        name: '',
        plantName: '',
        seedCompany: '',
        sowingDate: new Date(),
        location: null,
        weatherConditions: {
            moisture: '',
            temperature: '',
            turbulence: ''
        }
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadFolders();
    }, []);

    const loadFolders = async () => {
        try {
            const savedFolders = await AsyncStorage.getItem('imageFolders');
            if (savedFolders) {
                setFolders(JSON.parse(savedFolders));
            }
        } catch (error) {
            console.error('Error loading folders:', error);
        }
    };

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Location Permission', 'Please enable location access to set folder location.');
                return null;
            }

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
            console.error('Error getting location:', error);
            return null;
        }
    };

    const handleLocationSelect = async () => {
        const currentLocation = await getCurrentLocation();
        if (currentLocation) {
            setNewFolderData({
                ...newFolderData,
                location: currentLocation
            });
            Alert.alert('Success', 'Location set successfully!');
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setNewFolderData({
                ...newFolderData,
                sowingDate: selectedDate
            });
        }
    };

    const createNewFolder = async () => {
        if (!newFolderData.name || !newFolderData.plantName || !newFolderData.seedCompany) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const newFolder = {
            id: Date.now().toString(),
            name: newFolderData.name,
            plantName: newFolderData.plantName,
            seedCompany: newFolderData.seedCompany,
            sowingDate: newFolderData.sowingDate.toISOString(),
            location: newFolderData.location,
            weatherConditions: {
                moisture: newFolderData.weatherConditions.moisture || '',
                temperature: newFolderData.weatherConditions.temperature || '',
                turbulence: newFolderData.weatherConditions.turbulence || ''
            },
            createdAt: new Date().toISOString(),
            images: []
        };

        const updatedFolders = [...folders, newFolder];
        setFolders(updatedFolders);
        await AsyncStorage.setItem('imageFolders', JSON.stringify(updatedFolders));
        setShowNewFolderForm(false);
        setNewFolderData({
            name: '',
            plantName: '',
            seedCompany: '',
            sowingDate: new Date(),
            location: null,
            weatherConditions: {
                moisture: '',
                temperature: '',
                turbulence: ''
            }
        });
    };

    const updateFolderInfo = async (folderId) => {
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return;

        const updatedFolder = {
            ...folder,
            name: newFolderData.name,
            plantName: newFolderData.plantName,
            seedCompany: newFolderData.seedCompany,
            sowingDate: newFolderData.sowingDate.toISOString(),
            location: newFolderData.location,
            weatherConditions: {
                moisture: newFolderData.weatherConditions.moisture || '',
                temperature: newFolderData.weatherConditions.temperature || '',
                turbulence: newFolderData.weatherConditions.turbulence || ''
            }
        };

        const updatedFolders = folders.map(f => {
            if (f.id === folderId) {
                return updatedFolder;
            }
            return f;
        });

        setFolders(updatedFolders);
        await AsyncStorage.setItem('imageFolders', JSON.stringify(updatedFolders));
        setShowFolderInfo(false);
        setSelectedFolder(null);
    };

    const getFolderData = async (folderId) => {
        try {
            const folder = folders.find(f => f.id === folderId);
            if (!folder) {
                throw new Error('Folder not found');
            }
            return folder;
        } catch (error) {
            console.error('Error getting folder data:', error);
            throw error;
        }
    };

    const saveFolderData = async (folderId, folderData) => {
        try {
            const updatedFolders = folders.map(f => {
                if (f.id === folderId) {
                    return folderData;
                }
                return f;
            });
            setFolders(updatedFolders);
            await AsyncStorage.setItem('imageFolders', JSON.stringify(updatedFolders));
        } catch (error) {
            console.error('Error saving folder data:', error);
            throw error;
        }
    };

    const handleSave = async () => {
        if (!selectedFolder) {
            Alert.alert('Error', 'Please select a folder first');
            return;
        }

        try {
            setIsSaving(true);
            const folder = await getFolderData(selectedFolder);
            if (!folder) {
                throw new Error('Folder not found');
            }

            // Create a unique folder name using the folder ID
            const folderPath = `${FileSystem.documentDirectory}folders/${folder.id}`;
            
            // Create folder if it doesn't exist
            const folderInfo = await FileSystem.getInfoAsync(folderPath);
            if (!folderInfo.exists) {
                await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
            }

            // Generate unique filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `image_${timestamp}.jpg`;
            const filePath = `${folderPath}/${filename}`;

            // Handle base64 image data
            let imageData = imageUri;
            if (imageUri.startsWith('data:image')) {
                // Extract base64 data
                const base64Data = imageUri.split(',')[1];
                // Write base64 data to a temporary file
                const tempFilePath = `${FileSystem.cacheDirectory}temp_${timestamp}.jpg`;
                await FileSystem.writeAsStringAsync(tempFilePath, base64Data, {
                    encoding: FileSystem.EncodingType.Base64
                });
                imageData = tempFilePath;
            }

            // Copy image to folder
            await FileSystem.copyAsync({
                from: imageData,
                to: filePath
            });

            // Save image information
            const imageInfo = {
                originalUri: filePath,
                detection,
                remedy,
                weather: folder.weatherConditions || {
                    moisture: '',
                    temperature: '',
                    turbulence: ''
                },
                date: new Date().toISOString(),
                location: location || null
            };

            // Update folder data
            folder.images.push(imageInfo);
            await saveFolderData(folder.id, folder);

            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving image:', error);
            Alert.alert('Error', 'Failed to save image. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const renderFolderList = () => (
        <ScrollView style={styles.folderList}>
            {folders.map(folder => (
                <TouchableOpacity
                    key={folder.id}
                    style={[
                        styles.folderItem,
                        selectedFolder === folder.id && styles.selectedFolder
                    ]}
                    onPress={() => setSelectedFolder(folder.id)}
                >
                    <Ionicons name="folder" size={24} color="#1a1a1a" />
                    <View style={styles.folderInfo}>
                        <Text style={styles.folderName}>{folder.name}</Text>
                        <Text style={styles.folderDetails}>
                            {folder.plantName} • {folder.seedCompany}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderFolderForm = () => (
        <ScrollView style={styles.formContainer}>
            <Text style={styles.formTitle}>New Folder Details</Text>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Folder Name</Text>
                <TextInput
                    style={styles.input}
                    value={newFolderData.name}
                    onChangeText={(text) => setNewFolderData({...newFolderData, name: text})}
                    placeholder="Enter folder name"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Plant Name</Text>
                <TextInput
                    style={styles.input}
                    value={newFolderData.plantName}
                    onChangeText={(text) => setNewFolderData({...newFolderData, plantName: text})}
                    placeholder="Enter plant name"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Seed Company</Text>
                <TextInput
                    style={styles.input}
                    value={newFolderData.seedCompany}
                    onChangeText={(text) => setNewFolderData({...newFolderData, seedCompany: text})}
                    placeholder="Enter seed company"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Sowing Date</Text>
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={styles.dateButtonText}>
                        {newFolderData.sowingDate.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={handleLocationSelect}
                >
                    <Ionicons name="location" size={24} color="#1a1a1a" />
                    <Text style={styles.locationButtonText}>
                        {newFolderData.location ? 'Location Set' : 'Set Location'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.label, styles.sectionTitle]}>Weather Conditions</Text>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Moisture (%)</Text>
                <TextInput
                    style={styles.input}
                    value={newFolderData.weatherConditions.moisture}
                    onChangeText={(text) => setNewFolderData({
                        ...newFolderData,
                        weatherConditions: {...newFolderData.weatherConditions, moisture: text}
                    })}
                    placeholder="Enter moisture percentage"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Temperature (°C)</Text>
                <TextInput
                    style={styles.input}
                    value={newFolderData.weatherConditions.temperature}
                    onChangeText={(text) => setNewFolderData({
                        ...newFolderData,
                        weatherConditions: {...newFolderData.weatherConditions, temperature: text}
                    })}
                    placeholder="Enter temperature"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Turbulence</Text>
                <TextInput
                    style={styles.input}
                    value={newFolderData.weatherConditions.turbulence}
                    onChangeText={(text) => setNewFolderData({
                        ...newFolderData,
                        weatherConditions: {...newFolderData.weatherConditions, turbulence: text}
                    })}
                    placeholder="Enter turbulence level"
                />
            </View>

            <View style={styles.formButtons}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setShowNewFolderForm(false)}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.createButton]}
                    onPress={createNewFolder}
                >
                    <Text style={styles.buttonText}>Create Folder</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <BlurView intensity={20} tint="dark" style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {showFolderInfo ? 'Edit Folder' : showNewFolderForm ? 'New Folder' : 'Save Image'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#1a1a1a" />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={newFolderData.sowingDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                        />
                    )}

                    {showFolderInfo ? renderFolderForm() : !showNewFolderForm ? renderFolderList() : renderFolderForm()}

                    {!showNewFolderForm && !showFolderInfo && (
                        <>
                            <TouchableOpacity
                                style={styles.createFolderButton}
                                onPress={() => setShowNewFolderForm(true)}
                            >
                                <Ionicons name="add-circle" size={24} color="#1a1a1a" />
                                <Text style={styles.createFolderText}>Create New Folder</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.saveButton,
                                    (!selectedFolder || isSaving) && styles.saveButtonDisabled
                                ]}
                                onPress={handleSave}
                                disabled={!selectedFolder || isSaving}
                            >
                                <Text style={styles.saveButtonText}>
                                    {isSaving ? 'Saving...' : 'Save Image'}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    folderList: {
        maxHeight: 400,
    },
    folderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 10,
    },
    folderInfo: {
        marginLeft: 15,
        flex: 1,
    },
    folderName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    folderDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    createFolderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#e8f5e9',
        borderRadius: 10,
        marginTop: 20,
    },
    createFolderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginLeft: 10,
    },
    formContainer: {
        padding: 10,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#1a1a1a',
    },
    locationButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    locationButtonText: {
        fontSize: 16,
        color: '#1a1a1a',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginTop: 20,
        marginBottom: 15,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
    },
    createButton: {
        backgroundColor: '#4caf50',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    selectedFolder: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
    },
    saveButton: {
        backgroundColor: '#4caf50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonDisabled: {
        backgroundColor: '#cccccc',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});

export default FolderManagementModal; 