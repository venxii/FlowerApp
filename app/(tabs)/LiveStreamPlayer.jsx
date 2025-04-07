import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function LiveStreamPlayer() {
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = React.useRef(null);

  useEffect(() => {
    // Load the video when component mounts
    loadVideo();
  }, []);

  const loadVideo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting to load HLS stream...');
      
      if (videoRef.current) {
        await videoRef.current.loadAsync(
          { uri: 'http://172.19.96.164/hls/test.m3u8' },
          { shouldPlay: true }
        );
        console.log('Video loaded successfully');
      } else {
        console.error('Video reference is null');
        setError('Video player not initialized');
      }
    } catch (error) {
      console.error('Error loading video:', error);
      setError(error.message || 'Could not connect to the live stream');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaybackStatusUpdate = (status) => {
    console.log('Playback status update:', status);
    setStatus(status);
    
    if (status.error) {
      console.error('Playback error:', status.error);
      setError(status.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Live Stream</Text>
      </View>
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Connecting to stream...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadVideo}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Video
        ref={videoRef}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (status.isPlaying) {
              videoRef.current.pauseAsync();
            } else {
              videoRef.current.playAsync();
            }
          }}
        >
          <Ionicons 
            name={status.isPlaying ? "pause" : "play"} 
            size={24} 
            color="#ffffff" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/StreamTest')}
        >
          <Ionicons 
            name="globe" 
            size={24} 
            color="#ffffff" 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          Status: {status.isPlaying ? 'Playing' : status.isBuffering ? 'Buffering' : 'Stopped'}
        </Text>
        <Text style={styles.debugText}>
          Position: {status.positionMillis ? Math.floor(status.positionMillis / 1000) + 's' : 'N/A'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  video: {
    flex: 1,
    width: '100%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    padding: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  debugContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  debugText: {
    color: '#ffffff',
    fontSize: 12,
  },
});
