import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system';
import { Folder, ImageData } from './types';

interface ImageGridProps {
    folder: Folder;
    onImageSelect: (image: ImageData | null) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ folder, onImageSelect }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <View style={styles.folderContent}>
            <View style={styles.folderHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => onImageSelect(null)}
                >
                    <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <View style={styles.folderHeaderInfo}>
                    <Text style={styles.folderTitle}>{folder.name}</Text>
                    <Text style={styles.folderSubtitle}>
                        {folder.plantName} • {folder.seedCompany}
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.imageGrid}>
                <View style={styles.imageGridContainer}>
                    {folder.images.map((image, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.imageCard}
                            onPress={() => onImageSelect(image)}
                        >
                            <BlurView intensity={40} tint="light" style={styles.glassCard}>
                                <View style={styles.thumbnailContainer}>
                                    <Image
                                        source={{ uri: image.originalUri }}
                                        style={styles.thumbnail}
                                        resizeMode="cover"
                                        onError={async (error) => {
                                            try {
                                                const fileInfo = await FileSystem.getInfoAsync(image.originalUri);
                                                if (!fileInfo.exists) {
                                                    const fileName = image.originalUri.split('/').pop();
                                                    const alternativePath = `${FileSystem.documentDirectory}folders/${folder.id}/${fileName}`;
                                                    const altFileInfo = await FileSystem.getInfoAsync(alternativePath);
                                                    if (altFileInfo.exists) {
                                                        image.originalUri = alternativePath;
                                                    }
                                                }
                                            } catch (err) {
                                                console.error('Error checking file:', err);
                                            }
                                        }}
                                    />
                                </View>
                                <View style={styles.imageInfo}>
                                    <Text style={styles.imageDate}>
                                        {formatDate(image.date)}
                                    </Text>
                                    <Text style={styles.detectionText} numberOfLines={2}>
                                        {image.detection}
                                    </Text>
                                </View>
                            </BlurView>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    folderContent: {
        flex: 1,
    },
    folderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        marginRight: 16,
    },
    folderHeaderInfo: {
        flex: 1,
    },
    folderTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    folderSubtitle: {
        fontSize: 16,
        color: '#666666',
    },
    imageGrid: {
        flex: 1,
    },
    imageGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        paddingBottom: 16,
    },
    imageCard: {
        width: '100%',
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    glassCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    thumbnailContainer: {
        width: '100%',
        height: 200,
        overflow: 'hidden',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    imageInfo: {
        padding: 16,
        gap: 8,
    },
    imageDate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    detectionText: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
    },
}); 