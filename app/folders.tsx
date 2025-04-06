import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Folder, ImageData } from '@/components/folders/types';
import { FolderList } from '@/components/folders/FolderList';
import { ImageGrid } from '@/components/folders/ImageGrid';
import { ImageDetailsModal } from '@/components/folders/ImageDetailsModal';

export default function FoldersPage() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [showImageDetails, setShowImageDetails] = useState(false);

    useEffect(() => {
        console.log('FoldersPage: Component mounted');
        loadFolders();
    }, []);

    const loadFolders = async () => {
        try {
            console.log('FoldersPage: Loading folders from AsyncStorage');
            const foldersData = await AsyncStorage.getItem('imageFolders');
            if (foldersData) {
                const parsedFolders = JSON.parse(foldersData);
                console.log('FoldersPage: Loaded folders data:', JSON.stringify(parsedFolders, null, 2));
                setFolders(parsedFolders);
            } else {
                console.log('FoldersPage: No folders data found in AsyncStorage');
            }
        } catch (error) {
            console.error('FoldersPage: Error loading folders:', error);
        }
    };

    const handleFolderSelect = (folder: Folder) => {
        console.log('FoldersPage: Selected folder:', folder.name);
        setSelectedFolder(folder);
    };

    const handleImageSelect = (image: ImageData | null) => {
        if (image) {
            console.log('FoldersPage: Selected image:', image.originalUri);
            setSelectedImage(image);
            setShowImageDetails(true);
        } else {
            console.log('FoldersPage: Going back to folder list');
            setSelectedFolder(null);
        }
    };

    return (
        <LinearGradient
            colors={['#e8f5e9', '#f1f8e9', '#f9fbe7']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            console.log('FoldersPage: Navigating back to home');
                            router.push('/');
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Saved Images</Text>
                </View>

                <ScrollView style={styles.content}>
                    {selectedFolder ? (
                        <ImageGrid
                            folder={selectedFolder}
                            onImageSelect={handleImageSelect}
                        />
                    ) : (
                        <FolderList
                            folders={folders}
                            onFolderSelect={handleFolderSelect}
                        />
                    )}
                </ScrollView>

                <ImageDetailsModal
                    visible={showImageDetails}
                    image={selectedImage}
                    onClose={() => setShowImageDetails(false)}
                />
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 24,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a1a1a',
        letterSpacing: -0.5,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
}); 