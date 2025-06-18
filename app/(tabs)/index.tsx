import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal } from 'react-native';
import Colors from '@/constants/Colors';
import { Play, Pause, SkipForward, SkipBack, Clock, Calendar, X } from 'lucide-react-native';
import { Audio } from 'expo-av';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function HomeScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLecture, setCurrentLecture] = useState<any>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [showLectureDetail, setShowLectureDetail] = useState(false);

  const recentLectures = [
    {
      id: '1',
      title: 'Introduction to Neural Networks',
      course: 'CS 440',
      instructor: 'Dr. Sarah Chen',
      duration: '1:15:00',
      date: '2024-03-15',
      description: 'This lecture covers the fundamental concepts of neural networks, including perceptrons, activation functions, and backpropagation.'
    },
    {
      id: '2',
      title: 'Quantum Mechanics Fundamentals',
      course: 'PHYS 211',
      instructor: 'Dr. Michael Brown',
      duration: '55:30',
      date: '2024-03-14',
      description: 'An introduction to the basic principles of quantum mechanics, wave functions, and the Schrödinger equation.'
    },
    {
      id: '3',
      title: 'Linear Algebra Applications',
      course: 'MATH 241',
      instructor: 'Prof. Robert Johnson',
      duration: '1:05:45',
      date: '2024-03-13',
      description: 'Exploring practical applications of linear algebra in computer graphics, data analysis, and machine learning.'
    }
  ];

  const upcomingLectures = [
    {
      id: '4',
      title: 'Advanced Data Structures',
      course: 'CS 440',
      instructor: 'Dr. Sarah Chen',
      duration: '1:30:00',
      date: '2024-03-18',
      description: 'Deep dive into advanced data structures including red-black trees and B-trees.'
    },
    {
      id: '5',
      title: 'Wave Mechanics',
      course: 'PHYS 211',
      instructor: 'Dr. Michael Brown',
      duration: '1:00:00',
      date: '2024-03-19',
      description: 'Understanding wave mechanics and their applications in quantum systems.'
    },
    {
      id: '6',
      title: 'Eigenvalues and Eigenvectors',
      course: 'MATH 241',
      instructor: 'Prof. Robert Johnson',
      duration: '1:15:00',
      date: '2024-03-20',
      description: 'Comprehensive overview of eigenvalues, eigenvectors, and their applications.'
    }
  ];

  const togglePlayback = async (lecture: any) => {
    if (currentLecture?.id === lecture.id) {
      if (isPlaying) {
        await sound?.pauseAsync();
      } else {
        await sound?.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      if (sound) {
        await sound.unloadAsync();
      }
      setCurrentLecture(lecture);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav' },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
    }
  };

  const handleLectureSelect = (lecture: any) => {
    setCurrentLecture(lecture);
  };

  const handleMiniPlayerPress = () => {
    if (currentLecture) {
      setSelectedLecture(currentLecture);
      setShowLectureDetail(true);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const renderLectureCard = (lecture: any) => (
    <TouchableOpacity
      key={lecture.id}
      style={[
        styles.lectureCard,
        currentLecture?.id === lecture.id && styles.activeLectureCard
      ]}
      onPress={() => handleLectureSelect(lecture)}
    >
      <View style={styles.lectureInfo}>
        <Text style={styles.lectureTitle}>{lecture.title}</Text>
        <Text style={styles.lectureCourse}>{lecture.course}</Text>
        
        <View style={styles.lectureMetadata}>
          <View style={styles.metadataItem}>
            <Clock size={14} color={Colors.light.neutral[600]} />
            <Text style={styles.metadataText}>{lecture.duration}</Text>
          </View>
          <View style={styles.metadataItem}>
            <Calendar size={14} color={Colors.light.neutral[600]} />
            <Text style={styles.metadataText}>
              {new Date(lecture.date).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.playButtonContainer}>
        {currentLecture?.id === lecture.id && isPlaying ? (
          <Pause size={24} color={Colors.light.primary[600]} />
        ) : (
          <Play size={24} color={Colors.light.primary[600]} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.lecturesContainer}>
          <Text style={styles.sectionTitle}>Recent lectures</Text>
          {recentLectures.map(renderLectureCard)}
          
          <Text style={[styles.sectionTitle, styles.upcomingTitle]}>Upcoming lectures</Text>
          {upcomingLectures.map(renderLectureCard)}
        </View>
      </ScrollView>

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
                    <Clock size={16} color={Colors.light.neutral[600]} />
                    <Text style={styles.detailMetadataText}>{selectedLecture.duration}</Text>
                  </View>
                  <View style={styles.detailMetadataItem}>
                    <Calendar size={16} color={Colors.light.neutral[600]} />
                    <Text style={styles.detailMetadataText}>
                      {new Date(selectedLecture.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.description}>{selectedLecture.description}</Text>

                <View style={styles.playerControlsContainer}>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={styles.progress} />
                    </View>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeText}>10:15</Text>
                      <Text style={styles.timeText}>-40:12</Text>
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
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </Modal>

      {currentLecture && !showLectureDetail && (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.neutral[50],
  },
  header: {
    backgroundColor: Colors.light.primary[600],
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
  },
  scrollContent: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
  },
  lecturesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.light.neutral[700],
    marginBottom: 16,
  },
  upcomingTitle: {
    marginTop: 24,
  },
  lectureCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activeLectureCard: {
    borderColor: Colors.light.primary[400],
    borderWidth: 1,
    backgroundColor: Colors.light.primary[50],
  },
  lectureInfo: {
    flex: 1,
  },
  lectureTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.light.neutral[900],
    marginBottom: 4,
  },
  lectureCourse: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.primary[600],
    marginBottom: 8,
  },
  lectureMetadata: {
    flexDirection: 'row',
    gap: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.neutral[600],
  },
  playButtonContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.light.neutral[200],
    borderRadius: 2,
    marginBottom: 8,
  },
  progress: {
    width: '30%',
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
  }
});