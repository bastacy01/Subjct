import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors';
import { Play, Pause, Clock, Calendar } from 'lucide-react-native';
import { semesters } from '@/constants/MockData';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    currentLecture, 
    isPlaying, 
    handleLectureSelect, 
    handlePlayButtonPress,
    setSelectedLecture,
    setShowLectureDetail
  } = useAudioPlayer();
  
  // Find the course from the mock data
  const course = semesters[0].courses.find(c => c.id === id);

  if (!course) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  // Mock lectures data
  const lectures = [
    {
      id: '1',
      title: 'Introduction to the Course',
      duration: '50:00',
      date: '2024-03-15',
      description: 'Overview of course objectives and syllabus review.',
      instructor: course.instructor,
      course: course.code
    },
    {
      id: '2',
      title: 'Fundamental Concepts',
      duration: '45:30',
      date: '2024-03-17',
      description: 'Introduction to basic principles and terminology.',
      instructor: course.instructor,
      course: course.code
    },
    {
      id: '3',
      title: 'Advanced Topics Part 1',
      duration: '55:15',
      date: '2024-03-20',
      description: 'Deep dive into advanced concepts and their applications.',
      instructor: course.instructor,
      course: course.code
    },
    {
      id: '4',
      title: 'Problem Solving Session',
      duration: '48:20',
      date: '2024-03-22',
      description: 'Interactive session working through complex problems.',
      instructor: course.instructor,
      course: course.code
    },
    {
      id: '5',
      title: 'Case Studies',
      duration: '52:45',
      date: '2024-03-24',
      description: 'Analysis of real-world applications and examples.',
      instructor: course.instructor,
      course: course.code
    }
  ];

  const handleLecturePress = (lecture: any) => {
    // Set the lecture as selected and open the modal
    setSelectedLecture(lecture);
    setShowLectureDetail(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.courseCode}>{course.code}</Text>
        <Text style={styles.courseName}>{course.name}</Text>
        <Text style={styles.instructor}>{course.instructor}</Text>
        <Text style={styles.description}>
          This is the section for the specific course description. Most courses include a paragraph of what to expect from the course. This will come from the LMS api provider.
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.lecturesTitle}>Lectures</Text>
        <ScrollView 
          style={styles.lecturesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.lecturesContent, { paddingBottom: 56 }]} // Add padding for mini player
        >
          {lectures.map((lecture) => (
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
                <Text style={styles.lectureDescription}>{lecture.description}</Text>
                
                <View style={styles.lectureMetadata}>
                  <View style={styles.metadataItem}>
                    <Clock size={14} color={Colors.light.neutral[600]} />
                    <Text style={styles.lectureMetadataText}>{lecture.duration}</Text>
                  </View>
                  <View style={styles.metadataItem}>
                    <Calendar size={14} color={Colors.light.neutral[600]} />
                    <Text style={styles.lectureMetadataText}>
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
                {currentLecture?.id === lecture.id && isPlaying ? (
                  <Pause size={24} color={Colors.light.primary[600]} />
                ) : (
                  <Play size={24} color={Colors.light.primary[600]} />
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 24,
    paddingTop: 0,
    backgroundColor: Colors.light.primary[600],
  },
  courseCode: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: 'white',
    marginBottom: 8,
  },
  courseName: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
    color: Colors.light.primary[100],
    marginBottom: 8,
  },
  instructor: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.primary[200],
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.primary[200],
    lineHeight: 20,
    marginBottom: 24,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  lecturesTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.light.neutral[900],
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  lecturesList: {
    flex: 1,
  },
  lecturesContent: {
    padding: 24,
    paddingTop: 8,
  },
  lectureCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
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
    marginRight: 16,
  },
  lectureTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.light.neutral[900],
    marginBottom: 4,
  },
  lectureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.neutral[600],
    marginBottom: 12,
  },
  lectureMetadata: {
    flexDirection: 'row',
    gap: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lectureMetadataText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.neutral[600],
  },
  playButtonContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.error[500],
    textAlign: 'center',
    marginTop: 24,
  },
});