import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Default core Computer Science subjects
const DEFAULT_SUBJECTS = [
  { id: '1', name: 'Algorithms & Data Structures', multiplier: 4, td: '', exam: '' },
  { id: '2', name: 'Mathematical Analysis', multiplier: 3, td: '', exam: '' },
  { id: '3', name: 'Linear Algebra', multiplier: 3, td: '', exam: '' },
  { id: '4', name: 'Computer Architecture', multiplier: 3, td: '', exam: '' },
  { id: '5', name: 'Introduction to OOP', multiplier: 2, td: '', exam: '' },
  { id: '6', name: 'Technical English', multiplier: 1, td: '', exam: '' },
];

export default function App() {
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectMultiplier, setNewSubjectMultiplier] = useState('3');

  // Load saved grades on startup
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@cs_grades_state');
        if (savedData !== null) {
          setSubjects(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Failed to load saved grades.', error);
      }
    };
    loadSavedData();
  }, []);

  // Save grades whenever subjects state changes
  const saveGradesState = async (updatedSubjects) => {
    try {
      await AsyncStorage.setItem('@cs_grades_state', JSON.stringify(updatedSubjects));
    } catch (error) {
      console.error('Failed to save grades.', error);
    }
  };

  // Handle grade input change
  const handleGradeChange = (id, field, value) => {
    // Sanitize input to only allow numbers, dots, and empty string
    let sanitized = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimals
    if ((sanitized.match(/\./g) || []).length > 1) {
      return;
    }
    
    // Cap grades at 20
    const numericVal = parseFloat(sanitized);
    if (!isNaN(numericVal) && numericVal > 20) {
      sanitized = '20';
    }

    const updated = subjects.map((sub) => {
      if (sub.id === id) {
        return { ...sub, [field]: sanitized };
      }
      return sub;
    });

    setSubjects(updated);
    saveGradesState(updated);
  };

  // Add custom subject
  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for the subject.');
      return;
    }

    const coef = parseInt(newSubjectMultiplier);
    if (isNaN(coef) || coef <= 0) {
      Alert.alert('Invalid Multiplier', 'Please enter a valid positive multiplier (coefficient).');
      return;
    }

    const newSub = {
      id: Date.now().toString(),
      name: newSubjectName.trim(),
      multiplier: coef,
      td: '',
      exam: '',
    };

    const updated = [...subjects, newSub];
    setSubjects(updated);
    saveGradesState(updated);

    // Reset form & close modal
    setNewSubjectName('');
    setNewSubjectMultiplier('3');
    setModalVisible(false);
  };

  // Delete subject
  const handleDeleteSubject = (id, name) => {
    Alert.alert(
      'Remove Subject',
      `Are you sure you want to remove "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updated = subjects.filter((sub) => sub.id !== id);
            setSubjects(updated);
            saveGradesState(updated);
          },
        },
      ]
    );
  };

  // Clear all grades
  const handleResetAll = () => {
    Alert.alert(
      'Reset All Grades',
      'This will clear all entered grades. Your subjects list will remain.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const updated = subjects.map((sub) => ({ ...sub, td: '', exam: '' }));
            setSubjects(updated);
            saveGradesState(updated);
          },
        },
      ]
    );
  };

  // Restore default subject structure
  const handleRestoreDefaults = () => {
    Alert.alert(
      'Restore Defaults',
      'This will reset your subjects back to the original Computer Science curriculum and clear all scores.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: () => {
            setSubjects(DEFAULT_SUBJECTS);
            saveGradesState(DEFAULT_SUBJECTS);
          },
        },
      ]
    );
  };

  // Subject calculations
  const getSubjectAverage = (td, exam) => {
    const tdVal = parseFloat(td);
    const examVal = parseFloat(exam);
    if (isNaN(tdVal) && isNaN(examVal)) return null;
    
    // If one is empty, treat it as 0 for calculation
    const cleanTd = isNaN(tdVal) ? 0 : tdVal;
    const cleanExam = isNaN(examVal) ? 0 : examVal;
    return (cleanTd + cleanExam) / 2;
  };

  // Semester Calculations
  const totalMultipliers = subjects.reduce((sum, sub) => sum + sub.multiplier, 0);
  
  let totalWeightedScore = 0;
  let gradedSubjectsCount = 0;

  subjects.forEach((sub) => {
    const avg = getSubjectAverage(sub.td, sub.exam);
    if (avg !== null) {
      totalWeightedScore += avg * sub.multiplier;
      gradedSubjectsCount++;
    }
  });

  // Calculate Semester GPA
  // Note: if some subjects don't have grades yet, we calculate running GPA of graded subjects.
  // If no grades are entered at all, the GPA is 0.00.
  const semesterAverage = gradedSubjectsCount > 0 
    ? totalWeightedScore / subjects.reduce((sum, sub) => {
        const avg = getSubjectAverage(sub.td, sub.exam);
        return avg !== null ? sum + sub.multiplier : sum;
      }, 0)
    : 0;

  const isPassing = semesterAverage >= 10;
  const progressPercent = Math.min((semesterAverage / 20) * 100, 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>CS GRADE CALCULATOR</Text>
            <Text style={styles.headerTitle}>My Semester</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Semester Dashboard Card */}
          <View style={[styles.dashboardCard, isPassing && gradedSubjectsCount > 0 ? styles.passedGlow : gradedSubjectsCount > 0 ? styles.failedGlow : null]}>
            <View style={styles.dashboardRow}>
              <View>
                <Text style={styles.dashboardLabel}>SEMESTER AVERAGE</Text>
                <View style={styles.gpaContainer}>
                  <Text style={[styles.gpaText, gradedSubjectsCount > 0 ? (isPassing ? styles.textSuccess : styles.textDanger) : styles.textMuted]}>
                    {gradedSubjectsCount > 0 ? semesterAverage.toFixed(2) : '--.--'}
                  </Text>
                  <Text style={styles.gpaMax}>/20</Text>
                </View>
              </View>
              
              {/* Dynamic Status Badge */}
              <View style={[styles.statusBadge, gradedSubjectsCount > 0 ? (isPassing ? styles.badgeSuccess : styles.badgeDanger) : styles.badgeMuted]}>
                <Ionicons 
                  name={gradedSubjectsCount > 0 ? (isPassing ? "checkmark-circle" : "alert-circle") : "calculator"} 
                  size={16} 
                  color={gradedSubjectsCount > 0 ? (isPassing ? "#30D158" : "#FF453A") : "#8E8E93"} 
                />
                <Text style={[styles.statusText, gradedSubjectsCount > 0 ? (isPassing ? styles.textSuccess : styles.textDanger) : styles.textMuted]}>
                  {gradedSubjectsCount > 0 ? (isPassing ? 'PASSED' : 'REMEDIAL') : 'NO GRADES'}
                </Text>
              </View>
            </View>

            {/* Dynamic Progress Bar */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }, isPassing && gradedSubjectsCount > 0 ? styles.barSuccess : styles.barDanger]} />
            </View>

            {/* Sub-statistics Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{gradedSubjectsCount} / {subjects.length}</Text>
                <Text style={styles.statLabel}>Graded Subjects</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalMultipliers}</Text>
                <Text style={styles.statLabel}>Total Coef</Text>
              </View>
            </View>
          </View>

          {/* Subjects Section Title */}
          <Text style={styles.sectionTitle}>Course Subjects</Text>

          {/* Subjects List */}
          {subjects.map((item) => {
            const subjectAvg = getSubjectAverage(item.td, item.exam);
            const isSubPassing = subjectAvg !== null ? subjectAvg >= 10 : true;

            return (
              <View key={item.id} style={styles.subjectCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.subjectNameWrapper}>
                    <Text style={styles.subjectName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.multiplierBadge}>
                      <Text style={styles.multiplierText}>Coef {item.multiplier}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton} 
                    onPress={() => handleDeleteSubject(item.id, item.name)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF453A" />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardBody}>
                  {/* Inputs Row */}
                  <View style={styles.inputsRow}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>TD Grade</Text>
                      <TextInput
                        style={styles.gradeInput}
                        placeholder="--"
                        placeholderTextColor="#48484A"
                        keyboardType="numeric"
                        value={item.td}
                        onChangeText={(val) => handleGradeChange(item.id, 'td', val)}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>EXAM Grade</Text>
                      <TextInput
                        style={styles.gradeInput}
                        placeholder="--"
                        placeholderTextColor="#48484A"
                        keyboardType="numeric"
                        value={item.exam}
                        onChangeText={(val) => handleGradeChange(item.id, 'exam', val)}
                      />
                    </View>
                  </View>

                  {/* Calculated Average for the Card */}
                  <View style={styles.cardAvgContainer}>
                    <Text style={styles.inputLabel}>Average</Text>
                    <View style={[styles.avgBadge, subjectAvg !== null ? (isSubPassing ? styles.avgSuccess : styles.avgDanger) : styles.avgMuted]}>
                      <Text style={[styles.avgText, subjectAvg !== null ? (isSubPassing ? styles.textSuccess : styles.textDanger) : styles.textMuted]}>
                        {subjectAvg !== null ? subjectAvg.toFixed(2) : '--.--'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Quick Actions Footer */}
          <View style={styles.footerActions}>
            <TouchableOpacity style={styles.footerButtonOutline} onPress={handleResetAll}>
              <Ionicons name="refresh-outline" size={16} color="#AEAEB2" />
              <Text style={styles.footerButtonOutlineText}>Clear Grades</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerButtonOutline} onPress={handleRestoreDefaults}>
              <Ionicons name="reload" size={14} color="#AEAEB2" />
              <Text style={styles.footerButtonOutlineText}>Reset Layout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal - Add Custom Subject */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboardAvoiding}
          >
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Custom Subject</Text>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={22} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              {/* Subject Name Input */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalInputLabel}>SUBJECT NAME</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="e.g. Introduction to AI"
                  placeholderTextColor="#48484A"
                  value={newSubjectName}
                  onChangeText={setNewSubjectName}
                  autoFocus={true}
                />
              </View>

              {/* Coefficient / Multiplier Input */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalInputLabel}>MULTIPLIER (COEFFICIENT)</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="e.g. 3"
                  placeholderTextColor="#48484A"
                  keyboardType="number-pad"
                  value={newSubjectMultiplier}
                  onChangeText={(val) => setNewSubjectMultiplier(val.replace(/[^0-9]/g, ''))}
                />
              </View>

              {/* Modal Buttons */}
              <TouchableOpacity style={styles.modalSubmitButton} onPress={handleAddSubject}>
                <Text style={styles.modalSubmitButtonText}>Add Course Subject</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Apple system background (Black)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0A84FF', // System Blue
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  
  // Dashboard card styling (iOS glass style)
  dashboardCard: {
    backgroundColor: '#1C1C1E', // System Gray 6
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 25,
  },
  passedGlow: {
    borderColor: 'rgba(48, 209, 88, 0.25)', // Subtle green border glow
  },
  failedGlow: {
    borderColor: 'rgba(255, 69, 58, 0.25)', // Subtle red border glow
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dashboardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1,
  },
  gpaContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  gpaText: {
    fontSize: 42,
    fontWeight: '900',
  },
  gpaMax: {
    fontSize: 18,
    color: '#8E8E93',
    marginLeft: 2,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeSuccess: {
    backgroundColor: 'rgba(48, 209, 88, 0.1)',
    borderColor: 'rgba(48, 209, 88, 0.25)',
  },
  badgeDanger: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    borderColor: 'rgba(255, 69, 58, 0.25)',
  },
  badgeMuted: {
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    borderColor: 'rgba(142, 142, 147, 0.2)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
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
    paddingTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: '#2C2C2E',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15,
    paddingLeft: 4,
  },

  // Subject Card Styling
  subjectCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  subjectNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
    flexShrink: 1,
  },
  multiplierBadge: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  multiplierText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#AEAEB2',
  },
  deleteButton: {
    padding: 4,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  inputsRow: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 20,
  },
  inputContainer: {
    flex: 1,
    marginRight: 12,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gradeInput: {
    backgroundColor: '#2C2C2E',
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  cardAvgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avgBadge: {
    width: 65,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  avgSuccess: {
    backgroundColor: 'rgba(48, 209, 88, 0.1)',
    borderColor: 'rgba(48, 209, 88, 0.25)',
  },
  avgDanger: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    borderColor: 'rgba(255, 69, 58, 0.25)',
  },
  avgMuted: {
    backgroundColor: 'rgba(142, 142, 147, 0.08)',
    borderColor: 'rgba(142, 142, 147, 0.15)',
  },
  avgText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Color utilities
  textSuccess: { color: '#30D158' },
  textDanger: { color: '#FF453A' },
  textMuted: { color: '#8E8E93' },

  // Footer Actions
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  footerButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  footerButtonOutlineText: {
    color: '#AEAEB2',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Modal Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalKeyboardAvoiding: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 34,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalInputGroup: {
    marginBottom: 20,
  },
  modalInputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  modalTextInput: {
    backgroundColor: '#2C2C2E',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  modalSubmitButton: {
    backgroundColor: '#0A84FF',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
