import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

interface VideoPlayerProps {
  videoUrl: string;
  isActive: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  isActive,
}) => {
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
    p.muted = false; // Mở âm thanh mặc định
    p.volume = 1;
  });

  useEffect(() => {
    if (!player) return;

    if (isActive) {
      player.muted = false; // Đảm bảo bỏ Mute mỗi khi active
      player.volume = 1.0;
      player.play();
    } else {
      player.pause();
    }
  }, [player, isActive]);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={true}
        contentFit="contain"
        allowsPictureInPicture={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
