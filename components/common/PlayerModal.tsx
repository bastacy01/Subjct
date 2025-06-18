import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X, Play, Pause, SkipForward, SkipBack, VolumeX, Volume2 } from 'lucide-react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

const PlayerModal: React.FC = () => {
  const {
    selectedLecture,
    showLectureDetail,
    isPlaying,
    volume,
    currentTime,
    totalTime,
    setShowLectureDetail,
    togglePlayback,
    handleVolumeChange,
    handleTimeChange,
    formatTime,
  } = useAudioPlayer();

  const handleProgressGesture = (event: any) => {
    const { state, x } = event.nativeEvent;
    
    if (state === State.ACTIVE || state === State.END) {
      const progressWidth = 280; // Approximate width of progress bar
      const progress = Math.max(0, Math.min(1, x / progressWidth));
      const newTime = Math.floor(progress * totalTime);
      handleTimeChange(newTime);
    }
  };

  const handleVolumeGesture = (event: any) => {
    const { state, x } = event.nativeEvent;
    
    if (state === State.ACTIVE || state === State.END) {
      const volumeWidth = 200; // Approximate width of volume bar
      const newVolume = Math.max(0, Math.min(1, x / volumeWidth));
      handleVolumeChange(newVolume);
    }
  };

  return (
    <Modal
      visible={showLectureDetail}
      transparent={true}
      onRequestClose={() => setShowLectureDetail(false)}
    >
      <Animated.View 
        style={styles.modalContainer}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
      >
        <View style={styles.lectureDetailSheet}>
          <View style={styles.sheetHeader}>
            <TouchableOpacity
              onPress={() => setShowLectureDetail(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.light.neutral[600]} />
            </TouchableOpacity>
          </View>

          {selectedLecture && (
            <View style={styles.sheetContent}>
              <View style={styles.courseIdentifier}>
                <Text style={styles.courseCode}>{selectedLecture.course}</Text>
              </View>
              
              <Text style={styles.detailTitle}>{selectedLecture.title}</Text>
              <Text style={styles.detailInstructor}>{selectedLecture.instructor}</Text>
              
              <View style={styles.detailMetadata}>
                <View style={styles.detailMetadataItem}>
                  <Text style={styles.detailMetadataText}>{selectedLecture.duration}</Text>
                </View>
                <View style={styles.detailMetadataItem}>
                  <Text style={styles.detailMetadataText}>
                    {new Date(selectedLecture.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.description}>{selectedLecture.description}</Text>

              <View style={styles.playerControlsContainer}>
                <View style={styles.progressContainer}>
                  <PanGestureHandler onGestureEvent={handleProgressGesture}>
                    <Animated.View style={styles.progressBarContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progress, 
                            { width: `${(currentTime / totalTime) * 100}%` }
                          ]} 
                        />
                      </View>
                    </Animated.View>
                  </PanGestureHandler>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                    <Text style={styles.timeText}>-{formatTime(totalTime - currentTime)}</Text>
                  </View>
                </View>

                <View style={styles.playerControls}>
                  <TouchableOpacity style={styles.controlButton}>
                    <SkipBack size={24} color={Colors.light.neutral[600]} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => togglePlayback(selectedLecture)}
                    style={styles.mainPlayButton}
                  >
                    {isPlaying ? (
                      <Pause size={32} color="white" />
                    ) : (
                      <Play size={32} color="white" />
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.controlButton}>
                    <SkipForward size={24} color={Colors.light.neutral[600]} />
                  </TouchableOpacity>
                </View>

                <View style={styles.volumeContainer}>
                  <VolumeX size={20} color={Colors.light.neutral[600]} />
                  <PanGestureHandler onGestureEvent={handleVolumeGesture}>
                    <Animated.View style={styles.volumeSliderContainer}>
                      <View style={styles.volumeSlider}>
                        <View 
                          style={[
                            styles.volumeProgress, 
                            { width: `${volume * 100}%` }
                          ]} 
                        />
                      </View>
                    </Animated.View>
                  </PanGestureHandler>
                  <Volume2 size={20} color={Colors.light.neutral[600]} />
                </View>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  lectureDetailSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
  },
  sheetHeader: {
    alignItems: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral[200],
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetContent: {
    padding: 24,
    flex: 1,
  },
  courseIdentifier: {
    backgroundColor: Colors.light.primary[100],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  courseCode: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.primary[700],
  },
  detailTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.light.neutral[900],
    marginBottom: 8,
  },
  detailInstructor: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.neutral[700],
    marginBottom: 16,
  },
  detailMetadata: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  detailMetadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailMetadataText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.neutral[600],
  },
  descriptionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.light.neutral[900],
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.neutral[700],
    lineHeight: 24,
    marginBottom: 32,
  },
  playerControlsContainer: {
    marginTop: 'auto',
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBarContainer: {
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.light.neutral[200],
    borderRadius: 2,
    position: 'relative',
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.light.primary[600],
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.neutral[600],
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 40,
  },
  controlButton: {
    padding: 8,
  },
  mainPlayButton: {
    backgroundColor: Colors.light.primary[600],
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  volumeSliderContainer: {
    flex: 1,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  volumeSlider: {
    height: 4,
    backgroundColor: Colors.light.neutral[200],
    borderRadius: 2,
    position: 'relative',
  },
  volumeProgress: {
    height: '100%',
    backgroundColor: Colors.light.primary[600],
    borderRadius: 2,
  },
});

export default PlayerModal;