import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
} from "react-native";

import { VideoPlayer } from "./src/components/VideoPlayer";
import videos from "./src/data/videos";

export default function App() {
  const [keyword, setKeyword] = useState("");

  const sampleVideoUrl =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // Lọc video theo tên video hoặc tác giả
  const filteredVideos = videos.filter((video) => {
    const searchText = keyword.toLowerCase().trim();

    if (searchText === "") {
      return true;
    }

    return (
      video.title.toLowerCase().includes(searchText) ||
      video.author.toLowerCase().includes(searchText)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* VIDEO DEMO CỦA MEMBER C */}
      <Text style={styles.title}>Demo Expo Video Player</Text>

      <VideoPlayer videoUrl={sampleVideoUrl} />

      {/* SEARCH CỦA MEMBER B */}
      <Text style={styles.sectionTitle}>Tìm kiếm video</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Tìm video hoặc tác giả..."
        placeholderTextColor="#888"
        value={keyword}
        onChangeText={setKeyword}
      />

      <Text style={styles.resultText}>
        Tìm thấy {filteredVideos.length} video
      </Text>

      {/* DANH SÁCH VIDEO */}
      <FlatList
        data={filteredVideos}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.thumbnail}
            />

            <View style={styles.info}>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {item.title}
              </Text>

              <Text style={styles.author}>
                {item.author}
              </Text>

              <Text style={styles.videoUrl} numberOfLines={1}>
                {item.videoUrl}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Không tìm thấy video phù hợp
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 10,
  },

  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f8f8f8",
  },

  resultText: {
    fontSize: 14,
    color: "#777",
    marginTop: 10,
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  thumbnail: {
    width: 120,
    height: 75,
    borderRadius: 8,
  },

  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },

  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },

  author: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },

  videoUrl: {
    fontSize: 10,
    color: "#999",
    marginTop: 5,
  },

  empty: {
    alignItems: "center",
    marginTop: 40,
  },

  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});