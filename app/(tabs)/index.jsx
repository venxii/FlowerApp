import React from "react";
import {SafeAreaView, View, Text, TouchableOpacity, Animated, StyleSheet, Image, Dimensions} from "react-native";
import {useNavigation} from "@react-navigation/native";
import "@/global.css";
import {Link} from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Carousel from 'react-native-reanimated-carousel';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const navigation = useNavigation();
    const router = useRouter();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const images = [
        require('@/assets/images/drone/img1.jpg'),
        require('@/assets/images/drone/img2.jpeg'),
        require('@/assets/images/drone/img3.jpeg'),
    ];

    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image 
                source={item}
                style={styles.headerImage}
                resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
        </View>
    );

    return (
        <LinearGradient
            colors={['#ffffff', '#ffffff', '#ffffff']}
            style={styles.container}
        >
            <SafeAreaView   style={{...styles.safeArea, flex: 1}}>
                <Animated.View 
                    style={[styles.header, { opacity: fadeAnim }]}
                >
                    <Image 
                        source={require('@/assets/images/btech.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Carousel
                        loop
                        width={width - 48}
                        height={180}
                        autoPlay={true}
                        data={images}
                        scrollAnimationDuration={1000}
                        renderItem={renderItem}
                        mode="fade"
                        modeConfig={{
                            fadeDuration: 1000,
                        }}
                    />
                </Animated.View>

                <Animated.View 
                    style={[styles.content, { opacity: fadeAnim }]}
                >
                    <View style={styles.iconContainer}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.push('/spray')}
                        >
                            <View style={styles.iconCircle}>
                                <Ionicons name="water" size={32} color="#ffffff"/>
                            </View>
                            <Text style={styles.iconText}>Spray/Trim</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.push('/map')}
                        >
                            <View style={styles.iconCircle}>
                                <Ionicons name="location" size={32} color="#ffffff"/>
                            </View>
                            <Text style={styles.iconText}>Map</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.push('/folders')}
                        >
                            <View style={styles.iconCircle}>
                                <Ionicons name="time" size={32} color="#ffffff"/>
                            </View>
                            <Text style={styles.iconText}>History</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.iconContainer}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.push('/track')}
                        >
                            <View style={styles.iconCircle}>
                                <Ionicons name="navigate" size={32} color="#ffffff"/>
                            </View>
                            <Text style={styles.iconText}>Track</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.push('/LiveStreamPlayer')}
                        >
                            <View style={styles.iconCircle}>
                                <Ionicons name="videocam" size={32} color="#ffffff"/>
                            </View>
                            <Text style={styles.iconText}>View</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.gridContainer}>
                        <View style={styles.gridBox}>
                            <Text style={styles.gridTitle}>Our Mission</Text>
                            <Text style={styles.gridText}>Revolutionizing roadside plant maintenance with AI technology</Text>
                        </View>

                        <View style={styles.gridRow}>
                            <View style={[styles.gridBox, styles.halfBox]}>
                                <Text style={styles.gridTitle}>About Us</Text>
                                <Text style={styles.gridText}>Caring for bougainvillea with precision</Text>
                            </View>
                            <View style={[styles.gridBox, styles.halfBox]}>
                                <Text style={styles.gridTitle}>Services</Text>
                                <Text style={styles.gridText}>Comprehensive plant monitoring</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                <View style={styles.tabBarContainer}>
                    <View style={styles.tabBar}>
                        <TouchableOpacity 
                            style={styles.tabButton}
                            onPress={() => router.push('/')}
                        >
                            <Ionicons name="home" size={24} color="#000000"/>
                            <Text style={styles.tabText}>Home</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.tabCameraButton}
                            onPress={() => router.push('/detect')}
                        >
                            <View style={styles.cameraCircle}>
                                <Ionicons name="camera" size={32} color="#ffffff"/>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.tabButton}
                            onPress={() => router.push('/settings')}
                        >
                            <Ionicons name="settings" size={24} color="#000000"/>
                            <Text style={styles.tabText}>Settings</Text>
                        </TouchableOpacity>
                    </View>
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
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 5,
        alignItems: 'center',
    },
    logo: {
        width: width,
        height: 130,
        marginBottom: 16,
    },
    imageContainer: {
        width: '100%',
        height: 180,
        borderRadius: 24,
        overflow: 'hidden',
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
    headerImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 0,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 24,
        width: '100%',
        gap: 55,
    },
    iconButton: {
        alignItems: 'center',
        gap: 6,
    },
    iconCircle: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: '#f5708e',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: '500',
    },
    gridContainer: {
        padding: 12,
        gap: 12,
    },
    gridRow: {
        flexDirection: 'row',
        gap: 20,
    },
    gridBox: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    halfBox: {
        flex: 1,
    },
    gridTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 6,
    },
    gridText: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
    },
    tabBarContainer: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fae9ee',
        borderRadius: 32.5,
        height: 65,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    tabButton: {
        alignItems: 'center',
        gap: 2,
        flex: 1,
        height: '100%',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 12,
        color: '#000000',
        fontWeight: '500',
    },
    tabCameraButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    cameraCircle: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: '#f5708e',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
