import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { Clock } from 'lucide-react-native';
import { semesters } from '@/constants/MockData';

export default function CoursesScreen() {
  const currentSemester = semesters[0];
  const courses = currentSemester.courses;

  const handleCoursePress = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.courseCard}
      onPress={() => handleCoursePress(item.id)}
    >
      <View style={styles.courseHeader}>
        <View style={styles.courseHeaderContent}>
          <Text style={styles.courseCode}>{item.code}</Text>
          <View style={styles.creditBadge}>
            <Text style={styles.creditText}>
              {item.credits} {item.credits === 1 ? 'credit' : 'credits'}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.courseName}>{item.name}</Text>
      <Text style={styles.courseInstructor}>{item.instructor}</Text>
      
      <View style={styles.courseMeta}>
        <View style={styles.metaItem}>
          <Clock size={16} color={Colors.light.neutral[600]} />
          <Text style={styles.metaText}>{item.meetingTimes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Courses</Text>
        <Text style={styles.subtitle}>{currentSemester.name}</Text>
      </View>
      
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourseItem}
        contentContainerStyle={styles.coursesList}
        showsVerticalScrollIndicator={false}
      />
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
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.primary[200],
  },
  coursesList: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  courseHeader: {
    marginBottom: 12,
  },
  courseHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseCode: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.light.primary[600],
  },
  courseName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.light.neutral[900],
    marginBottom: 8,
  },
  courseInstructor: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.light.neutral[700],
    marginBottom: 16,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.neutral[700],
    marginLeft: 8,
  },
  creditBadge: {
    backgroundColor: Colors.light.neutral[100],
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  creditText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.light.neutral[700],
  },
});