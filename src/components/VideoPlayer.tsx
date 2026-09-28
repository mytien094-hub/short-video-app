import React from "react";
import { StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

interface VideoPlayerProps {
  videoUrl: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={true} // Bật thanh điều khiển native (Play/Pause/Fullscreen)
      />
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
