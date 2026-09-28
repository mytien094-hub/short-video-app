import React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { VideoPlayer } from "./src/components/VideoPlayer";

export default function App() {
  // Link video MP4 test
  const sampleVideoUrl =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Demo Expo Video Player</Text>
      <VideoPlayer videoUrl={sampleVideoUrl} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
