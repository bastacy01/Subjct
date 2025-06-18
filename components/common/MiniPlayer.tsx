import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

const MiniPlayer: React.FC = () => {
  const { 
    currentLecture, 
    isPlaying, 
    handleMiniPlayerPress, 
    togglePlayback 
  } = useAudioPlayer();

  if (!currentLecture) {
    return null;
  }

  return (
    <TouchableOpacity 
      style={styles.playerBar}
      onPress={handleMiniPlayerPress}
      activeOpacity={0.9}
    >
      <View style={styles.playerInfo}>
        <Text numberOfLines={1} style={styles.playerTitle}>
          {currentLecture.title}
        </Text>
        <Text style={styles.playerCourse}>{currentLecture.course}</Text>
      </View>
      
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          togglePlayback(currentLecture);
        }}
      >
        {isPlaying ? (
          <Pause size={24} color="white" />
        ) : (
          <Play size={24} color="white" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  playerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: Colors.light.primary[600],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  playerInfo: {
    flex: 1,
    marginRight: 16,
  },
  playerTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: 'white',
    marginBottom: 2,
  },
  playerCourse: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.light.primary[200],
  },
});

export default MiniPlayer;