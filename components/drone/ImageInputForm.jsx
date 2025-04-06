import {Animated, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {BlurView} from "expo-blur";
import {LinearGradient} from "expo-linear-gradient";
import React from "react";

const ImageInputForm = ({
                            mediaUri,
                            takePhoto,
                            isLoading,
                            pickImage,
                            processMedia,
                            interruptProcessing,
                            detection,
                            error,
                            reset,
                            remedy,
                            saveToFolder
                        }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <LinearGradient
            colors={['#e8f5e9', '#f1f8e9', '#f9fbe7']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <Animated.View style={[styles.header, {opacity: fadeAnim}]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.push('/')}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1a1a1a"/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Disease Detection</Text>
                </Animated.View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={[styles.content, {opacity: fadeAnim}]}>
                        {mediaUri ? (
                            <View style={styles.mediaContainer}>
                                <Image
                                    source={{uri: mediaUri}}
                                    style={styles.mediaPreview}
                                    resizeMode="cover"
                                />
                                <View style={styles.mediaOverlay}/>
                            </View>
                        ) : (
                            <View style={styles.uploadContainer}>
                                <BlurView intensity={40} tint="light" style={styles.uploadCard}>
                                    <View style={styles.uploadContent}>
                                        <Ionicons name="cloud-upload" size={48} color="#1a1a1a"/>
                                        <Text style={styles.uploadText}>Upload an image or take a photo</Text>
                                    </View>
                                </BlurView>
                            </View>
                        )}

                        {!detection && (<View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={takePhoto}
                                disabled={isLoading}
                            >
                                <BlurView intensity={40} tint="light" style={styles.glassCard}>
                                    <View style={styles.buttonContent}>
                                        <Ionicons name="camera" size={24} color="#1a1a1a"/>
                                        <Text style={styles.buttonText}>Take Photo</Text>
                                    </View>
                                </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={pickImage}
                                disabled={isLoading}
                            >
                                <BlurView intensity={40} tint="light" style={styles.glassCard}>
                                    <View style={styles.buttonContent}>
                                        <Ionicons name="images" size={24} color="#1a1a1a"/>
                                        <Text style={styles.buttonText}>Choose Image</Text>
                                    </View>
                                </BlurView>
                            </TouchableOpacity>

                            {mediaUri && (
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={processMedia}
                                    disabled={isLoading}
                                >
                                    <BlurView intensity={40} tint="light" style={styles.glassCard}>
                                        <View style={styles.buttonContent}>
                                            <Ionicons name="scan" size={24} color="#1a1a1a"/>
                                            <Text style={styles.buttonText}>
                                                {isLoading ? 'Processing...' : 'Analyze Image'}
                                            </Text>
                                        </View>
                                    </BlurView>
                                </TouchableOpacity>
                            )}

                            {isLoading && (
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={interruptProcessing}
                                >
                                    <BlurView intensity={40} tint="light" style={styles.glassCard}>
                                        <View style={styles.buttonContent}>
                                            <Ionicons name="stop-circle" size={24} color="#1a1a1a"/>
                                            <Text style={styles.buttonText}>Stop Processing</Text>
                                        </View>
                                    </BlurView>
                                </TouchableOpacity>
                            )}


                        </View>)}

                        {detection && (
                            <BlurView intensity={40} tint="light" style={styles.resultCard}>
                                <View style={styles.resultContent}>
                                    <Text style={styles.resultTitle}>Analysis Result</Text>
                                    <Text style={styles.resultText}>{detection}</Text>
                                    <Text style={{...styles.resultTitle, marginTop: 20}}>Medicine Recommendation</Text>
                                    <Text style={styles.resultText}>{remedy}</Text>
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity
                                            style={[styles.actionButton, styles.flexButton]}
                                            onPress={reset}
                                        >
                                            <BlurView intensity={40} tint="light" style={styles.glassCard}>
                                                <View style={styles.buttonContent}>
                                                    <Ionicons name="refresh" size={24} color="#1a1a1a"/>
                                                    <Text style={styles.buttonText}>Reset</Text>
                                                </View>
                                            </BlurView>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.actionButton, styles.flexButton]}
                                            onPress={saveToFolder}
                                        >
                                            <BlurView intensity={40} tint="light" style={styles.glassCard}>
                                                <View style={styles.buttonContent}>
                                                    <Ionicons name="save" size={24} color="#1a1a1a"/>
                                                    <Text style={styles.buttonText}>Save</Text>
                                                </View>
                                            </BlurView>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </BlurView>
                        )}

                        {error && (
                            <BlurView intensity={40} tint="light" style={[styles.resultCard, styles.errorCard]}>
                                <View style={styles.resultContent}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            </BlurView>
                        )}
                    </Animated.View>
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
    scrollContent: {
        paddingBottom: 30,
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
        paddingHorizontal: 24,
    },
    mediaContainer: {
        width: '100%',
        height: 300,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    mediaPreview: {
        width: '100%',
        height: '100%',
    },
    mediaOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    uploadContainer: {
        width: '100%',
        height: 300,
        marginBottom: 24,
    },
    uploadCard: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    uploadContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadText: {
        fontSize: 18,
        color: '#1a1a1a',
        marginTop: 16,
    },
    buttonContainer: {
        gap: 16,
    },
    actionButton: {
        marginBottom: 16,
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
        padding: 20,
        gap: 12,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    resultCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: 24,
    },
    errorCard: {
        borderColor: 'rgba(255, 0, 0, 0.3)',
    },
    resultContent: {
        padding: 20,
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    resultText: {
        fontSize: 16,
        color: '#666666',
        lineHeight: 24,
    },
    errorText: {
        fontSize: 16,
        color: '#ff3b30',
        lineHeight: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 20,
    },
    flexButton: {
        flex: 1,
        marginBottom: 0,
    },
});

export default ImageInputForm;