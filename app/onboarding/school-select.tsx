import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import SearchableDropdown from '@/components/onboarding/SearchableDropdown';
import Button from '@/components/common/Button';
import ProgressBar from '@/components/common/ProgressBar';
import { universities, University } from '@/constants/Universities';

export default function SchoolSelectScreen() {
  const [selectedSchool, setSelectedSchool] = useState<University | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transform universities data into the format expected by SearchableDropdown
  const schoolOptions = universities.map(school => ({
    id: school.id,
    label: school.name,
    value: school.id
  }));

  const handleSelectSchool = (item: { id: string; label: string; value: string }) => {
    if (item.id) {
      const school = universities.find(uni => uni.id === item.value);
      if (school) {
        setSelectedSchool(school);
      }
    } else {
      setSelectedSchool(null);
    }
  };

  const handleContinue = () => {
    if (selectedSchool) {
      router.push(`/onboarding/lms-auth?schoolId=${selectedSchool.id}`);
    }
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(200)}
    >
      <View style={styles.header}>
        <ProgressBar progress={0.25} style={styles.progressBar} />
        <Text style={styles.stepText}>Step 1 of 4</Text>
        <Text style={styles.title}>Select Your University</Text>
        <Text style={styles.subtitle}>
          Choose your school to connect with your Learning Management System
        </Text>
      </View>
      
      <View style={styles.dropdownContainer}>
        <SearchableDropdown
          data={schoolOptions}
          placeholder="Search for your university..."
          label="University"
          onSelect={handleSelectSchool}
          selectedItem={selectedSchool ? {
            id: selectedSchool.id,
            label: selectedSchool.name,
            value: selectedSchool.id
          } : null}
          maxHeight={300}
          searchable={true}
          autoFocus={false}
        />
        
        {selectedSchool && (
          <Animated.View 
            style={styles.schoolInfoContainer}
            entering={FadeIn.duration(300)}
          >
            <Text style={styles.schoolInfoLabel}>
              Learning Management System:
            </Text>
            <View style={styles.lmsInfoContainer}>
              <View style={styles.lmsNameContainer}>
                <Text style={styles.lmsName}>
                  {getLmsDisplayName(selectedSchool.lmsProvider)}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          disabled={!selectedSchool}
          onPress={handleContinue}
          style={styles.button}
        />
      </View>
    </Animated.View>
  );
}

// Helper function to get display name for LMS providers
function getLmsDisplayName(provider: string): string {
  switch (provider) {
    case 'canvas':
      return 'Canvas';
    case 'blackboard':
      return 'Blackboard Learn';
    case 'moodle':
      return 'Moodle';
    case 'brightspace':
      return 'D2L Brightspace';
    default:
      return provider.charAt(0).toUpperCase() + provider.slice(1);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 32,
  },
  progressBar: {
    marginBottom: 8,
  },
  stepText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.neutral[500],
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.light.neutral[900],
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.neutral[600],
    lineHeight: 24,
  },
  dropdownContainer: {
    marginBottom: 24,
  },
  schoolInfoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.light.neutral[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.neutral[200],
  },
  schoolInfoLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.light.neutral[700],
    marginBottom: 8,
  },
  lmsInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lmsNameContainer: {
    backgroundColor: Colors.light.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lmsName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.primary[700],
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  button: {
    width: '100%',
  },
});