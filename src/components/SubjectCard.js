import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SubjectCard({ item, onGradeChange, onDelete }) {
  // Self-calculate subject average inside the modular component
  const getSubjectAverage = (td, exam) => {
    const tdVal = parseFloat(td);
    const examVal = parseFloat(exam);
    if (isNaN(tdVal) && isNaN(examVal)) return null;

    const cleanTd = isNaN(tdVal) ? 0 : tdVal;
    const cleanExam = isNaN(examVal) ? 0 : examVal;
    return (cleanTd + cleanExam) / 2;
  };

  const subjectAvg = getSubjectAverage(item.td, item.exam);
  const isSubPassing = subjectAvg !== null ? subjectAvg >= 10 : true;

  return (
    <View style={styles.subjectCard}>
      <View style={styles.cardHeader}>
        <View style={styles.subjectNameWrapper}>
          <Text style={styles.subjectName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.multiplierBadge}>
            <Text style={styles.multiplierText}>Coef {item.multiplier}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => onDelete(item.id, item.name)}
        >
          <Ionicons name="trash-outline" size={15} color="#FF453A" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.inputsRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>TD</Text>
            <TextInput
              style={styles.gradeInput}
              placeholder="--"
              placeholderTextColor="#48484A"
              keyboardType="numeric"
              value={item.td}
              onChangeText={(val) => onGradeChange(item.id, 'td', val)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>EXAM</Text>
            <TextInput
              style={styles.gradeInput}
              placeholder="--"
              placeholderTextColor="#48484A"
              keyboardType="numeric"
              value={item.exam}
              onChangeText={(val) => onGradeChange(item.id, 'exam', val)}
            />
          </View>
        </View>

        {/* Calculated Average Display */}
        <View style={styles.cardAvgContainer}>
          <Text style={styles.inputLabel}>Avg</Text>
          <View style={[styles.avgBadge, subjectAvg !== null ? (isSubPassing ? styles.avgSuccess : styles.avgDanger) : styles.avgMuted]}>
            <Text style={[styles.avgText, subjectAvg !== null ? (isSubPassing ? styles.textSuccess : styles.textDanger) : styles.textMuted]}>
              {subjectAvg !== null ? subjectAvg.toFixed(2) : '--.--'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subjectCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  subjectNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 8,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 6,
  },
  multiplierBadge: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  multiplierText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#AEAEB2',
  },
  deleteButton: {
    padding: 2,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  inputsRow: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 15,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  gradeInput: {
    backgroundColor: '#2C2C2E',
    height: 36,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  cardAvgContainer: {
    alignItems: 'center',
  },
  avgBadge: {
    width: 55,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  avgSuccess: {
    backgroundColor: 'rgba(48, 209, 88, 0.08)',
    borderColor: 'rgba(48, 209, 88, 0.2)',
  },
  avgDanger: {
    backgroundColor: 'rgba(255, 69, 58, 0.08)',
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  avgMuted: {
    backgroundColor: 'rgba(142, 142, 147, 0.06)',
    borderColor: 'rgba(142, 142, 147, 0.12)',
  },
  avgText: {
    fontSize: 13,
    fontWeight: '700',
  },
  textSuccess: { color: '#30D158' },
  textDanger: { color: '#FF453A' },
  textMuted: { color: '#8E8E93' },
});
