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
  
  // Timer ref for progress updates
  const progressTimer = useRef<NodeJS.Timeout | null>(null);

  // Start progress timer when playing
  useEffect(() => {
    if (isPlaying) {
      progressTimer.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 1;
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
  }, [isPlaying, totalTime]);

  const togglePlayback = async (lecture: Lecture) => {
    if (currentLecture?.id === lecture.id) {
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
      setHighlightedLectureId(lecture.id);
      
      // Set the total time based on the lecture's duration and reset current time to 0
      const lectureTotalTime = durationToSeconds(lecture.duration);
      setTotalTime(lectureTotalTime);
      setCurrentTime(0);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav' },
        { shouldPlay: true, volume }
      );
      setSound(newSound);
      setIsPlaying(true);
    }
  };

  const handleLectureSelect = (lecture: Lecture) => {
    // Update both current lecture and highlighted lecture
    setCurrentLecture(lecture);
    setHighlightedLectureId(lecture.id);
    
    // Set the total time based on the lecture's duration and reset current time to 0
    const lectureTotalTime = durationToSeconds(lecture.duration);
    setTotalTime(lectureTotalTime);
    setCurrentTime(0);
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
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};