import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, AsyncStorage } from 'react-native';
import { Focus } from './src/features/focus/focus';
import { FocusHistory } from './src/features/focus/focusHistory';
import { Timer } from './src/features/timer/Timer';
import { colors } from './src/utils/colors';
import { paddingSizes } from './src/utils/sizes';

export default function App() {
  const [focusSubject, setFocusSubject] = useState('Gardener');
  const [focusHistory, setFocusHistory] = useState([]);

  const saveFocusHistory = async () => {
    try {
      AsyncStorage.setItem('focusHistory', JSON.stringify(focusHistory));
    } catch (e) {
      console.log(e);
    }
  };

  const loadFocusHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('focusHistory');

      if (history && JSON.parse(history).length) {
        setFocusHistory(JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadFocusHistory();
  }, []);

  useEffect(() => {
    if (focusSubject) {
      setFocusHistory([...focusHistory, focusSubject]);
    }
  }, [focusSubject]);

  useEffect(() => {
    saveFocusHistory();
  }, [focusHistory]);

  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          subject={focusSubject}
          onTimerEnd={() => {
            setFocusHistory([
              ...focusHistory,
              { key: String(focusHistory.length + 1), subject: focusSubject, status: 1 },
            ]);
            setFocusSubject(null);
          }}
          clearSubject={() => {
            setFocusHistory([
              ...focusHistory,
              { key: String(focusHistory.length + 1), subject: focusSubject, status: 0 },
            ]);
            setFocusSubject(null);
          }}
        />
      ) : (
        <View style={styles.focusContainer}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory
            focusHistory={focusHistory}
            setFocusHistory={setFocusHistory}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBlue,
    paddingTop: Platform.OS === 'ios' ? paddingSizes.xxl : paddingSizes.sm,
  },
  focusContainer: { flex: 1, backgroundColor: '#252250' },
});
