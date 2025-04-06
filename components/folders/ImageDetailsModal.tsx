import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ImageData } from './types';

interface ImageDetailsModalProps {
    visible: boolean;
    image: ImageData | null;
    onClose: () => void;
}

export const ImageDetailsModal: React.FC<ImageDetailsModalProps> = ({ visible, image, onClose }) => {
    if (!image) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <BlurView intensity={40} tint="light" style={styles.modalContainer}>
                <SafeAreaView style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={24} color="#1a1a1a" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Image Details</Text>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: image.originalUri }}
                                style={styles.detailImage}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.detailsContainer}>
                            <View style={styles.detailSection}>
                                <View style={styles.detailHeader}>
                                    <Ionicons name="leaf" size={24} color="#4caf50" />
                                    <Text style={styles.detailTitle}>Detection</Text>
                                </View>
                                <Text style={styles.detailText}>{image.detection}</Text>
                            </View>

                            <View style={styles.detailSection}>
                                <View style={styles.detailHeader}>
                                    <Ionicons name="medical" size={24} color="#4caf50" />
                                    <Text style={styles.detailTitle}>Remedy</Text>
                                </View>
                                <Text style={styles.detailText}>{image.remedy}</Text>
                            </View>

                            <View style={styles.detailSection}>
                                <View style={styles.detailHeader}>
                                    <Ionicons name="cloudy" size={24} color="#4caf50" />
                                    <Text style={styles.detailTitle}>Weather Conditions</Text>
                                </View>
                                <View style={styles.weatherGrid}>
                                    <View style={styles.weatherItem}>
                                        <Text style={styles.weatherLabel}>Moisture</Text>
                                        <Text style={styles.weatherValue}>{image.weather.moisture}%</Text>
                                    </View>
                                    <View style={styles.weatherItem}>
                                        <Text style={styles.weatherLabel}>Temperature</Text>
                                        <Text style={styles.weatherValue}>{image.weather.temperature}°C</Text>
                                    </View>
                                    <View style={styles.weatherItem}>
                                        <Text style={styles.weatherLabel}>Turbulence</Text>
                                        <Text style={styles.weatherValue}>{image.weather.turbulence}</Text>
                                    </View>
                                </View>
                            </View>

                            {image.location && (
                                <View style={styles.detailSection}>
                                    <View style={styles.detailHeader}>
                                        <Ionicons name="location" size={24} color="#4caf50" />
                                        <Text style={styles.detailTitle}>Location</Text>
                                    </View>
                                    <View style={styles.locationGrid}>
                                        <View style={styles.locationItem}>
                                            <Text style={styles.locationLabel}>Latitude</Text>
                                            <Text style={styles.locationValue}>{image.location.latitude.toFixed(6)}°</Text>
                                        </View>
                                        <View style={styles.locationItem}>
                                            <Text style={styles.locationLabel}>Longitude</Text>
                                            <Text style={styles.locationValue}>{image.location.longitude.toFixed(6)}°</Text>
                                        </View>
                                        <View style={styles.locationItem}>
                                            <Text style={styles.locationLabel}>Altitude</Text>
                                            <Text style={styles.locationValue}>
                                                {image.location.altitude ? `${image.location.altitude.toFixed(2)}m` : 'N/A'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            <View style={styles.detailSection}>
                                <View style={styles.detailHeader}>
                                    <Ionicons name="calendar" size={24} color="#4caf50" />
                                    <Text style={styles.detailTitle}>Date</Text>
                                </View>
                                <Text style={styles.detailText}>
                                    {formatDate(image.date)}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginTop: 40,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    closeButton: {
        marginRight: 16,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    modalBody: {
        flex: 1,
        paddingHorizontal: 24,
    },
    imageContainer: {
        marginVertical: 24,
    },
    detailImage: {
        width: '100%',
        height: 300,
        borderRadius: 20,
    },
    detailsContainer: {
        gap: 24,
        paddingBottom: 24,
    },
    detailSection: {
        gap: 12,
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    detailText: {
        fontSize: 16,
        color: '#666666',
        lineHeight: 24,
    },
    weatherGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    weatherItem: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 12,
    },
    weatherLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    weatherValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    locationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    locationItem: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 12,
    },
    locationLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    locationValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
}); 