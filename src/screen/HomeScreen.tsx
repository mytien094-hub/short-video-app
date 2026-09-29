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
  TouchableOpacity,
  Modal,
  TextInput,
  Share,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

// Import Component của Tiên (Member C) và Data của Nhi (Member B)
import { VideoPlayer } from "../components/VideoPlayer";
import videos from "../data/videos";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

export default function HomeScreen({ route }: any) {
  const flatListRef = useRef<FlatList>(null);
  const [activeVideoId, setActiveVideoId] = useState<number>(videos[0].id);

  // Tự động cuộn tới video được chọn (Member C)
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <FlatList
        ref={flatListRef}
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VideoItemCard
            item={item}
            isPlaying={item.id === activeVideoId}
          />
        )}
        getItemLayout={getItemLayout}
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

// ----------------------------------------------------
// COMPONENT THẺ VIDEO TƯƠNG TÁC (NHIỆM VỤ CỦA MEMBER A)
// ----------------------------------------------------
function VideoItemCard({ item, isPlaying }: { item: (typeof videos)[0]; isPlaying: boolean }) {
  // State tương tác
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.id * 120 + 850);
  const [bookmarked, setBookmarked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false); // Thêm trạng thái Follow

  // State Modal Bình luận
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, author: "Trần Nhạc", text: "🔥🔥🔥" },
    { id: 2, author: "Thị Nở", text: "Chấm chấm" },
    { id: 3, author: "Roma", text: "Hay ạ " },
  ]);
  const [inputComment, setInputComment] = useState("");

  // Logic Thả tim
  const toggleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
      setLiked(false);
    } else {
      setLikeCount(likeCount + 1);
      setLiked(true);
    }
  };

  // Logic Chia sẻ
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Xem video ngắn hấp dẫn: "${item.title}" tại: ${item.videoUrl}`,
        title: item.title,
      });
    } catch (error) {
      console.log("Lỗi chia sẻ:", error.message);
    }
  };

  // Logic Thêm bình luận
  const handleSendComment = () => {
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
    <View style={styles.videoContainer}>
      {/* 🎬 TRÌNH PHÁT VIDEO CHÍNH (MEMBER C) */}
      <VideoPlayer videoUrl={item.videoUrl} isActive={isPlaying} />

      {/* 📌 THANH NÚT TƯƠNG TÁC BÊN PHẢI (MEMBER A) */}
      <View style={styles.rightActionBar}>

        {/* Avatar & Nút Follow */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.thumbnail }} style={styles.avatar} />
          <TouchableOpacity
            style={[styles.followBtn, isFollowed && styles.followedBtn]}
            onPress={() => setIsFollowed(!isFollowed)}
          >
            <Ionicons name={isFollowed ? "checkmark" : "add"} size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Nút Like / Tim */}
        <TouchableOpacity style={styles.actionBtn} onPress={toggleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={36}
            color={liked ? "#e74c3c" : "#ffffff"}
          />
          <Text style={styles.actionText}>{likeCount}</Text>
        </TouchableOpacity>

        {/* Nút Bình luận */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowCommentModal(true)}>
          <Ionicons name="chatbubble-ellipses-outline" size={34} color="#ffffff" />
          <Text style={styles.actionText}>{comments.length}</Text>
        </TouchableOpacity>

        {/* Nút Lưu / Bookmark */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => setBookmarked(!bookmarked)}>
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={34}
            color={bookmarked ? "#f1c40f" : "#ffffff"}
          />
          <Text style={styles.actionText}>{bookmarked ? "Đã lưu" : "Lưu"}</Text>
        </TouchableOpacity>

        {/* Nút Chia sẻ */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <FontAwesome name="share" size={28} color="#ffffff" />
          <Text style={styles.actionText}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>

      {/* 📝 THÔNG TIN TÁC GIẢ & TIÊU ĐỀ GÓC DƯỚI TRÁI */}
      <View style={styles.overlay}>
        <Text style={styles.authorText}>@{item.author}</Text>
        <Text style={styles.titleText}>{item.title}</Text>
      </View>

      {/* 💬 POPUP BÌNH LUẬN */}
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
              keyExtractor={(c) => c.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: comment }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentUser}>{comment.author}:</Text>
                  <Text style={styles.commentBody}>{comment.text}</Text>
                </View>
              )}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Thêm bình luận..."
                value={inputComment}
                onChangeText={setInputComment}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSendComment}>
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
  container: { flex: 1, backgroundColor: "#000" },
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
    right: 90,
    zIndex: 10,
  },
  authorText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowRadius: 4,
  },
  titleText: {
    color: "#eee",
    fontSize: 14,
    lineHeight: 20,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowRadius: 4,
  },

  /* ACTION BAR BÊN PHẢI */
  rightActionBar: {
    position: "absolute",
    right: 12,
    bottom: 90,
    alignItems: "center",
    zIndex: 12,
  },

  /* AVATAR & FOLLOW */
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  followBtn: {
    position: "absolute",
    bottom: -10,
    backgroundColor: "#ea4335",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  followedBtn: {
    backgroundColor: "#4CAF50", // Đổi màu xanh khi đã follow
  },

  actionBtn: { alignItems: "center", marginBottom: 18 },
  actionText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowRadius: 4,
  },

  /* MODAL BÌNH LUẬN */
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContainer: { backgroundColor: "#ffffff", borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 15, maxHeight: "55%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 10, marginBottom: 10 },
  modalTitle: { fontSize: 15, fontWeight: "bold" },
  commentItem: { flexDirection: "row", marginBottom: 12 },
  commentUser: { fontWeight: "bold", marginRight: 6, color: "#222" },
  commentBody: { color: "#444", flex: 1 },
  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  commentInput: { flex: 1, height: 40, borderWidth: 1, borderColor: "#ddd", borderRadius: 20, paddingHorizontal: 15, backgroundColor: "#f9f9f9" },
  sendBtn: { backgroundColor: "#007AFF", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginLeft: 8 },
});