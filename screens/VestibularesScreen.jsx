import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BellImage from '../assets/sign.webp';
import { useThemeContext } from '../context/ThemeContext';

const TODAY = new Date();
const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

function getWeekDays() {
  const days = [];
  const dayOfWeek = TODAY.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  for (let i = 0; i < 7; i++) {
    const d = new Date(TODAY);
    d.setDate(TODAY.getDate() + mondayOffset + i);
    days.push(d);
  }
  return days;
}

const VESTIBULARES = [
  { id: '1', nome: 'Fatec',   dias: 68  },
  { id: '2', nome: 'Unicamp', dias: 98  },
  { id: '3', nome: 'Fuvest',  dias: 125 },
  { id: '4', nome: 'Enem',    dias: 190 },
];

const PT_MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];
const PT_DAYS = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];

export default function VestibularesScreen({ navigation }) {
  const theme = useThemeContext();
  const weekDays = getWeekDays();
  const [selectedDay, setSelectedDay] = useState(TODAY.getDate());
  const [vestibulares, setVestibulares] = useState(VESTIBULARES);
  const [notifEnabled, setNotifEnabled] = useState(false);

  const removeItem = (id) => {
    setVestibulares((prev) => prev.filter((v) => v.id !== id));
  };

  const dateLabel = `${PT_DAYS[TODAY.getDay()]}, ${TODAY.getDate()} de ${PT_MONTHS[TODAY.getMonth()]}, ${TODAY.getFullYear()}`;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={[styles.backBtn, { borderColor: theme.backBtnColor, backgroundColor: theme.backBtnBg }]}
          >
            <Ionicons name="chevron-back" size={20} color={theme.backBtnColor} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.pageTitle, { color: theme.titleColor }]}>Vestibulares</Text>
            <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>{dateLabel}</Text>
          </View>
        </View>

        {/* ── Calendário ── */}
        <View style={[styles.calendar, { backgroundColor: theme.surface }]}>
          {weekDays.map((d, i) => {
            const day = d.getDate();
            const isSelected = day === selectedDay;
            return (
              <TouchableOpacity
                key={i}
                style={styles.calDay}
                onPress={() => setSelectedDay(day)}
                activeOpacity={0.7}
              >
                <Text style={[styles.calDayLabel, { color: theme.textSecondary }]}>{WEEK_DAYS[i]}</Text>
                <View style={[styles.calDayCircle, isSelected && styles.calDayCircleActive]}>
                  <Text style={[styles.calDayNum, { color: theme.textPrimary }, isSelected && styles.calDayNumActive]}>
                    {day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Banner ── */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Definir um lembrete</Text>
            <Text style={styles.bannerDesc}>
              Não deixe o vestibular passar!{'\n'}
              Ative as notificações e fique por{'\n'}
              dentro das datas!
            </Text>
            <TouchableOpacity
              style={[styles.bannerBtn, { backgroundColor: theme.iconBg }]}
              onPress={() => setNotifEnabled(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.bannerBtnText}>Ativar</Text>
            </TouchableOpacity>
          </View>
          <Image source={BellImage} style={styles.bannerBell} resizeMode="contain" />
        </View>

        {/* ── Dias faltantes ── */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Dias faltantes</Text>
          <TouchableOpacity>
            <Text style={[styles.alterarText, { color: theme.textSecondary }]}>Alterar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {vestibulares.map((item) => (
            <View key={item.id} style={[styles.listItem, { backgroundColor: theme.cardBg }]}>
              <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                <Ionicons name="close-circle-outline" size={22} color={theme.textSecondary} />
              </TouchableOpacity>

              <View style={[styles.listIconBox, { backgroundColor: theme.isDarkMode ? '#2A2A2A' : '#FFF7ED' }]}>
                <Ionicons name="school" size={26} color="#F59E0B" />
              </View>

              <Text style={[styles.listName, { color: theme.textPrimary }]}>{item.nome}</Text>

              <View style={styles.listDaysBox}>
                <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.listDaysText, { color: theme.textSecondary }]}>{item.dias} dias</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 32, height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  dateLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  calDay: {
    alignItems: 'center',
    gap: 6,
  },
  calDayLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  calDayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayCircleActive: {
    backgroundColor: '#F59E0B',
  },
  calDayNum: {
    fontSize: 14,
    fontWeight: '600',
  },
  calDayNumActive: {
    color: '#FFFFFF',
  },
  banner: {
    backgroundColor: '#F59E0B',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    gap: 6,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  bannerBtn: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  bannerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  bannerBell: {
    width: 100,
    height: 100,
    marginLeft: 8,
    marginRight: -8,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  alterarText: {
    fontSize: 13,
  },
  list: { gap: 12 },
  listItem: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  removeBtn: {
    marginRight: -4,
  },
  listIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  listDaysBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listDaysText: {
    fontSize: 12,
    fontWeight: '500',
  },
});