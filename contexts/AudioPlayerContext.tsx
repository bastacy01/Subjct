import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Audio } from 'expo-av';

interface Lecture {
  id: string;
  title: string;
  course: string;
  instructor: string;
  duration: string;
  date: string;
  description: string;
}

interface LectureProgress {
  [lectureKey: string]: number; // Store current time for each lecture (using course + id as key)
}

interface AudioPlayerContextType {
  currentLecture: Lecture | null;
  isPlaying: boolean;
  sound: Audio.Sound | null;
  volume: number;
  currentTime: number;
  totalTime: number;
  selectedLecture: Lecture | null;
  showLectureDetail: boolean;
  highlightedLectureId: string | null;
  lectureProgress: LectureProgress;
  setCurrentLecture: (lecture: Lecture | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setSound: (sound: Audio.Sound | null) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setTotalTime: (time: number) => void;
  setSelectedLecture: (lecture: Lecture | null) => void;
  setShowLectureDetail: (show: boolean) => void;
  setHighlightedLectureId: (id: string | null) => void;
  togglePlayback: (lecture: Lecture) => Promise<void>;
  handleLectureSelect: (lecture: Lecture) => void;
  handlePlayButtonPress: (lecture: Lecture) => void;
  handleMiniPlayerPress: () => void;
  handleVolumeChange: (newVolume: number) => Promise<void>;
  handleTimeChange: (newTime: number) => void;
  formatTime: (seconds: number) => string;
  getRemainingTime: (lecture: Lecture) => string;
  hasLectureStarted: (lecture: Lecture) => boolean;
  getLectureProgress: (lecture: Lecture) => number;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

interface AudioPlayerProviderProps {
  children: ReactNode;
}

// Helper function to convert duration string (e.g., "59:30") to seconds
const durationToSeconds = (duration: string): number => {
  const parts = duration.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return minutes * 60 + seconds;
  }
  return 0;
};

// Helper function to create a unique key for each lecture
const getLectureKey = (lecture: Lecture): string => {
  return `${lecture.course}-${lecture.id}`;
};

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [showLectureDetail, setShowLectureDetail] = useState(false);
  const [highlightedLectureId, setHighlightedLectureId] = useState<string | null>(null);
  const [lectureProgress, setLectureProgress] = useState<LectureProgress>({});
  
  // Timer ref for progress updates
  const progressTimer = useRef<NodeJS.Timeout | null>(null);

  // Start progress timer when playing
  useEffect(() => {
    if (isPlaying && currentLecture) {
      progressTimer.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 1;
          // Update the lecture progress using the unique key
          const lectureKey = getLectureKey(currentLecture);
          setLectureProgress(prev => ({
            ...prev,
            [lectureKey]: newTime
          }));
          
          // Stop at total time
          if (newTime >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return newTime;
        });
      }, 1000);
    } else {
      // Clear timer when paused
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
    }

    // Cleanup on unmount or when isPlaying changes
    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
    };
  }, [isPlaying, totalTime, currentLecture]);

  const togglePlayback = async (lecture: Lecture) => {
    const lectureKey = getLectureKey(lecture);
    const currentLectureKey = currentLecture ? getLectureKey(currentLecture) : null;
    
    if (currentLectureKey === lectureKey) {
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
      setHighlightedLectureId(lectureKey);
      
      // Set the total time based on the lecture's duration
      const lectureTotalTime = durationToSeconds(lecture.duration);
      setTotalTime(lectureTotalTime);
      
      // Get the saved progress for this lecture, or start from 0
      const savedProgress = lectureProgress[lectureKey] || 0;
      setCurrentTime(savedProgress);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav' },
        { shouldPlay: true, volume }
      );
      setSound(newSound);
      setIsPlaying(true);
    }
  };

  const handleLectureSelect = (lecture: Lecture) => {
    const lectureKey = getLectureKey(lecture);
    
    // Update both current lecture and highlighted lecture
    setCurrentLecture(lecture);
    setHighlightedLectureId(lectureKey);
    
    // Set the total time based on the lecture's duration
    const lectureTotalTime = durationToSeconds(lecture.duration);
    setTotalTime(lectureTotalTime);
    
    // Get the saved progress for this lecture, or start from 0
    const savedProgress = lectureProgress[lectureKey] || 0;
    setCurrentTime(savedProgress);
  };

  const handleMiniPlayerPress = () => {
    if (currentLecture) {
      setSelectedLecture(currentLecture);
      setShowLectureDetail(true);
    }
  };

  const handlePlayButtonPress = (lecture: Lecture) => {
    // When play button is pressed, both toggle playback and set as current
    togglePlayback(lecture);
    // Note: togglePlayback already sets currentLecture and highlightedLectureId
  };

  const handleVolumeChange = async (newVolume: number) => {
    setVolume(newVolume);
    if (sound) {
      await sound.setVolumeAsync(newVolume);
    }
  };

  const handleTimeChange = (newTime: number) => {
    setCurrentTime(newTime);
    // Update the lecture progress
    if (currentLecture) {
      const lectureKey = getLectureKey(currentLecture);
      setLectureProgress(prev => ({
        ...prev,
        [lectureKey]: newTime
      }));
    }
    // In a real app, you would seek to this position in the audio
    if (sound) {
      sound.setPositionAsync(newTime * 1000); // Convert to milliseconds
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const hasLectureStarted = (lecture: Lecture) => {
    const lectureKey = getLectureKey(lecture);
    return (lectureProgress[lectureKey] || 0) > 0;
  };

  const getLectureProgress = (lecture: Lecture) => {
    const totalSeconds = durationToSeconds(lecture.duration);
    const lectureKey = getLectureKey(lecture);
    const progressSeconds = lectureProgress[lectureKey] || 0;
    
    if (totalSeconds === 0) return 0;
    return Math.min(progressSeconds / totalSeconds, 1);
  };

  const getRemainingTime = (lecture: Lecture) => {
    const totalSeconds = durationToSeconds(lecture.duration);
    const lectureKey = getLectureKey(lecture);
    const progressSeconds = lectureProgress[lectureKey] || 0;
    
    // If lecture hasn't been started, return just the duration without any additional text
    if (progressSeconds === 0) {
      return lecture.duration;
    }
    
    const remainingSeconds = Math.max(0, totalSeconds - progressSeconds);
    
    if (remainingSeconds === 0) {
      return lecture.duration; // Show original duration if completed
    }
    
    const remainingMinutes = Math.ceil(remainingSeconds / 60);
    return `${remainingMinutes} min left`;
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
    };
  }, []);

  const value: AudioPlayerContextType = {
    currentLecture,
    isPlaying,
    sound,
    volume,
    currentTime,
    totalTime,
    selectedLecture,
    showLectureDetail,
    highlightedLectureId,
    lectureProgress,
    setCurrentLecture,
    setIsPlaying,
    setSound,
    setVolume,
    setCurrentTime,
    setTotalTime,
    setSelectedLecture,
    setShowLectureDetail,
    setHighlightedLectureId,
    togglePlayback,
    handleLectureSelect,
    handlePlayButtonPress,
    handleMiniPlayerPress,
    handleVolumeChange,
    handleTimeChange,
    formatTime,
    getRemainingTime,
    hasLectureStarted,
    getLectureProgress,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};