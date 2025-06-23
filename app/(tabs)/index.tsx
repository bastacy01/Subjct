import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, Linking } from 'react-native';
import Colors from '@/constants/Colors';
import { Play, Pause, Clock, Calendar } from 'lucide-react-native';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

export default function HomeScreen() {
  const { 
    currentLecture, 
    isPlaying, 
    handleLectureSelect, 
    handlePlayButtonPress 
  } = useAudioPlayer();

  const recentLectures = [
    {
      id: '1',
      title: 'Intro to Artificial Intelligence',
      course: 'CS 210',
      instructor: 'Dr. Sarah Chen',
      duration: '59:30',
      date: '2024-03-15',
      description: 'This lecture covers the fundamental concepts of artificial intelligence, including basic Python syntax and programming examples.'
    },
    {
      id: '2',
      title: 'Laws of Thermodynamics',
      course: 'PHYS 211',
      instructor: 'Dr. Michael Brown',
      duration: '55:30',
      date: '2024-03-14',
      description: 'An introduction to the basic principles of the 3 Laws of Thermodynamics.'
    },
    {
      id: '3',
      title: 'Linear Algebra Applications',
      course: 'MATH 241',
      instructor: 'Dr. Robert Johnson',
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

  const handleBoltLogoPress = async () => {
    try {
      const supported = await Linking.canOpenURL('https://bolt.new/');
      if (supported) {
        await Linking.openURL('https://bolt.new/');
      } else {
        console.log("Don't know how to open URI: https://bolt.new/");
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  // Check if a lecture should be highlighted (currently playing AND from same course)
  const isLectureHighlighted = (lecture: any) => {
    return currentLecture?.id === lecture.id && 
           currentLecture?.course === lecture.course;
  };

  const renderLectureCard = (lecture: any) => (
    <TouchableOpacity
      key={lecture.id}
      style={[
        styles.lectureCard,
        isLectureHighlighted(lecture) && styles.activeLectureCard
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
      
      <TouchableOpacity 
        style={styles.playButtonContainer}
        onPress={(e) => {
          e.stopPropagation();
          handlePlayButtonPress(lecture);
        }}
      >
        {currentLecture?.id === lecture.id && 
         currentLecture?.course === lecture.course && 
         isPlaying ? (
          <Pause size={24} color={Colors.light.primary[600]} />
        ) : (
          <Play size={24} color={Colors.light.primary[600]} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity 
          style={styles.boltLogoContainer}
          onPress={handleBoltLogoPress}
          activeOpacity={0.7}
        >
          <Image 
            source={require('@/assets/images/white_circle_360x360.png')}
            style={styles.boltLogo}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.lecturesContainer}>
          <Text style={styles.sectionTitle}>Recent lectures</Text>
          {recentLectures.map(renderLectureCard)}
          
          <Text style={[styles.sectionTitle, styles.upcomingTitle]}>Upcoming lectures</Text>
          {upcomingLectures.map(renderLectureCard)}
        </View>
      </ScrollView>
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
    paddingTop: Platform.OS === 'ios' ? 55 : 35,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollContent: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
    marginTop: 10, // Add vertical offset to move text down
  },
  boltLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 5,
  },
  boltLogo: {
    width: 38,
    height: 38,
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
    // Removed backgroundColor and borderRadius to remove gray circle
  },
});