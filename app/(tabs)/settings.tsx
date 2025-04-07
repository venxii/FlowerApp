import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DataViewerProps {
    data: any;
    level?: number;
    maxWidth?: number;
}

const DataViewer: React.FC<DataViewerProps> = ({ data, level = 0, maxWidth = 300 }) => {
    const [isExpanded, setIsExpanded] = useState(level === 0);
    const isObject = typeof data === 'object' && data !== null && !Array.isArray(data);
    const isArray = Array.isArray(data);
    const hasChildren = isObject || isArray;

    const renderValue = (value: any): string => {
        if (value === null) return 'null';
        if (typeof value === 'boolean') return value.toString();
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'string') {
            // Truncate long strings
            if (value.length > 50) {
                return `"${value.substring(0, 47)}..."`;
            }
            return `"${value}"`;
        }
        if (Array.isArray(value)) return `[${value.length} items]`;
        if (typeof value === 'object') return '{...}';
        return value.toString();
    };

    const renderKey = (key: string): string => {
        const keyMap: { [key: string]: string } = {
            'originalUri': 'Image Path',
            'detection': 'Detection Result',
            'remedy': 'Recommended Remedy',
            'weather': 'Weather Conditions',
            'location': 'Location Data',
            'date': 'Capture Date',
            'name': 'Folder Name',
            'plantName': 'Plant Name',
            'seedCompany': 'Seed Company',
            'sowingDate': 'Sowing Date',
            'createdAt': 'Created At',
            'images': 'Images',
            'moisture': 'Moisture',
            'temperature': 'Temperature',
            'turbulence': 'Turbulence',
            'latitude': 'Latitude',
            'longitude': 'Longitude',
            'altitude': 'Altitude',
            'timestamp': 'Timestamp'
        };
        return keyMap[key] || key;
    };

    const renderObjectContent = () => {
        if (!hasChildren) return null;

        return (
            <View style={[styles.dataContent, { marginLeft: level * 16 }]}>
                {Object.entries(data).map(([key, value]) => (
                    <View key={key} style={styles.dataItem}>
                        <Text style={styles.dataKey}>{renderKey(key)}:</Text>
                        {typeof value === 'object' && value !== null ? (
                            <DataViewer data={value} level={level + 1} maxWidth={maxWidth - 32} />
                        ) : (
                            <Text style={styles.dataValue} numberOfLines={2}>
                                {renderValue(value)}
                            </Text>
                        )}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={[styles.dataContainer, { maxWidth }]}>
            {hasChildren ? (
                <>
                    <TouchableOpacity
                        style={styles.dataHeader}
                        onPress={() => setIsExpanded(!isExpanded)}
                    >
                        <Ionicons
                            name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                            size={16}
                            color="#666"
                        />
                        <Text style={styles.dataType}>
                            {isArray ? `Array (${data.length} items)` : 'Object'}
                        </Text>
                    </TouchableOpacity>
                    {isExpanded && renderObjectContent()}
                </>
            ) : (
                <Text style={styles.dataValue} numberOfLines={2}>
                    {renderValue(data)}
                </Text>
            )}
        </View>
    );
};

interface LocalData {
    [key: string]: any;
}

export default function SettingsPage() {
    const [localData, setLocalData] = useState<LocalData | null>(null);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    useEffect(() => {
        loadLocalData();
    }, []);

    const loadLocalData = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const data: LocalData = {};
            for (const key of keys) {
                const value = await AsyncStorage.getItem(key);
                if (value) {
                    try {
                        data[key] = JSON.parse(value);
                    } catch {
                        data[key] = value;
                    }
                }
            }
            setLocalData(data);
        } catch (error) {
            console.error('Error loading local data:', error);
        }
    };

    const clearData = async () => {
        try {
            await AsyncStorage.clear();
            setLocalData(null);
        } catch (error) {
            console.error('Error clearing data:', error);
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
                        onPress={() => router.push('/')}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Settings</Text>
                </View>

                <ScrollView style={styles.content} horizontal={false}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Local Storage Data</Text>
                        {localData ? (
                            <DataViewer data={localData} maxWidth={400} />
                        ) : (
                            <Text style={styles.emptyText}>No data available</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={clearData}
                    >
                        <Ionicons name="trash-outline" size={24} color="#ff3b30" />
                        <Text style={styles.clearButtonText}>Clear All Data</Text>
                    </TouchableOpacity>
                </ScrollView>
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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    dataContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    dataHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dataType: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    dataContent: {
        marginTop: 8,
    },
    dataItem: {
        marginBottom: 8,
    },
    dataKey: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    dataValue: {
        fontSize: 14,
        color: '#666',
        flexWrap: 'wrap',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 24,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    clearButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ff3b30',
        marginLeft: 8,
    },
}); 