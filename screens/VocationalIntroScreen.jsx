import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../theme';
import { useThemeContext } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function VocationalIntroScreen({ navigation }) {
  const theme = useThemeContext();

  const imgAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.spring(imgAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.timing(textAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(btnAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>

      <TouchableOpacity
        style={[styles.backBtn, { borderColor: theme.backBtnColor, backgroundColor: theme.backBtnBg }]}
        onPress={() => navigation?.goBack()}
      >
        <Ionicons name="chevron-back" size={20} color={theme.backBtnColor} />
      </TouchableOpacity>

      <Animated.View style={[
        styles.imageWrapper,
        {
          opacity: imgAnim,
          transform: [{
            translateY: imgAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          }],
        },
      ]}>
        <Image
          source={require('../assets/vocational.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.bottom}>
        <Animated.Text style={[styles.title, { opacity: textAnim, color: theme.titleColor }]}>
          Escolha as opções que{'\n'}mais combinam com você.
        </Animated.Text>

        <Animated.View style={{ opacity: btnAnim, width: '60%' }}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation?.navigate('VocationalTest')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Iniciar Teste</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.85,
    height: height * 0.45,
  },
  bottom: {
    alignItems: 'center',
    gap: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  btn: {
    backgroundColor: '#FFA833',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#FFA833',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});