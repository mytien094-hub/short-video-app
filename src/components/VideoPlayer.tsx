import React from "react";
import { StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { Platform } from "react-native";

interface VideoPlayerProps {
  videoUrl: string;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  autoPlay = false,
}) => {
  // Web: dùng HTML video
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <video
          src={videoUrl}
          controls
          playsInline
          muted
          autoPlay={autoPlay}
          loop
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            backgroundColor: "#000",
          }}
        />
      </View>
    );
  }

  // Android / iOS: dùng expo-video
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;

    if (autoPlay) {
      player.play();
    }
  });

  return (
    <View style={styles.container}>
      <VideoView style={styles.video} player={player} nativeControls />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 250,
    backgroundColor: "#000",
  },

  video: {
    width: "100%",
    height: "100%",
  },
});
