import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SummaryCard({
  semesterStats,
  yearGPA,
  isPassing,
  progressPercent,
  activeSubjectsLength,
}) {
  return (
    <View style={[styles.dashboardCard, isPassing ? styles.passedGlow : styles.failedGlow]}>
      <View style={styles.dashboardRow}>
        {/* Semester GPA */}
        <View style={{ flex: 1 }}>
          <Text style={styles.dashboardLabel}>SEMESTER GPA</Text>
          <View style={styles.gpaContainer}>
            <Text style={[styles.gpaText, isPassing ? styles.textSuccess : styles.textDanger]}>
              {semesterStats.gpa.toFixed(2)}
            </Text>
            <Text style={styles.gpaMax}>/20</Text>
          </View>
        </View>

        {/* Year GPA */}
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.dashboardLabel}>YEAR PROGRESS</Text>
          <View style={[styles.yearGpaBadge, yearGPA >= 10 ? styles.badgeSuccess : styles.badgeDanger]}>
            <Text style={[styles.yearGpaText, yearGPA >= 10 ? styles.textSuccess : styles.textDanger]}>
              Year GPA: {yearGPA.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }, isPassing ? styles.barSuccess : styles.barDanger]} />
      </View>

      {/* Dashboard Sub Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{semesterStats.gradedCount} / {activeSubjectsLength}</Text>
          <Text style={styles.statLabel}>Graded Modules</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{semesterStats.totalCoef}</Text>
          <Text style={styles.statLabel}>Total Coef</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <View style={[styles.smallStatusBadge, isPassing ? styles.badgeSuccess : styles.badgeDanger]}>
            <Text style={[styles.smallStatusBadgeText, isPassing ? styles.textSuccess : styles.textDanger]}>
              {isPassing ? 'PASS' : 'FAIL'}
            </Text>
          </View>
          <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dashboardCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
  },
  passedGlow: {
    borderColor: 'rgba(48, 209, 88, 0.2)',
  },
  failedGlow: {
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dashboardLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8E8E93',
    letterSpacing: 0.8,
  },
  gpaContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  gpaText: {
    fontSize: 38,
    fontWeight: '900',
  },
  gpaMax: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 2,
    fontWeight: '600',
  },
  yearGpaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearGpaText: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 5,
    backgroundColor: '#2C2C2E',
    borderRadius: 2.5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  barSuccess: {
    backgroundColor: '#30D158',
  },
  barDanger: {
    backgroundColor: '#FF453A',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    paddingTop: 12,
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 9,
    color: '#8E8E93',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: '#2C2C2E',
  },
  smallStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  smallStatusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  textSuccess: { color: '#30D158' },
  textDanger: { color: '#FF453A' },
  badgeSuccess: {
    backgroundColor: 'rgba(48, 209, 88, 0.08)',
    borderColor: 'rgba(48, 209, 88, 0.2)',
  },
  badgeDanger: {
    backgroundColor: 'rgba(255, 69, 58, 0.08)',
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
});
