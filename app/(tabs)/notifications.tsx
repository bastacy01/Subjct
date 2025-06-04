import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { Bell, Calendar, CircleCheck as CheckCircle, Clock, FileText, CircleAlert as AlertCircle, MoveVertical as MoreVertical } from 'lucide-react-native';

export default function NotificationsScreen() {
  // Mock notifications data
  const notifications = [
    {
      id: '1',
      type: 'assignment',
      title: 'New Assignment Posted',
      message: 'Physics Homework 3 has been posted.',
      course: 'PHYS 211',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'deadline',
      title: 'Upcoming Deadline',
      message: 'Essay Draft is due tomorrow at 11:59 PM.',
      course: 'ENGL 120',
      time: '5 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'grade',
      title: 'New Grade Posted',
      message: 'Your grade for Quiz 2 has been posted.',
      course: 'CS 101',
      time: '1 day ago',
      read: true,
    },
    {
      id: '4',
      type: 'announcement',
      title: 'Class Canceled',
      message: 'Tomorrow\'s lecture has been canceled due to professor illness.',
      course: 'MATH 241',
      time: '1 day ago',
      read: true,
    },
    {
      id: '5',
      type: 'assignment',
      title: 'Assignment Updated',
      message: 'The due date for Lab Report 2 has been extended.',
      course: 'PHYS 211',
      time: '2 days ago',
      read: true,
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <FileText size={20} color="white" />;
      case 'deadline':
        return <Clock size={20} color="white" />;
      case 'grade':
        return <CheckCircle size={20} color="white" />;
      case 'announcement':
        return <AlertCircle size={20} color="white" />;
      default:
        return <Bell size={20} color="white" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'assignment':
        return Colors.light.primary[600];
      case 'deadline':
        return Colors.light.warning[500];
      case 'grade':
        return Colors.light.success[500];
      case 'announcement':
        return Colors.light.error[500];
      default:
        return Colors.light.neutral[500];
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.read && styles.unreadItem
      ]}
    >
      <View 
        style={[
          styles.iconContainer,
          { backgroundColor: getNotificationColor(item.type) }
        ]}
      >
        {getNotificationIcon(item.type)}
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={18} color={Colors.light.neutral[500]} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.notificationMessage}>{item.message}</Text>
        
        <View style={styles.notificationFooter}>
          <Text style={styles.courseName}>{item.course}</Text>
          <Text style={styles.timeStamp}>{item.time}</Text>
        </View>
      </View>
      
      {!item.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
          <Text style={styles.filterTextActive}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Unread</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Assignments</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Grades</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.notificationsList}
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
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral[200],
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.primary[100],
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.neutral[700],
  },
  filterTextActive: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.primary[700],
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  unreadItem: {
    backgroundColor: Colors.light.primary[50],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.light.neutral[900],
    flex: 1,
  },
  moreButton: {
    padding: 4,
  },
  notificationMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.neutral[700],
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseName: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.light.primary[600],
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.light.primary[50],
    borderRadius: 4,
  },
  timeStamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.light.neutral[500],
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary[600],
  },
});