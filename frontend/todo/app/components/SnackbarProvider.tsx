import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type SnackbarType = 'info' | 'success' | 'error';

export interface SnackbarOptions {
  message: string;
  type?: SnackbarType;
  duration?: number; // milliseconds
}

interface SnackbarContextValue {
  show: (options: SnackbarOptions | string) => void;
  hide: () => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

export const useSnackbar = (): SnackbarContextValue => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return ctx;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType>('info');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    translateY.setValue(40);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  };

  const animateOut = (cb?: () => void) => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 40, duration: 180, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => cb?.());
  };

  const hide = () => {
    if (!visible) return;
    animateOut(() => setVisible(false));
  };

  const show = (options: SnackbarOptions | string) => {
    const opts: SnackbarOptions = typeof options === 'string' ? { message: options } : options;
    if (timerRef.current) clearTimeout(timerRef.current);

    setMessage(opts.message);
    setType(opts.type ?? 'info');
    setVisible(true);
    animateIn();

    timerRef.current = setTimeout(() => {
      hide();
    }, opts.duration ?? 3000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const value = useMemo(() => ({ show, hide }), []);

  const bgColor = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#111827';

  return (
    <SnackbarContext.Provider value={value}>
      <View style={{ flex: 1 }}>{children}</View>
      {visible ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.container,
            {
              marginBottom: Math.max(insets.bottom, 12),
              backgroundColor: bgColor,
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <Text style={styles.text} numberOfLines={2}>
            {message}
          </Text>
          <Pressable onPress={hide} style={styles.action} android_ripple={{ color: 'rgba(255,255,255,0.25)' }}>
            <Text style={styles.actionText}>Dismiss</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </SnackbarContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  action: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
  },
});
