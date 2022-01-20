import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Vibration } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useKeepAwake } from "expo-keep-awake";

import { colors } from '../../utils/colors';
import { paddingSizes } from '../../utils/sizes';
import { Countdown } from '../../components/Countdown';
import { RoundedButton } from '../../components/RoundedButton';
import { Timing } from './Timing';

export const Timer = ({ subject, clearSubject, onTimerEnd }) => {
  useKeepAwake();
  const [minutes, setMinutes] = useState(0.1);
  const [isStarted, setStarted] = useState(false);
  const [progress, setProgress] = useState(1);

  const onProgress = (p) => {
    setProgress(p / 100);
  };

  const onEnd = async () => {
    try {
      const interval = setInterval(() => Vibration.vibrate(5000), 1000);
      setTimeout(() => {
        clearInterval(interval);
      }, 10000);
    } catch (error) {
      console.log(error);
    }

    setProgress(1);
    setStarted(false);
    setMinutes(20);
    onTimerEnd();
  };

  const changeTime = (min) => () => {
    setProgress(1);
    setStarted(false);
    setMinutes(min);
  };

  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown
          minutes={minutes}
          isPaused={!isStarted}
          onProgress={onProgress}
          onEnd={onEnd}
        />
      </View>
      <View style={{ paddingTop: paddingSizes.xxl }}>
        <Text style={styles.title}>Focusing on:</Text>
        <Text style={styles.task}>{subject}</Text>
      </View>
      <View>
        <ProgressBar
          progress={progress}
          color="#5E84E2"
          style={{ height: 10 }}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Timing changeTime={changeTime} />
      </View>

      <View style={styles.buttonWrapper}>
        {!isStarted ? (
          <RoundedButton title="start" onPress={() => setStarted(true)} />
        ) : (
          <RoundedButton title="pause" onPress={() => setStarted(false)} />
        )}
      </View>
       <View style={styles.clearSubject}>
        <RoundedButton title="-" size={50} onPress={() => clearSubject()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: colors.white,
    textAlign: 'center',
  },
  task: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 15,
  },
  buttonWrapper: {
    flex: 0.5,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  countdown: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
