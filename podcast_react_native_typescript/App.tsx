import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useState, useEffect } from 'react';

var mp3file = "https://d3ctxlq1ktw2nl.cloudfront.net/staging/2025-0-5/a7fbb627-e878-2eaf-efaa-caca68254d16.mp3"

export default function App() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadSound() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: mp3file },
          { shouldPlay: false }
        );
        setSound(sound);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
          }
        });
      } catch (error) {
        console.error("Error loading sound:", error);
        setErrorMessage("Error loading audio. Please check your network connection.");
      }
    }
    loadSound();
    
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync();
          } else {
            await sound.playAsync();
          }
        }
      } catch (error) {
        console.error("Error playing sound:", error);
        setErrorMessage("Error playing audio. Please try again later.");
      }
    }
  };


  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
      <Button title={isPlaying ? "Pause" : "Play"} onPress={playSound} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
