import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import Button from '@/components/common/Button';
import ProgressBar from '@/components/common/ProgressBar';
import { Semester, semesters } from '@/constants/MockData';
import { Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function CourseSelectScreen() {
  const [selectedSemester, setSelectedSemester] = useState<Semester>(semesters[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const toggleCourseSelection = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const selectAllCourses = () => {
    if (selectedCourses.length === selectedSemester.courses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(selectedSemester.courses.map(course => course.id));
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    
    // Simulate setup process
    setTimeout(async () => {
      // Mark user as authenticated
      await login();
      setIsSubmitting(false);
      router.replace('/(tabs)');
    }, 800);
  };

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(200)}
    >
      <View style={styles.header}>
        <ProgressBar progress={0.75} style={styles.progressBar} />
        <Text style={styles.title}>Select Your Courses</Text>
      </View>

      <View style={styles.semesterSelectorContainer}>
        <Text style={styles.selectorLabel}>Current Semester</Text>
        <TouchableOpacity
          style={[
            styles.semesterSelector,
            isDropdownOpen && styles.semesterSelectorActive,
          ]}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          activeOpacity={0.7}
        >
          <Text style={styles.selectedSemesterText}>{selectedSemester.name}</Text>
          {isDropdownOpen ? (
            <ChevronUp size={20} color={Colors.light.neutral[700]} />
          ) : (
            <ChevronDown size={20} color={Colors.light.neutral[700]} />
          )}
        </TouchableOpacity>

        {isDropdownOpen && (
          <Animated.View
            style={styles.dropdown}
            entering={FadeIn.duration(200)}
          >
            <FlatList
              data={semesters}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    item.id === selectedSemester.id && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setSelectedSemester(item);
                    setIsDropdownOpen(false);
                    setSelectedCourses([]);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      item.id === selectedSemester.id && styles.dropdownItemTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {item.id === selectedSemester.id && (
                    <Check size={16} color={Colors.light.primary[600]} />
                  )}
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        )}
      </View>

      <View style={styles.coursesContainer}>
        <View style={styles.coursesHeader}>
          <Text style={styles.coursesTitle}>Available Courses</Text>
          <TouchableOpacity onPress={selectAllCourses}>
            <Text style={styles.selectAllText}>
              {selectedCourses.length === selectedSemester.courses.length
                ? 'Deselect All'
                : 'Select All'}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={selectedSemester.courses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.courseItem,
                selectedCourses.includes(item.id) && styles.courseItemSelected,
              ]}
              onPress={() => toggleCourseSelection(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.courseInfo}>
                <Text style={styles.courseCode}>{item.code}</Text>
                <Text style={styles.courseName}>{item.name}</Text>
                <Text style={styles.courseInstructor}>{item.instructor}</Text>
                <View style={styles.courseDetailRow}>
                  <Text style={styles.courseDetail}>
                    {item.credits} {item.credits === 1 ? 'credit' : 'credits'}
                  </Text>
                  <Text style={styles.courseDetail}>{item.meetingTimes}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedCourses.includes(item.id) && styles.checkboxSelected,
                ]}
              >
                {selectedCourses.includes(item.id) && (
                  <Check size={16} color="white" />
                )}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.coursesList}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          disabled={selectedCourses.length === 0}
          loading={isSubmitting}
          onPress={handleFinish}
          style={styles.button}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  progressBar: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.light.neutral[900],
    marginBottom: 8,
  },
  semesterSelectorContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
    zIndex: 100,
  },
  selectorLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.neutral[700],
    marginBottom: 8,
  },
  semesterSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.neutral[100],
    borderWidth: 1,
    borderColor: Colors.light.neutral[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 56,
  },
  semesterSelectorActive: {
    borderColor: Colors.light.primary[400],
    backgroundColor: Colors.light.neutral[50],
  },
  selectedSemesterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.neutral[900],
  },
  dropdown: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.light.neutral[300],
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral[200],
  },
  dropdownItemActive: {
    backgroundColor: Colors.light.primary[50],
  },
  dropdownItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.neutral[800],
  },
  dropdownItemTextActive: {
    fontFamily: 'Inter-Medium',
    color: Colors.light.primary[600],
  },
  coursesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  coursesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  coursesTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.light.neutral[900],
  },
  selectAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.primary[600],
  },
  coursesList: {
    paddingBottom: 16,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.neutral[50],
    borderWidth: 1,
    borderColor: Colors.light.neutral[200],
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  courseItemSelected: {
    borderColor: Colors.light.primary[400],
    backgroundColor: Colors.light.primary[50],
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.light.primary[600],
    marginBottom: 4,
  },
  courseName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.neutral[900],
    marginBottom: 4,
  },
  courseInstructor: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.neutral[700],
    marginBottom: 8,
  },
  courseDetailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  courseDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.light.neutral[600],
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.light.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  checkboxSelected: {
    backgroundColor: Colors.light.primary[600],
    borderColor: Colors.light.primary[600],
  },
  buttonContainer: {
    padding: 24,
    marginBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  button: {
    width: '100%',
  },
});