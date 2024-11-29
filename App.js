import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient'; 

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); 

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  const openImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  const playPauseSound = async () => {
    if (sound === null) {
      const { sound } = await Audio.Sound.createAsync(
     { uri: 'https://your-audio-host.com/libre-sampak.mp3' }

      );
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsPlaying(false); 
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); 
        }
      : undefined;
  }, [sound]);

  return (
    <LinearGradient
  colors={['#32CD32', '#228B22', '#006400']} // Updated to green shades
  style={styles.container}
>

      {/* App Name */}
      <Text style={styles.appTitle}>Arfff Arfff</Text>

      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Take a Capture</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={openImagePicker}>
        <Text style={styles.buttonText}>Select Photo from Gallery</Text>
      </TouchableOpacity>

      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}

      <TouchableOpacity style={styles.button} onPress={playPauseSound}>
        <Text style={styles.buttonText}>{isPlaying ? 'Pause Sound' : 'Play Sound'}</Text>
      </TouchableOpacity>

      {isPlaying && <Text style={styles.indicator}>Playing...</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 100,
    fontFamily: 'sans-serif-medium', 
    textShadowColor: '#000', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
 button: {
  backgroundColor: '#FFFFFF', // White background
  paddingVertical: 15,
  paddingHorizontal: 30,
  borderRadius: 30,
  borderWidth: 2,
  borderColor: '#00308F',
  marginVertical: 12,
  width: '85%',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 8,
},
buttonText: {
  color: '#00308F', // Dark blue text for contrast
  fontSize: 18,
  fontWeight: '600',
},

  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D3D3D3',
  },
  indicator: {
    marginTop: 20,
    fontSize: 18,
    color: '#EFDECD', 
  },
});