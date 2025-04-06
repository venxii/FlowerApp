import {ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Video} from "expo-av";
import React from "react";

import imageProcessorStyles from "@/styles/imageProcessorStyles";

export default function DetectionPage({
                                          mediaUri,
                                          processedMediaUri,
                                          pickImage,
                                          pickVideo,
                                          mediaType,
                                          processMedia,
                                          isLoading,
                                          detection,
                                          remedy,
                                          error,
                                          interruptProcessing,
                                          takePhoto,
                                          reset,
                                          isHome,
                                          setShowDiseasePage
                                      }) {
    return (<View style={imageProcessorStyles.container}>
        {!isHome && (mediaUri || processedMediaUri) && (
            <TouchableOpacity onPress={reset} style={imageProcessorStyles.backButton}>
                <Text style={imageProcessorStyles.backButtonText}>← Back</Text>
            </TouchableOpacity>)}

        {(isHome) && (<TouchableOpacity onPress={() => {
            setShowDiseasePage(false)
        }} style={imageProcessorStyles.backButton}>
            <Text style={imageProcessorStyles.backButtonText}>← Home</Text>
        </TouchableOpacity>)}

        <Text style={imageProcessorStyles.title}>Leaf Disease Detector</Text>

        {!mediaUri && !processedMediaUri && (<View style={imageProcessorStyles.optionsContainer}>
            <TouchableOpacity onPress={takePhoto} style={imageProcessorStyles.button}>
                <Text style={{...imageProcessorStyles.buttonText, fontSize: 30}}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={imageProcessorStyles.button}>
                <Text style={{...imageProcessorStyles.buttonText, fontSize: 30}}>Choose Image from
                    Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickVideo} style={imageProcessorStyles.button}>
                <Text style={{...imageProcessorStyles.buttonText, fontSize: 30}}>Choose Video from
                    Gallery</Text>
            </TouchableOpacity>
        </View>)}

        {mediaUri && !processedMediaUri && (<View style={imageProcessorStyles.previewContainer}>
            {mediaType === 'video' ? (<Video
                source={{uri: mediaUri}}
                style={imageProcessorStyles.image}
                useNativeControls
                resizeMode="cover"
            />) : (<Image source={{uri: mediaUri}} style={imageProcessorStyles.image} resizeMode="cover"/>)}
            <TouchableOpacity
                onPress={processMedia}
                style={{...imageProcessorStyles.processButton, marginTop: 20}}
                disabled={isLoading}
            >
                <Text style={imageProcessorStyles.buttonText}>
                    {mediaType === 'video' ? 'Process Video' : 'Process Image'}
                </Text>
            </TouchableOpacity>
        </View>)}

        {processedMediaUri && (<View style={imageProcessorStyles.previewContainer}>
            {mediaType === 'video' ? (<Video
                source={{uri: processedMediaUri}}
                style={imageProcessorStyles.image}
                useNativeControls
                resizeMode="cover"
            />) : (<Image source={{uri: processedMediaUri}} style={imageProcessorStyles.image}
                          resizeMode="cover"/>)}
            <TouchableOpacity onPress={reset} style={imageProcessorStyles.processButton}>
                <Text style={imageProcessorStyles.buttonText}>Process New Media.</Text>
            </TouchableOpacity>
            <ScrollView style={{marginTop: 20, maxHeight: 100}} nestedScrollEnabled={true}>
                {detection && <Text>{detection} {remedy} </Text>}
            </ScrollView>
            <ScrollView style={{marginTop: 20, maxHeight: 100}} nestedScrollEnabled={true}>
                {remedy && <Text>Suggested Medicine : {remedy}</Text>}
            </ScrollView>


        </View>)}

        {isLoading && (<View style={imageProcessorStyles.loadingOverlay}>
            <ActivityIndicator size="large" color="#edefe5"/>
            <Text style={imageProcessorStyles.loadingText}>Processing...</Text>
            <TouchableOpacity onPress={interruptProcessing} style={imageProcessorStyles.interruptButton}>
                <Text style={imageProcessorStyles.interruptButtonText}>Interrupt</Text>
            </TouchableOpacity>
        </View>)}

        {error && (<View style={imageProcessorStyles.errorContainer}>
            <Text style={imageProcessorStyles.errorText}>{error}</Text>
        </View>)}
    </View>)
}