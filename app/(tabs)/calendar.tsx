import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { Clock, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';

export default function CalendarScreen() {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // Generate dates for current view
  const getDates = () => {
    const dates = [];
    const startDate = new Date(selectedDate);
    
    if (viewMode === 'week') {
      // Start from Sunday of current week
      startDate.setDate(selectedDate.getDate() - selectedDate.getDay());
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
      }
    } else {
      // Start from first day of month
      startDate.setDate(1);
      const monthDays = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
      
      // Add empty days for padding
      const firstDayOfMonth = startDate.getDay();
      for (let i = 0; i < firstDayOfMonth; i++) {
        dates.push(null);
      }
      
      // Add month days
      for (let i = 1; i <= monthDays; i++) {
        const date = new Date(startDate);
        date.setDate(i);
        dates.push(date);
      }
    }
    
    return dates;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'week') {
      newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  // Mock schedule data
  const schedule = [
    {
      id: '1',
      courseCode: 'CS 101',
      courseName: 'Introduction to Computer Science',
      startTime: '10:00 AM',
      endTime: '10:50 AM',
      type: 'lecture',
    },
    {
      id: '2',
      courseCode: 'MATH 241',
      courseName: 'Calculus III',
      startTime: '11:00 AM',
      endTime: '12:15 PM',
      type: 'lecture',
    },
    {
      id: '3',
      courseCode: 'PHYS 211',
      courseName: 'University Physics I',
      startTime: '1:00 PM',
      endTime: '1:50 PM',
      type: 'lecture',
    },
  ];

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setSelectedDay(date.getDate());
    }
  };

  const renderCalendarHeader = () => (
    <View style={styles.calendarHeader}>
      <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navigationButton}>
        <ChevronLeft size={24} color={Colors.light.neutral[600]} />
      </TouchableOpacity>
      
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerMonth}>
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
        {viewMode === 'week' && (
          <Text style={styles.headerWeek}>
            Week {Math.ceil(selectedDate.getDate() / 7)}
          </Text>
        )}
      </View>
      
      <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navigationButton}>
        <ChevronRight size={24} color={Colors.light.neutral[600]} />
      </TouchableOpacity>
    </View>
  );

  const renderWeekView = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekContainer}>
      {getDates().map((date, index) => {
        const isSelected = date?.toDateString() === selectedDate.toDateString();
        const isToday = date?.toDateString() === new Date().toDateString();
        
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayItem,
              isSelected && styles.selectedDayItem,
              isToday && !isSelected && styles.todayItem,
            ]}
            onPress={() => handleDateSelect(date)}
          >
            <Text style={[styles.dayName, isSelected && styles.selectedDayText]}>
              {date?.toLocaleDateString('en-US', { weekday: 'short' })}
            </Text>
            <Text style={[styles.dayNumber, isSelected && styles.selectedDayText]}>
              {date?.getDate()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderMonthView = () => (
    <View style={styles.monthContainer}>
      <View style={styles.weekDayHeader}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.monthGrid}>
        {getDates().map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={styles.emptyDay} />;
          }
          
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.monthDayItem,
                isSelected && styles.selectedMonthDay,
                isToday && !isSelected && styles.todayMonthDay,
              ]}
              onPress={() => handleDateSelect(date)}
            >
              <Text style={[
                styles.monthDayText,
                isSelected && styles.selectedMonthDayText,
                isToday && !isSelected && styles.todayMonthDayText,
              ]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'week' && styles.activeToggle]}
            onPress={() => setViewMode('week')}
          >
            <Text style={[styles.toggleText, viewMode === 'week' && styles.activeToggleText]}>
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'month' && styles.activeToggle]}
            onPress={() => setViewMode('month')}
          >
            <Text style={[styles.toggleText, viewMode === 'month' && styles.activeToggleText]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderCalendarHeader()}
      
      <View style={styles.calendarContainer}>
        {viewMode === 'week' ? renderWeekView() : renderMonthView()}
      </View>

      <ScrollView style={styles.scheduleContainer}>
        <View style={styles.scheduleHeader}>
          <CalendarIcon size={20} color={Colors.light.primary[600]} />
          <Text style={styles.scheduleHeaderText}>
            Schedule for {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        {schedule.map((item) => (
          <View key={item.id} style={styles.scheduleItem}>
            <View style={styles.scheduleItemContent}>
              <View style={styles.scheduleItemHeader}>
                <Text style={styles.courseCode}>{item.courseCode}</Text>
                <Text style={styles.courseType}>
                  {item.type === 'lab' ? 'Lab' : 'Lecture'}
                </Text>
              </View>
              
              <Text style={styles.courseName}>{item.courseName}</Text>
              
              <View style={styles.scheduleItemDetails}>
                <View style={styles.detailItem}>
                  <Clock size={16} color={Colors.light.neutral[600]} />
                  <Text style={styles.detailText}>
                    {item.startTime} - {item.endTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
    marginBottom: 16,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary[700],
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: 'white',
  },
  toggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.primary[200],
    textAlign: 'center',
  },
  activeToggleText: {
    color: Colors.light.primary[700],
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral[200],
  },
  navigationButton: {
    padding: 8,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerMonth: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.light.neutral[900],
  },
  headerWeek: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.neutral[600],
    marginTop: 2,
  },
  calendarContainer: {
    backgroundColor: 'white',
  },
  weekContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dayItem: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: Colors.light.neutral[100],
  },
  selectedDayItem: {
    backgroundColor: Colors.light.primary[600],
  },
  todayItem: {
    backgroundColor: Colors.light.primary[50],
    borderWidth: 1,
    borderColor: Colors.light.primary[400],
  },
  dayName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.neutral[600],
    marginBottom: 4,
  },
  dayNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.light.neutral[900],
  },
  selectedDayText: {
    color: 'white',
  },
  monthContainer: {
    padding: 16,
  },
  weekDayHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.neutral[600],
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  monthDayItem: {
    width: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedMonthDay: {
    backgroundColor: Colors.light.primary[600],
    borderRadius: 8,
  },
  todayMonthDay: {
    backgroundColor: Colors.light.primary[50],
    borderWidth: 1,
    borderColor: Colors.light.primary[400],
    borderRadius: 8,
  },
  monthDayText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.neutral[900],
  },
  selectedMonthDayText: {
    color: 'white',
  },
  todayMonthDayText: {
    color: Colors.light.primary[700],
  },
  emptyDay: {
    width: '14.28%',
    height: 40,
    marginBottom: 8,
  },
  scheduleContainer: {
    flex: 1,
    padding: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleHeaderText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.light.neutral[900],
    marginLeft: 8,
  },
  scheduleItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleItemContent: {
    flex: 1,
    padding: 14,
  },
  scheduleItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  courseCode: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.light.primary[600],
  },
  courseType: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.light.neutral[600],
    backgroundColor: Colors.light.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  courseName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.neutral[900],
    marginBottom: 8,
  },
  scheduleItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.neutral[700],
    marginLeft: 8,
  },
});