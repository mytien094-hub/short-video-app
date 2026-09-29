import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ViewToken,
  Text,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Thêm hook lắng nghe focus
import { VideoPlayer } from "../components/VideoPlayer";
import videos from "../data/videos";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

export default function HomeScreen({ route }: any) {
  const flatListRef = useRef<FlatList>(null);
  const [activeVideoId, setActiveVideoId] = useState<number>(videos[0].id);

  // Tự động cuộn tới video được chọn mỗi khi HomeScreen được Focus
  useFocusEffect(
    useCallback(() => {
      const selectedVideoId = route?.params?.selectedVideoId;

      if (selectedVideoId) {
        const index = videos.findIndex((v) => v.id === selectedVideoId);
        if (index !== -1 && flatListRef.current) {
          flatListRef.current.scrollToIndex({ index, animated: true });
          setActiveVideoId(selectedVideoId);
        }
      }
    }, [route?.params?.selectedVideoId]),
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].isViewable) {
        setActiveVideoId(viewableItems[0].item.id);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const getItemLayout = (_: any, index: number) => ({
    length: WINDOW_HEIGHT,
    offset: WINDOW_HEIGHT * index,
    index,
  });

  const renderVideoItem = ({ item }: { item: (typeof videos)[0] }) => {
    const isPlaying = item.id === activeVideoId;

    return (
      <View style={styles.videoContainer}>
        <VideoPlayer videoUrl={item.videoUrl} isActive={isPlaying} />

        <View style={styles.overlay}>
          <Text style={styles.authorText}>@{item.author}</Text>
          <Text style={styles.titleText}>{item.title}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef} // FIXED: Đã gắn ref
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderVideoItem}
        getItemLayout={getItemLayout} // FIXED: Đã gắn getItemLayout
        pagingEnabled={true}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={WINDOW_HEIGHT}
        snapToAlignment="start"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoContainer: {
    height: WINDOW_HEIGHT,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#000",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  authorText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  titleText: {
    color: "#eee",
    fontSize: 14,
  },
});
