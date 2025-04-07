import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function StreamTest() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/flv.js@1.6.2/dist/flv.min.js"></script>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          background-color: #000; 
          overflow: hidden;
        }
        .video-container { 
          width: 100vw; 
          height: 100vh; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
        }
        video { 
          width: 100%; 
          height: 100%; 
          object-fit: contain;
        }
        .status { 
          position: fixed; 
          top: 10px; 
          left: 10px; 
          color: white; 
          background: rgba(0,0,0,0.5); 
          padding: 5px;
          z-index: 1000;
        }
      </style>
    </head>
    <body>
      <div class="video-container">
        <video id="video" controls autoplay playsinline></video>
      </div>
      <div class="status" id="status">Connecting...</div>
      <script>
        (function() {
          const video = document.getElementById('video');
          const status = document.getElementById('status');
          const rtmpUrl = 'rtmp://172.19.96.164/live';
          const hlsUrl = 'http://172.19.96.164/hls/test.m3u8';
          
          function updateStatus(message) {
            status.textContent = message;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'status', message }));
          }
          
          function handleError(error) {
            console.error('Stream error:', error);
            updateStatus('Error: ' + error);
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: error }));
          }
          
          // Try RTMP first
          if (flvjs.isSupported()) {
            try {
              const flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: rtmpUrl,
                isLive: true,
                cors: true
              });
              
              flvPlayer.attachMediaElement(video);
              flvPlayer.load();
              flvPlayer.play();
              
              flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
                handleError('FLV Error: ' + errType);
                tryHLS();
              });
              
              flvPlayer.on(flvjs.Events.STATISTICS_INFO, function(statistics) {
                updateStatus('RTMP: ' + Math.round(statistics.speed) + ' KB/s');
              });
            } catch (e) {
              handleError('FLV Player Error: ' + e.message);
              tryHLS();
            }
          } else {
            updateStatus('FLV not supported, trying HLS...');
            tryHLS();
          }
          
          function tryHLS() {
            if (Hls.isSupported()) {
              try {
                const hls = new Hls({
                  enableWorker: true,
                  lowLatencyMode: true
                });
                
                hls.loadSource(hlsUrl);
                hls.attachMedia(video);
                
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                  video.play().catch(e => handleError('Play Error: ' + e.message));
                  updateStatus('Playing HLS stream');
                });
                
                hls.on(Hls.Events.ERROR, function(event, data) {
                  if (data.fatal) {
                    handleError('HLS Error: ' + data.details);
                  }
                });
              } catch (e) {
                handleError('HLS Player Error: ' + e.message);
              }
            } else {
              handleError('HLS not supported');
            }
          }
        })();
      </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'status') {
        console.log('Status:', data.message);
      } else if (data.type === 'error') {
        console.error('Error:', data.message);
        setError(data.message);
      }
    } catch (e) {
      console.error('Error parsing WebView message:', e);
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
        <Text style={styles.title}>Stream Test</Text>
      </View>
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading player...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsLoading(true);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadEnd={() => setIsLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          setError('WebView Error: ' + nativeEvent.description);
        }}
        onMessage={handleWebViewMessage}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
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
  webview: {
    flex: 1,
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
}); 