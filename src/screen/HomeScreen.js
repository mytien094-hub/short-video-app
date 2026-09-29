import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

// Import dữ liệu từ Nhi (Thành viên B) và Component từ Tiên (Thành viên C)
import { videos } from '../data/videos';
import VideoPlayer from '../components/VideoPlayer';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={videos || []}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <VideoItem item={item} />}
      />
    </View>
  );
}

// Component từng Video Card chứa Giao diện nút tương tác (Nhiệm vụ Thành viên A)
function VideoItem({ item }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item?.likes || 1200);
  const [bookmarked, setBookmarked] = useState(false);

  // Xử lý nút Tim / Like
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
      setLiked(false);
    } else {
      setLikeCount(likeCount + 1);
      setLiked(true);
    }
  };

  // Xử lý nút Bookmark / Lưu
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <View style={styles.videoCard}>
      {/* 1. Trình phát Video (Lấy từ VideoPlayer của Tiên) */}
      <View style={styles.videoContainer}>
        <VideoPlayer videoUrl={item?.videoUrl} />
      </View>

      {/* 2. Thanh nút tương tác bên phải UI (Thành viên A phụ trách) */}
      <View style={styles.rightActionPanel}>
        {/* Nút Like / Tim */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={36}
            color={liked ? '#e74c3c' : '#ffffff'}
          />
          <Text style={styles.actionText}>{likeCount}</Text>
        </TouchableOpacity>

        {/* Nút Bình luận */}
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-ellipses-outline" size={34} color="#ffffff" />
          <Text style={styles.actionText}>{item?.commentsCount || 88}</Text>
        </TouchableOpacity>

        {/* Nút Bookmark (Lưu) */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleBookmark}>
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={34}
            color={bookmarked ? '#f1c40f' : '#ffffff'}
          />
          <Text style={styles.actionText}>{bookmarked ? 'Đã lưu' : 'Lưu'}</Text>
        </TouchableOpacity>

        {/* Nút Chia sẻ */}
        <TouchableOpacity style={styles.actionBtn}>
          <FontAwesome name="share" size={28} color="#ffffff" />
          <Text style={styles.actionText}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Thông tin mô tả Video ở góc dưới */}
      <View style={styles.bottomOverlay}>
        <Text style={styles.authorName}>@{item?.author || 'user_demo'}</Text>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item?.title || 'Video demo ứng dụng xem video ngắn mượt mà với expo-video!'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoCard: {
    width: width,
    height: height,
    position: 'relative',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActionPanel: {
    position: 'absolute',
    right: 14,
    bottom: 110,
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 90,
  },
  authorName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  videoTitle: {
    color: '#f0f0f0',
    fontSize: 14,
    lineHeight: 20,
  },
});