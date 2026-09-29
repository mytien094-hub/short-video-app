import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

interface VideoPlayerProps {
  videoUrl: string;
  isActive: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  isActive,
}) => {
  // =========================
  // WEB
  // =========================
  const webVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const video = webVideoRef.current;

    if (!video) return;

    if (isActive) {
      video.play().catch((error) => {
        console.log("Video play error:", error);
      });
    } else {
      video.pause();
    }
  }, [isActive]);

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <video
          ref={webVideoRef}
          src={videoUrl}
          controls
          playsInline
          muted
          loop
          preload="auto"
          autoPlay={isActive}
          style={styles.webVideo}
          onLoadedData={() => {
            console.log("Video loaded:", videoUrl);
          }}
          onError={(e) => {
            console.log("VIDEO ERROR:", e.currentTarget.error);
            console.log("VIDEO URL:", videoUrl);
          }}
        />
      </View>
    );
  }

  // =========================
  // ANDROID / IOS
  // =========================

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
  });

  useEffect(() => {
    if (!player) return;

    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [player, isActive]);

  return (
    <View style={styles.container}>
      <VideoView style={styles.video} player={player} nativeControls={true} />
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

  webVideo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    backgroundColor: "#000",
  },
});
