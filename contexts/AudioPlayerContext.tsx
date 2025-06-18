import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(615); // 10:15 in seconds
  const [totalTime, setTotalTime] = useState(3027); // 50:27 in seconds
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [showLectureDetail, setShowLectureDetail] = useState(false);
  const [highlightedLectureId, setHighlightedLectureId] = useState<string | null>(null);

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
    setCurrentLecture(lecture);
    setHighlightedLectureId(lecture.id);
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