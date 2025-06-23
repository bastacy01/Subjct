import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Keyboard,
  Platform,
  ViewStyle,
  TextStyle,
  FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  Easing
} from 'react-native-reanimated';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface DropdownItem {
  id: string;
  label: string;
  value: string;
}

interface SearchableDropdownProps {
  data: DropdownItem[];
  placeholder?: string;
  label?: string;
  onSelect: (item: DropdownItem) => void;
  selectedItem?: DropdownItem | null;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  maxHeight?: number;
  searchable?: boolean;
  autoFocus?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  data,
  placeholder = 'Search for university...',
  label,
  onSelect,
  selectedItem = null,
  containerStyle,
  inputStyle,
  maxHeight = 300,
  searchable = true,
  autoFocus = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  // Animation values
  const dropdownHeight = useSharedValue(0);
  const rotateAnimation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isOpen) {
      // Calculate the exact height needed based on filtered data
      const itemHeight = 48; // Height of each item
      const actualHeight = Math.min(filteredData.length * itemHeight, maxHeight);
      
      dropdownHeight.value = withTiming(actualHeight, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      rotateAnimation.value = withTiming(1, { duration: 300 });
    } else {
      dropdownHeight.value = withTiming(0, { duration: 300 });
      rotateAnimation.value = withTiming(0, { duration: 300 });
      setShowKeyboard(false);
      Keyboard.dismiss();
    }
  }, [isOpen, filteredData, maxHeight]);

  useEffect(() => {
    if (searchText) {
      const filtered = data.filter(item => 
        item.label.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchText, data]);

  useEffect(() => {
    if (!isOpen) {
      setSearchText('');
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    scale.value = withSpring(0.95, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowKeyboard(false);
    } else {
      Keyboard.dismiss();
      setShowKeyboard(false);
      setSearchText('');
    }
  };

  const handleInputPress = () => {
    if (isOpen) {
      setShowKeyboard(true);
      inputRef.current?.focus();
    }
  };

  const handleSelect = (item: DropdownItem) => {
    onSelect(item);
    setIsOpen(false);
    Keyboard.dismiss();
  };

  const clearSelection = () => {
    onSelect({ id: '', label: '', value: '' });
    setSearchText('');
  };

  const handleOutsidePress = () => {
    if (showKeyboard) {
      Keyboard.dismiss();
      setShowKeyboard(false);
    }
  };

  // Animated styles
  const dropdownAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: dropdownHeight.value,
      opacity: dropdownHeight.value === 0 ? 0 : 1,
      overflow: 'hidden',
    };
  });

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotateAnimation.value * 180}deg` }
      ],
    };
  });

  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        
        <Animated.View style={[scaleStyle]}>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={toggleDropdown} 
            style={[
              styles.dropdownButton,
              isOpen && styles.dropdownButtonOpen
            ]}
          >
            <View style={styles.searchIconContainer}>
              <Search size={20} color={Colors.light.neutral[500]} />
            </View>
            
            {searchable && isOpen ? (
              <TouchableOpacity 
                style={styles.inputContainer} 
                onPress={handleInputPress}
                activeOpacity={1}
              >
                <TextInput
                  ref={inputRef}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Search..."
                  style={[styles.input, inputStyle]}
                  autoCorrect={false}
                  onSubmitEditing={() => {
                    if (filteredData.length > 0) {
                      handleSelect(filteredData[0]);
                    }
                  }}
                />
              </TouchableOpacity>
            ) : (
              <Text 
                style={[
                  styles.selectedText,
                  !selectedItem?.label && styles.placeholderText
                ]}
              >
                {selectedItem?.label || placeholder}
              </Text>
            )}
            
            <View style={styles.iconContainer}>
              {selectedItem && !isOpen ? (
                <TouchableOpacity 
                  onPress={clearSelection} 
                  style={styles.clearButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={16} color={Colors.light.neutral[500]} />
                </TouchableOpacity>
              ) : null}
              {isOpen ? (
                <ChevronUp size={20} color={Colors.light.neutral[500]} />
              ) : (
                <ChevronDown size={20} color={Colors.light.neutral[500]} />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.dropdownWrapper}>
          <Animated.View style={[styles.dropdown, dropdownAnimatedStyle]}>
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    selectedItem?.id === item.id && styles.selectedItem,
                    // Remove border from last item to prevent extra spacing
                    index === filteredData.length - 1 && styles.lastItem
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text 
                    style={[
                      styles.itemText,
                      selectedItem?.id === item.id && styles.selectedItemText
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No results found</Text>
                </View>
              }
            />
          </Animated.View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 999,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
    color: Colors.light.neutral[700],
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.neutral[100],
    borderWidth: 1,
    borderColor: Colors.light.neutral[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 56,
  },
  dropdownButtonOpen: {
    borderColor: Colors.light.primary[400],
    backgroundColor: Colors.light.neutral[50],
  },
  searchIconContainer: {
    marginRight: 12,
  },
  inputContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  selectedText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.neutral[900],
  },
  placeholderText: {
    color: Colors.light.neutral[500],
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    marginRight: 4,
  },
  dropdownWrapper: {
    marginTop: 4,
  },
  dropdown: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.light.neutral[300],
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  flatListContent: {
    flexGrow: 1,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral[200],
    minHeight: 48,
    justifyContent: 'center',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  selectedItem: {
    backgroundColor: Colors.light.primary[50],
  },
  itemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.neutral[800],
  },
  selectedItemText: {
    fontFamily: 'Inter-Medium',
    color: Colors.light.primary[600],
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.neutral[900],
    padding: 0,
    margin: 0,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    color: Colors.light.neutral[500],
    fontSize: 14,
  },
});

export default SearchableDropdown;