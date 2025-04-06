import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
    return (
        <LinearGradient
            colors={['#e8f5e9', '#f1f8e9', '#f9fbe7']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Page Not Found</Text>
                </View>

                <View style={styles.content}>
                    <BlurView intensity={40} tint="light" style={styles.card}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="alert-circle" size={64} color="#ff3b30" />
                        </View>
                        <Text style={styles.message}>
                            The page you're looking for doesn't exist or has been moved.
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => router.push('/')}
                        >
                            <BlurView intensity={40} tint="light" style={styles.glassCard}>
                                <View style={styles.buttonContent}>
                                    <Ionicons name="home" size={24} color="#1a1a1a" />
                                    <Text style={styles.buttonText}>Go to Home</Text>
                                </View>
                            </BlurView>
                        </TouchableOpacity>
                    </BlurView>
                </View>
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
        padding: 24,
        justifyContent: 'center',
    },
    card: {
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    iconContainer: {
        marginBottom: 24,
    },
    message: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    button: {
        width: '100%',
    },
    glassCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 12,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
}); 