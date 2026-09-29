import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import videos from "../data/videos";

export default function SearchScreen() {
    const [keyword, setKeyword] = useState("");

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

    const renderVideo = ({ item }) => {
        return (
            <TouchableOpacity style={styles.card}>
                <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.thumbnail}
                />

                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>
                        {item.title}
                    </Text>

                    <Text style={styles.author}>
                        {item.author}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Tiêu đề */}
            <Text style={styles.header}>Tìm kiếm video</Text>

            {/* Ô tìm kiếm */}
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm video hoặc tác giả..."
                placeholderTextColor="#999"
                value={keyword}
                onChangeText={setKeyword}
            />

            {/* Số lượng kết quả */}
            <Text style={styles.resultText}>
                {filteredVideos.length} video được tìm thấy
            </Text>

            {/* Danh sách video */}
            <FlatList
                data={filteredVideos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderVideo}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>
                            Không tìm thấy video phù hợp
                        </Text>
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
        paddingTop: 50,
    },

    header: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#111",
        marginBottom: 18,
    },

    searchInput: {
        height: 48,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ddd",
    },

    resultText: {
        fontSize: 14,
        color: "#777",
        marginTop: 14,
        marginBottom: 10,
    },

    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 12,
        padding: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,

        elevation: 2,
    },

    thumbnail: {
        width: 130,
        height: 80,
        borderRadius: 8,
        backgroundColor: "#ddd",
    },

    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },

    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
        marginBottom: 8,
    },

    author: {
        fontSize: 14,
        color: "#777",
    },

    empty: {
        alignItems: "center",
        marginTop: 60,
    },

    emptyText: {
        fontSize: 16,
        color: "#888",
    },
});