import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Share,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";

// Import Component VideoPlayer của (Member C) và Dữ liệu 12 Video của (Member B)
import { VideoPlayer } from "./src/components/VideoPlayer";
import videos from "./src/data/videos";

export default function App() {
  // 1. Quản lý Video đang chọn phát (Mặc định chọn video ID 1)
  const [activeVideo, setActiveVideo] = useState(videos[0]);

  // 2. State Tương tác UI của Member A
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1250);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDesc, setShowDesc] = useState(false);

  // 3. State Modal Bình luận của Member A
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, author: "Trần Nhạc", text: "🔥🔥🔥" },
    { id: 2, author: "Dev_React_Mobile", text: "chill quasss" },
    { id: 3, author: "Góc_Gia_Giải_Trí", text: "Hay ạ" },
  ]);
  const [inputComment, setInputComment] = useState("");

  // 4. Tìm kiếm video của Member B
  const [keyword, setKeyword] = useState("");
  const filteredVideos = videos.filter((video) => {
    const searchText = keyword.toLowerCase().trim();
    if (searchText === "") return true;
    return (
      video.title.toLowerCase().includes(searchText) ||
      video.author.toLowerCase().includes(searchText)
    );
  });

  // Xử lý Chọn Video từ danh sách để Phát lên Khung chính
  const handleSelectVideo = (selectedVideo) => {
    setActiveVideo(selectedVideo);
    setIsLiked(false);
    setIsDisliked(false);
    setLikeCount(Math.floor(Math.random() * 2000) + 500);
  };

  // Xử lý nút Thả tim / Like
  const handleToggleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
      setIsLiked(false);
    } else {
      setLikeCount(likeCount + 1);
      setIsLiked(true);
      if (isDisliked) setIsDisliked(false);
    }
  };

  // Xử lý Chia sẻ
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Xem ngay video: "${activeVideo.title}" tại: ${activeVideo.videoUrl}`,
        title: activeVideo.title,
      });
    } catch (error) {
      console.log("Lỗi chia sẻ:", error.message);
    }
  };

  // Xử lý Gửi bình luận
  const handleAddComment = () => {
    if (inputComment.trim() === "") return;
    const newComment = {
      id: Date.now(),
      author: "Bạn",
      text: inputComment.trim(),
    };
    setComments([newComment, ...comments]);
    setInputComment("");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🎬 1. TRÌNH PHÁT VIDEO CHÍNH (ĐÃ CẬP NHẬT DÙNG PROP isActive CỦA TIÊN) */}
        <View style={styles.playerContainer}>
          <VideoPlayer
            key={activeVideo.id || activeVideo.videoUrl}
            videoUrl={activeVideo.videoUrl}
            isActive={true}
          />
        </View>

        {/* 📌 2. THÔNG TIN VIDEO & NÚT TƯƠNG TÁC UI (MEMBER A) */}
        <View style={styles.detailsContainer}>
          <Text style={styles.videoTitle}>{activeVideo.title}</Text>

          {/* Kênh Tác giả & Nút Đăng ký */}
          <View style={styles.channelRow}>
            <Image
              source={{ uri: activeVideo.thumbnail }}
              style={styles.avatar}
            />
            <View style={styles.channelInfo}>
              <Text style={styles.channelName}>{activeVideo.author}</Text>
              <Text style={styles.subCount}>1,2 Tr người đăng ký</Text>
            </View>
            <TouchableOpacity
              style={[styles.subBtn, isSubscribed && styles.subBtnActive]}
              onPress={() => setIsSubscribed(!isSubscribed)}
            >
              <Text style={[styles.subBtnText, isSubscribed && styles.subBtnTextActive]}>
                {isSubscribed ? "Đã đăng ký" : "Đăng ký"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Thanh Nút Tương Tác Hành Động */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionScrollView}>
            {/* Cụm Nút Thích / Không thích */}
            <View style={styles.likeDislikeGroup}>
              <TouchableOpacity style={styles.actionPill} onPress={handleToggleLike}>
                <Ionicons
                  name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                  size={18}
                  color={isLiked ? "#007AFF" : "#0f0f0f"}
                />
                <Text style={styles.actionPillText}>{likeCount}</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.actionPill}
                onPress={() => setIsDisliked(!isDisliked)}
              >
                <Ionicons
                  name={isDisliked ? "thumbs-down" : "thumbs-down-outline"}
                  size={18}
                  color={isDisliked ? "#e74c3c" : "#0f0f0f"}
                />
              </TouchableOpacity>
            </View>

            {/* Nút Chia sẻ */}
            <TouchableOpacity style={styles.actionPillSingle} onPress={handleShare}>
              <FontAwesome name="share" size={16} color="#0f0f0f" />
              <Text style={styles.actionPillText}>Chia sẻ</Text>
            </TouchableOpacity>

            {/* Nút Mở Bình luận */}
            <TouchableOpacity
              style={styles.actionPillSingle}
              onPress={() => setShowCommentModal(true)}
            >
              <MaterialIcons name="question-answer" size={18} color="#0f0f0f" />
              <Text style={styles.actionPillText}>Bình luận ({comments.length})</Text>
            </TouchableOpacity>

            {/* Nút Lưu / Bookmark */}
            <TouchableOpacity
              style={styles.actionPillSingle}
              onPress={() => setIsSaved(!isSaved)}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={18}
                color={isSaved ? "#f1c40f" : "#0f0f0f"}
              />
              <Text style={styles.actionPillText}>{isSaved ? "Đã lưu" : "Lưu"}</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Hộp Mô tả Mở rộng */}
          <TouchableOpacity
            style={styles.descriptionBox}
            onPress={() => setShowDesc(!showDesc)}
          >
            <Text style={styles.descMeta}>320K lượt xem • 1 tuần trước</Text>
            <Text style={styles.descText} numberOfLines={showDesc ? 0 : 2}>
              {`Video thuộc bản quyền kênh ${activeVideo.author}. Trải nghiệm ứng dụng xem video ngắn chất lượng cao xây dựng bằng React Native và Expo Video.`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🔍 3. KHUNG TÌM KIẾM & DANH SÁCH 12 VIDEO (MEMBER B) */}
        <View style={styles.playlistSection}>
          <Text style={styles.sectionTitle}>Danh sách Feed Video</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Tìm video hoặc tác giả..."
            placeholderTextColor="#888"
            value={keyword}
            onChangeText={setKeyword}
          />

          <Text style={styles.resultText}>Tìm thấy {filteredVideos.length} video</Text>

          {/* Danh Sách 12 Video */}
          {filteredVideos.map((item) => (
            <TouchableOpacity
              key={item.id.toString()}
              style={[
                styles.videoListItem,
                activeVideo.id === item.id && styles.activeListItem,
              ]}
              onPress={() => handleSelectVideo(item)}
            >
              <Image source={{ uri: item.thumbnail }} style={styles.itemThumbnail} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.itemAuthor}>{item.author}</Text>
                <Text style={styles.itemMeta}>
                  {activeVideo.id === item.id ? "▶ Đang phát video này" : "► Nhấn để phát video này"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 💬 4. POPUP MODAL BÌNH LUẬN THỜI GIAN THỰC */}
      <Modal
        visible={showCommentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCommentModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bình luận ({comments.length})</Text>
              <TouchableOpacity onPress={() => setShowCommentModal(false)}>
                <Ionicons name="close-circle" size={26} color="#888" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={comments}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.commentRow}>
                  <Text style={styles.commentUser}>{item.author}:</Text>
                  <Text style={styles.commentBody}>{item.text}</Text>
                </View>
              )}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Viết bình luận của bạn..."
                value={inputComment}
                onChangeText={setInputComment}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleAddComment}>
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", paddingTop: Platform.OS === "android" ? 25 : 0 },
  playerContainer: { width: "100%", height: 230, backgroundColor: "#000" },
  detailsContainer: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  videoTitle: { fontSize: 16, fontWeight: "bold", color: "#0f0f0f", marginBottom: 10 },

  /* CHANNEL ROW */
  channelRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  channelInfo: { flex: 1, marginLeft: 10 },
  channelName: { fontSize: 14, fontWeight: "bold", color: "#0f0f0f" },
  subCount: { fontSize: 12, color: "#606060" },
  subBtn: { backgroundColor: "#0f0f0f", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  subBtnActive: { backgroundColor: "#e5e5e5" },
  subBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  subBtnTextActive: { color: "#0f0f0f" },

  /* ACTION PILLS */
  actionScrollView: { marginBottom: 10 },
  likeDislikeGroup: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    alignItems: "center",
    marginRight: 8,
  },
  actionPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8 },
  actionPillText: { fontSize: 13, fontWeight: "600", marginLeft: 6, color: "#0f0f0f" },
  divider: { width: 1, height: 18, backgroundColor: "#ccc" },
  actionPillSingle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },

  /* DESCRIPTION BOX */
  descriptionBox: { backgroundColor: "#f2f2f2", padding: 10, borderRadius: 12, marginTop: 4 },
  descMeta: { fontSize: 12, fontWeight: "bold", color: "#0f0f0f", marginBottom: 4 },
  descText: { fontSize: 13, color: "#272727", lineHeight: 18 },

  /* PLAYLIST SECTION */
  playlistSection: { padding: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: "#f9f9f9",
  },
  resultText: { fontSize: 13, color: "#606060", marginTop: 8, marginBottom: 10 },
  videoListItem: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 8,
  },
  activeListItem: { borderLeftWidth: 4, borderLeftColor: "#007AFF", backgroundColor: "#eef6ff" },
  itemThumbnail: { width: 120, height: 75, borderRadius: 8 },
  itemInfo: { flex: 1, marginLeft: 10, justifyContent: "space-between" },
  itemTitle: { fontSize: 14, fontWeight: "bold", color: "#0f0f0f" },
  itemAuthor: { fontSize: 12, color: "#606060" },
  itemMeta: { fontSize: 11, color: "#007AFF", fontWeight: "600" },

  /* MODAL STYLES */
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContainer: { backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 15, maxHeight: "60%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 10, marginBottom: 10 },
  modalTitle: { fontSize: 16, fontWeight: "bold" },
  commentRow: { flexDirection: "row", marginBottom: 10 },
  commentUser: { fontWeight: "bold", marginRight: 6, color: "#0f0f0f" },
  commentBody: { color: "#272727", flex: 1 },
  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  commentInput: { flex: 1, height: 40, borderWidth: 1, borderColor: "#ddd", borderRadius: 20, paddingHorizontal: 15, backgroundColor: "#f9f9f9" },
  sendBtn: { backgroundColor: "#007AFF", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginLeft: 8 },
});