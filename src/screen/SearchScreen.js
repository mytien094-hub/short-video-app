import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import dữ liệu video (Logic của Thành viên B)
import videos from "../data/videos";

export default function SearchScreen({ navigation }) {
    const [keyword, setKeyword] = useState("");

    // Chuyển sang màn hình Home (Logic của Thành viên C) - GIỮ NGUYÊN
    const handleSelectVideo = (videoId) => {
        navigation.navigate("Home", { selectedVideoId: videoId });
    };

    // Lọc video theo từ khóa (Logic của Thành viên B) - GIỮ NGUYÊN
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

    // Giao diện Thẻ Video (UI của Thành viên A)
    const renderVideo = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => handleSelectVideo(item.id)}
            >
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />

                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>
                        {item.title}
                    </Text>

                    <Text style={styles.author}>@{item.author}</Text>

                    <View style={styles.playBadge}>
                        <Ionicons name="play-circle" size={14} color="#007AFF" />
                        <Text style={styles.playText}>Bấm để xem video</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

            <Text style={styles.header}>Tìm kiếm video</Text>

            {/* THANH TÌM KIẾM ĐÃ NÂNG CẤP UI (MEMBER A) */}
            <View style={styles.searchBoxContainer}>
                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm video hoặc tác giả..."
                    placeholderTextColor="#999"
                    value={keyword}
                    onChangeText={setKeyword}
                />
                {/* Nút xóa nhanh (dấu X) xuất hiện khi gõ chữ */}
                {keyword.length > 0 && (
                    <TouchableOpacity onPress={() => setKeyword("")} style={styles.clearBtn}>
                        <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.resultText}>
                Tìm thấy <Text style={styles.highlightCount}>{filteredVideos.length}</Text> video phù hợp
            </Text>

            <FlatList
                data={filteredVideos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderVideo}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="search-disagree" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>Không tìm thấy video phù hợp</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 16,
        paddingTop: Platform.OS === "android" ? 40 : 50,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111",
        marginBottom: 16,
    },

    /* STYLE THANH TÌM KIẾM MỚI */
    searchBoxContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        height: 48,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#222",
        height: "100%",
    },
    clearBtn: {
        padding: 4,
    },

    resultText: {
        fontSize: 13,
        color: "#666",
        marginTop: 12,
        marginBottom: 12,
    },
    highlightCount: {
        fontWeight: "bold",
        color: "#007AFF",
    },

    /* STYLE THẺ VIDEO MỚI */
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 12,
        padding: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    thumbnail: {
        width: 120,
        height: 75,
        borderRadius: 8,
        backgroundColor: "#eee",
    },
    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-between",
    },
    title: {
        fontSize: 15,
        fontWeight: "600",
        color: "#222",
        lineHeight: 20,
    },
    author: {
        fontSize: 13,
        color: "#666",
    },
    playBadge: {
        flexDirection: "row",
        alignItems: "center",
    },
    playText: {
        fontSize: 11,
        color: "#007AFF",
        fontWeight: "600",
        marginLeft: 4,
    },

    /* STYLE KHI TRỐNG */
    empty: {
        alignItems: "center",
        marginTop: 60,
    },
    emptyText: {
        fontSize: 15,
        color: "#888",
        marginTop: 10,
    },
});