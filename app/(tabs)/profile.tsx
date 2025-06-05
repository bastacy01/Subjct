import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { User, BookOpen, Settings, LogOut, Bell, CircleHelp as HelpCircle, ChevronRight, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  // Mock user data
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    studentId: '1234567',
    major: 'Computer Science',
    year: 'Junior',
    imageUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  };

  const handleLogout = () => {
    // In a real app, you would clear the auth state here
    router.replace('/onboarding/splash');
  };

  const menuItems = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: <User size={20} color={Colors.light.neutral[600]} />,
      action: () => console.log('Account settings'),
    },
    {
      id: 'academics',
      title: 'Academic Profile',
      icon: <BookOpen size={20} color={Colors.light.neutral[600]} />,
      action: () => console.log('Academic profile'),
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      icon: <Bell size={20} color={Colors.light.neutral[600]} />,
      action: () => console.log('Notification preferences'),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: <ShieldCheck size={20} color={Colors.light.neutral[600]} />,
      action: () => console.log('Privacy settings'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: <HelpCircle size={20} color={Colors.light.neutral[600]} />,
      action: () => console.log('Help and support'),
    },
    {
      id: 'settings',
      title: 'App Settings',
      icon: <Settings size={20} color={Colors.light.neutral[600]} />,
      action: () => console.log('App settings'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <View style={styles.profileSection}>
        <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
        
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Student ID</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{user.studentId}</Text>
              </View>
            </View>
            
            <View style={styles.detailDivider} />
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Major</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{user.major}</Text>
              </View>
            </View>
            
            <View style={styles.detailDivider} />
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Year</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{user.year}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.action}
          >
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.neutral[400]} />
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color={Colors.light.error[500]} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
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
  profileSection: {
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.light.primary[100],
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.light.neutral[900],
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.neutral[600],
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.light.neutral[200],
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.light.neutral[200],
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.neutral[500],
    marginBottom: 4,
  },
  detailValueContainer: {
    minHeight: 40,
    justifyContent: 'center',
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.neutral[900],
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: Colors.light.primary[50],
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary[300],
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.primary[600],
  },
  menuSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral[200],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.neutral[800],
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: Colors.light.neutral[100],
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.neutral[200],
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.error[500],
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.neutral[500],
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
});