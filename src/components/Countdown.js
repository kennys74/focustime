import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../utils/colors';
import { paddingSizes, fontSizes } from '../utils/sizes';

const minutesToMilli = (min) => min * 1000 * 60;
const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const Countdown = ({ minutes = 20, isPaused, onProgress, onEnd }) => {
  const interval = React.useRef(null);
  const countDown = () => {
    setMillis((time) => {
      if (time === 0) {
        clearInterval(interval.current);
        return time;
      }
      const timeLeft = time - 1000;
      return timeLeft;
    });
  };

  useEffect(() => {
    setMillis(minutesToMilli(minutes));
  }, [minutes]);

  useEffect(() => {
    onProgress((millis / minutesToMilli(minutes)) * 100);
    if(millis === 0){
      onEnd();
    }
  }, [millis]);

  useEffect(() => {
    if (isPaused) {
      if (interval.current) clearInterval(interval.current);
      return;
    }
    interval.current = setInterval(countDown, 1000);
    return () => clearInterval(interval.current);
  }, [isPaused]);

  const [millis, setMillis] = useState(minutesToMilli(minutes));
  const minute = Math.floor(millis / 1000 / 60) % 60;
  const seconds = Math.floor(millis / 1000) % 60;
  return (
    <Text style={styles.text}>
      {formatTime(minute)}:{formatTime(seconds)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.white,
    padding: paddingSizes.lg,
    backgroundColor: 'rgba(94,136,226,0.3)',
  },
});
