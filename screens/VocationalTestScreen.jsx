import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
 
const { width } = Dimensions.get('window');
 
const QUESTIONS = [
  "Prefiro criar novas ideias do que seguir instruções prontas.",
  "Gosto de ajudar pessoas a resolver seus problemas.",
  "Sinto interesse em aprender sobre tecnologia e inovação.",
  "Prefiro trabalhar em equipe a trabalhar sozinho(a).",
  "Gosto de organizar tarefas, documentos ou informações.",
  "Tenho facilidade para explicar assuntos para outras pessoas.",
  "Sinto curiosidade sobre como as coisas funcionam.",
  "Prefiro atividades práticas a atividades teóricas.",
  "Gosto de analisar dados antes de tomar decisões.",
  "Tenho interesse por atividades artísticas e criativas.",
  "Sinto-me confortável ao liderar grupos ou projetos.",
  "Gosto de pesquisar e aprofundar meus conhecimentos.",
  "Prefiro desafios que exigem raciocínio lógico.",
  "Tenho interesse em atividades que impactam positivamente a sociedade.",
  "Sinto motivação ao aprender algo completamente novo.",
];
 
const OPTIONS = [
  { label: 'Concordo plenamente',   color: '#448236', value: 5 },
  { label: 'Concordo parcialmente', color: '#7BC142', value: 4 },
  { label: 'Concordo',              color: '#FFE900', value: 3, textColor: '#757575' },
  { label: 'Discordo parcialmente', color: '#F8962C', value: 2 },
  { label: 'Discordo plenamente',   color: '#F05435', value: 1 },
];
 
export default function VocationalTestScreen({ navigation }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
 
  const total = QUESTIONS.length;
  const progress = (current + 1) / total;
 
  const animateProgress = (val) => {
    Animated.timing(progressAnim, {
      toValue: val,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
 
  const handleSelect = (option) => {
    setSelected(option.value);
  };
 
  const handleNext = () => {
    if (selected === null) return;
 
    const newAnswers = { ...answers, [current]: selected };
    setAnswers(newAnswers);
    setSelected(null);
 
    if (current + 1 < total) {
      animateProgress((current + 2) / total);
      setCurrent(current + 1);
    } else {
      // Navega para resultado passando as respostas
      navigation?.navigate('VocationalResult', { answers: newAnswers });
    }
  };
 
  const handlePrev = () => {
    if (current === 0) return;
    setSelected(answers[current - 1] ?? null);
    animateProgress((current) / total);
    setCurrent(current - 1);
  };
 
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
 
  const isLast = current + 1 === total;
 
  return (
    <SafeAreaView style={styles.safe}>
 
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#5B21B6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teste Vocacional</Text>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
 
      {/* ── Barra de progresso ── */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>
 
      {/* ── Corpo ── */}
      <View style={styles.body}>
 
        {/* Pergunta */}
        <Text style={styles.question}>{QUESTIONS[current]}</Text>
 
        {/* Opções */}
        <View style={styles.options}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.optionBtn,
                { backgroundColor: opt.color },
                selected === opt.value && styles.optionSelected,
              ]}
              onPress={() => handleSelect(opt)}
              activeOpacity={0.85}
            >
              <Text style={[
                styles.optionText,
                { color: opt.textColor ?? '#FFFFFF' },
              ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
 
        {/* Reportar problema */}
        <TouchableOpacity>
          <Text style={styles.report}>Reportar problema</Text>
        </TouchableOpacity>
      </View>
 
      {/* ── Footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.verBtn, selected === null && styles.verBtnDisabled]}
          onPress={handleNext}
          activeOpacity={0.85}
          disabled={selected === null}
        >
          <Text style={styles.verBtnText}>
            {isLast ? 'Ver resultado' : 'Próxima'}
          </Text>
        </TouchableOpacity>
 
        <View style={styles.pagination}>
          <TouchableOpacity onPress={handlePrev} disabled={current === 0}>
            <Ionicons name="chevron-back" size={20} color={current === 0 ? '#ccc' : '#5B21B6'} />
          </TouchableOpacity>
          <Text style={styles.pageText}>{current + 1} / {total}</Text>
          <TouchableOpacity onPress={handleNext} disabled={selected === null}>
            <Ionicons name="chevron-forward" size={20} color={selected === null ? '#ccc' : '#5B21B6'} />
          </TouchableOpacity>
        </View>
      </View>
 
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
 
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#5B21B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1535',
  },
  closeBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#757575',
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  // Progresso
  progressTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F8962C',
    borderRadius: 3,
  },
 
  // Corpo
  body: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 12,
  },
  question: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5B21B6',
    lineHeight: 26,
    marginBottom: 8,
  },
  options: {
    gap: 10,
  },
  optionBtn: {
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionSelected: {
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  report: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
 
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  verBtn: {
    backgroundColor: '#5B21B6',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  verBtnDisabled: {
    opacity: 0.45,
  },
  verBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  pageText: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'center',
  },
});