import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Folder } from './types';

interface FolderListProps {
    folders: Folder[];
    onFolderSelect: (folder: Folder) => void;
}

export const FolderList: React.FC<FolderListProps> = ({ folders, onFolderSelect }) => {
    return (
        <View style={styles.folderList}>
            {folders.map((folder) => (
                <TouchableOpacity
                    key={folder.id}
                    style={styles.folderCard}
                    onPress={() => onFolderSelect(folder)}
                >
                    <BlurView intensity={40} tint="light" style={styles.glassCard}>
                        <View style={styles.folderContent}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="folder" size={32} color="#4caf50" />
                            </View>
                            <View style={styles.folderInfo}>
                                <Text style={styles.folderName}>{folder.name}</Text>
                                <Text style={styles.folderDetails}>
                                    {folder.plantName} • {folder.seedCompany}
                                </Text>
                                <Text style={styles.imageCount}>
                                    {folder.images.length} {folder.images.length === 1 ? 'image' : 'images'}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#666666" />
                        </View>
                    </BlurView>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    folderList: {
        gap: 16,
    },
    folderCard: {
        marginBottom: 16,
    },
    glassCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    folderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    folderInfo: {
        flex: 1,
        marginLeft: 16,
    },
    folderName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    folderDetails: {
        fontSize: 15,
        color: '#666666',
        marginBottom: 4,
    },
    imageCount: {
        fontSize: 14,
        color: '#4caf50',
        fontWeight: '500',
    },
}); 