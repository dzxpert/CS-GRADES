import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Decoupled Static Curriculum Data import
import { INITIAL_GRADES_DATABASE } from './src/database/curriculum';

// Decoupled Reusable UI Component imports
import CurriculumSelector from './src/components/CurriculumSelector';
import SummaryCard from './src/components/SummaryCard';
import SubjectCard from './src/components/SubjectCard';
import CustomModuleModal from './src/components/CustomModuleModal';

export default function App() {
  // Navigation & Setup configuration states
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const [activeYear, setActiveYear] = useState('L1');
  const [activeSemester, setActiveSemester] = useState('S1');
  const [activeBranches, setActiveBranches] = useState({
    L3: 'ISIL',
    M1: 'SYM',
  });

  // Main active Grades state
  const [grades, setGrades] = useState(INITIAL_GRADES_DATABASE);

  // Custom Course insertion modal state
  const [modalVisible, setModalVisible] = useState(false);

  // Load saved grades, filters, and setup status on app boot
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedGrades = await AsyncStorage.getItem('@cs_tracker_grades_db');
        const savedBranches = await AsyncStorage.getItem('@cs_tracker_branches');
        const savedFilters = await AsyncStorage.getItem('@cs_tracker_filters');
        const savedSetupDone = await AsyncStorage.getItem('@cs_tracker_setup_done');

        if (savedGrades !== null) {
          setGrades(JSON.parse(savedGrades));
        }
        if (savedBranches !== null) {
          setActiveBranches(JSON.parse(savedBranches));
        }
        if (savedSetupDone === 'true') {
          setHasCompletedSetup(true);
        }
        if (savedFilters !== null) {
          const filters = JSON.parse(savedFilters);
          setActiveYear(filters.year || 'L1');
          setActiveSemester(filters.semester || 'S1');
        }
      } catch (error) {
        console.error('Failed to load saved tracker data.', error);
      }
    };
    loadSavedData();
  }, []);

  // AsyncStorage persistence helper
  const saveStateToStorage = async (updatedGrades, updatedBranches, updatedFilters, updatedSetupDone) => {
    try {
      if (updatedGrades) {
        await AsyncStorage.setItem('@cs_tracker_grades_db', JSON.stringify(updatedGrades));
      }
      if (updatedBranches) {
        await AsyncStorage.setItem('@cs_tracker_branches', JSON.stringify(updatedBranches));
      }
      if (updatedFilters) {
        await AsyncStorage.setItem('@cs_tracker_filters', JSON.stringify(updatedFilters));
      }
      if (updatedSetupDone !== undefined && updatedSetupDone !== null) {
        await AsyncStorage.setItem('@cs_tracker_setup_done', updatedSetupDone ? 'true' : 'false');
      }
    } catch (error) {
      console.error('Failed to persist academic data.', error);
    }
  };

  // Keep last page settings synchronized in storage
  useEffect(() => {
    if (hasCompletedSetup) {
      saveStateToStorage(null, null, { year: activeYear, semester: activeSemester }, null);
    }
  }, [activeYear, activeSemester, hasCompletedSetup]);

  // Master 2 inherits specialty from Master 1 choice
  const getActiveM2Branch = () => {
    return activeBranches.M1;
  };

  // Resolve active branches name for display
  const getActiveBranchName = () => {
    if (activeYear === 'L1') return 'Common Core';
    if (activeYear === 'L2') return 'Informatique';
    if (activeYear === 'L3') return activeBranches.L3;
    if (activeYear === 'M1') return activeBranches.M1;
    if (activeYear === 'M2') return `${getActiveM2Branch()} (From M1)`;
    return '';
  };

  // Retrieve active course list dynamically based on loaded selections
  const getActiveSubjects = () => {
    try {
      if (activeYear === 'L1') {
        return grades.L1[activeSemester] || [];
      }
      if (activeYear === 'L2') {
        return grades.L2.Informatique[activeSemester] || [];
      }
      if (activeYear === 'L3') {
        const branch = activeBranches.L3;
        return grades.L3[branch][activeSemester] || [];
      }
      if (activeYear === 'M1') {
        const branch = activeBranches.M1;
        return grades.M1[branch][activeSemester] || [];
      }
      if (activeYear === 'M2') {
        const branch = getActiveM2Branch();
        return grades.M2[branch][activeSemester] || [];
      }
    } catch (e) {
      console.log('Error resolving active subjects', e);
    }
    return [];
  };

  // Handle grade inputs reactively in nested state
  const handleGradeChange = (id, field, value) => {
    let sanitized = value.replace(/[^0-9.]/g, '');
    if ((sanitized.match(/\./g) || []).length > 1) return;

    const numericVal = parseFloat(sanitized);
    if (!isNaN(numericVal) && numericVal > 20) {
      sanitized = '20';
    }

    const updatedGrades = { ...grades };
    let listToUpdate = [];

    if (activeYear === 'L1') {
      listToUpdate = updatedGrades.L1[activeSemester];
    } else if (activeYear === 'L2') {
      listToUpdate = updatedGrades.L2.Informatique[activeSemester];
    } else if (activeYear === 'L3') {
      listToUpdate = updatedGrades.L3[activeBranches.L3][activeSemester];
    } else if (activeYear === 'M1') {
      listToUpdate = updatedGrades.M1[activeBranches.M1][activeSemester];
    } else if (activeYear === 'M2') {
      listToUpdate = updatedGrades.M2[getActiveM2Branch()][activeSemester];
    }

    const updatedList = listToUpdate.map((sub) => {
      if (sub.id === id) {
        return { ...sub, [field]: sanitized };
      }
      return sub;
    });

    if (activeYear === 'L1') {
      updatedGrades.L1[activeSemester] = updatedList;
    } else if (activeYear === 'L2') {
      updatedGrades.L2.Informatique[activeSemester] = updatedList;
    } else if (activeYear === 'L3') {
      updatedGrades.L3[activeBranches.L3][activeSemester] = updatedList;
    } else if (activeYear === 'M1') {
      updatedGrades.M1[activeBranches.M1][activeSemester] = updatedList;
    } else if (activeYear === 'M2') {
      updatedGrades.M2[getActiveM2Branch()][activeSemester] = updatedList;
    }

    setGrades(updatedGrades);
    saveStateToStorage(updatedGrades, null, null, null);
  };

  // Setup Switcher Action (preserves scores)
  const handleReconfigureCurriculum = () => {
    Alert.alert(
      'Curriculum Setup',
      'Would you like to change your Academic Year or Specialty? Your currently written grades will be fully preserved!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Configure',
          onPress: () => {
            setHasCompletedSetup(false);
          }
        }
      ]
    );
  };

  // Complete setup configuration inside selector screen
  const handleCompleteSetup = (year, branch) => {
    setActiveYear(year);
    
    let defaultSem = 'S1';
    if (year === 'L2') defaultSem = 'S3';
    else if (year === 'L3') defaultSem = 'S5';
    else if (year === 'M1') defaultSem = 'S1';
    else if (year === 'M2') defaultSem = 'S3';
    setActiveSemester(defaultSem);

    const updatedBranches = { ...activeBranches };
    if (year === 'L3') {
      updatedBranches.L3 = branch;
    } else if (year === 'M1') {
      updatedBranches.M1 = branch;
    } else if (year === 'M2') {
      updatedBranches.M1 = branch; // Mirror M2 to M1 selection
    }
    setActiveBranches(updatedBranches);

    setHasCompletedSetup(true);
    saveStateToStorage(null, updatedBranches, { year, semester: defaultSem }, true);
  };

  // Add custom subject from CustomModuleModal
  const handleAddSubject = (name, multiplier) => {
    const newSub = {
      id: Date.now().toString(),
      name,
      multiplier,
      td: '',
      exam: '',
    };

    const updatedGrades = { ...grades };

    if (activeYear === 'L1') {
      updatedGrades.L1[activeSemester] = [...updatedGrades.L1[activeSemester], newSub];
    } else if (activeYear === 'L2') {
      updatedGrades.L2.Informatique[activeSemester] = [...updatedGrades.L2.Informatique[activeSemester], newSub];
    } else if (activeYear === 'L3') {
      const branch = activeBranches.L3;
      updatedGrades.L3[branch][activeSemester] = [...updatedGrades.L3[branch][activeSemester], newSub];
    } else if (activeYear === 'M1') {
      const branch = activeBranches.M1;
      updatedGrades.M1[branch][activeSemester] = [...updatedGrades.M1[branch][activeSemester], newSub];
    } else if (activeYear === 'M2') {
      const branch = getActiveM2Branch();
      updatedGrades.M2[branch][activeSemester] = [...updatedGrades.M2[branch][activeSemester], newSub];
    }

    setGrades(updatedGrades);
    saveStateToStorage(updatedGrades, null, null, null);
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
            const updatedGrades = { ...grades };

            if (activeYear === 'L1') {
              updatedGrades.L1[activeSemester] = updatedGrades.L1[activeSemester].filter(sub => sub.id !== id);
            } else if (activeYear === 'L2') {
              updatedGrades.L2.Informatique[activeSemester] = updatedGrades.L2.Informatique[activeSemester].filter(sub => sub.id !== id);
            } else if (activeYear === 'L3') {
              const branch = activeBranches.L3;
              updatedGrades.L3[branch][activeSemester] = updatedGrades.L3[branch][activeSemester].filter(sub => sub.id !== id);
            } else if (activeYear === 'M1') {
              const branch = activeBranches.M1;
              updatedGrades.M1[branch][activeSemester] = updatedGrades.M1[branch][activeSemester].filter(sub => sub.id !== id);
            } else if (activeYear === 'M2') {
              const branch = getActiveM2Branch();
              updatedGrades.M2[branch][activeSemester] = updatedGrades.M2[branch][activeSemester].filter(sub => sub.id !== id);
            }

            setGrades(updatedGrades);
            saveStateToStorage(updatedGrades, null, null, null);
          },
        },
      ]
    );
  };

  // Reset active semester grades
  const handleResetActiveSemester = () => {
    Alert.alert(
      'Clear Semester Grades',
      'This will clear all grades in this active semester. All subjects will remain intact.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            const updatedGrades = { ...grades };
            const clearList = (list) => list.map(sub => ({ ...sub, td: '', exam: '' }));

            if (activeYear === 'L1') {
              updatedGrades.L1[activeSemester] = clearList(updatedGrades.L1[activeSemester]);
            } else if (activeYear === 'L2') {
              updatedGrades.L2.Informatique[activeSemester] = clearList(updatedGrades.L2.Informatique[activeSemester]);
            } else if (activeYear === 'L3') {
              const branch = activeBranches.L3;
              updatedGrades.L3[branch][activeSemester] = clearList(updatedGrades.L3[branch][activeSemester]);
            } else if (activeYear === 'M1') {
              const branch = activeBranches.M1;
              updatedGrades.M1[branch][activeSemester] = clearList(updatedGrades.M1[branch][activeSemester]);
            } else if (activeYear === 'M2') {
              const branch = getActiveM2Branch();
              updatedGrades.M2[branch][activeSemester] = clearList(updatedGrades.M2[branch][activeSemester]);
            }

            setGrades(updatedGrades);
            saveStateToStorage(updatedGrades, null, null, null);
          },
        },
      ]
    );
  };

  // Restore syllabus back to default preloaded layout
  const handleRestoreLayout = () => {
    Alert.alert(
      'Restore Syllabus Layout',
      'This will reset the modules of this active semester back to the official university curriculum and delete any custom subjects.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore Layout',
          style: 'destructive',
          onPress: () => {
            const updatedGrades = { ...grades };
            
            if (activeYear === 'L1') {
              updatedGrades.L1[activeSemester] = INITIAL_GRADES_DATABASE.L1[activeSemester];
            } else if (activeYear === 'L2') {
              updatedGrades.L2.Informatique[activeSemester] = INITIAL_GRADES_DATABASE.L2.Informatique[activeSemester];
            } else if (activeYear === 'L3') {
              const branch = activeBranches.L3;
              updatedGrades.L3[branch][activeSemester] = INITIAL_GRADES_DATABASE.L3[branch][activeSemester];
            } else if (activeYear === 'M1') {
              const branch = activeBranches.M1;
              updatedGrades.M1[branch][activeSemester] = INITIAL_GRADES_DATABASE.M1[branch][activeSemester];
            } else if (activeYear === 'M2') {
              const branch = getActiveM2Branch();
              updatedGrades.M2[branch][activeSemester] = INITIAL_GRADES_DATABASE.M2[branch][activeSemester];
            }

            setGrades(updatedGrades);
            saveStateToStorage(updatedGrades, null, null, null);
          },
        },
      ]
    );
  };

  // Academic GPAs calculation math
  const calculateSemesterAverage = (subjectsList) => {
    let totalPoints = 0;
    let totalMultipliers = 0;
    let gradedCount = 0;

    subjectsList.forEach((sub) => {
      const tdVal = parseFloat(sub.td);
      const examVal = parseFloat(sub.exam);
      
      const cleanTd = isNaN(tdVal) ? 0 : tdVal;
      const cleanExam = isNaN(examVal) ? 0 : examVal;
      const subAvg = (cleanTd + cleanExam) / 2;

      totalPoints += subAvg * sub.multiplier;
      totalMultipliers += sub.multiplier;
      
      if (!isNaN(tdVal) || !isNaN(examVal)) {
        gradedCount++;
      }
    });

    return {
      gpa: totalMultipliers > 0 ? totalPoints / totalMultipliers : 0,
      gradedCount,
      totalCoef: totalMultipliers
    };
  };

  const calculateYearAverage = () => {
    let sem1List = [];
    let sem2List = [];

    if (activeYear === 'L1') {
      sem1List = grades.L1.S1;
      sem2List = grades.L1.S2;
    } else if (activeYear === 'L2') {
      sem1List = grades.L2.Informatique.S3;
      sem2List = grades.L2.Informatique.S4;
    } else if (activeYear === 'L3') {
      sem1List = grades.L3[activeBranches.L3].S5;
      sem2List = grades.L3[activeBranches.L3].S6;
    } else if (activeYear === 'M1') {
      sem1List = grades.M1[activeBranches.M1].S1;
      sem2List = grades.M1[activeBranches.M1].S2;
    } else if (activeYear === 'M2') {
      sem1List = grades.M2[getActiveM2Branch()].S3;
      sem2List = grades.M2[getActiveM2Branch()].S4;
    }

    const res1 = calculateSemesterAverage(sem1List);
    const res2 = calculateSemesterAverage(sem2List);

    return (res1.gpa + res2.gpa) / 2;
  };

  const getYearTitle = () => {
    if (activeYear === 'L1') return 'Licence 1';
    if (activeYear === 'L2') return 'Licence 2';
    if (activeYear === 'L3') return 'Licence 3';
    if (activeYear === 'M1') return 'Master 1';
    if (activeYear === 'M2') return 'Master 2';
    return '';
  };

  const getSemesterLabels = () => {
    if (activeYear === 'L1') return { first: { key: 'S1', name: 'Semester 1' }, second: { key: 'S2', name: 'Semester 2' } };
    if (activeYear === 'L2') return { first: { key: 'S3', name: 'Semester 3' }, second: { key: 'S4', name: 'Semester 4' } };
    if (activeYear === 'L3') return { first: { key: 'S5', name: 'Semester 5' }, second: { key: 'S6', name: 'Semester 6' } };
    if (activeYear === 'M1') return { first: { key: 'S1', name: 'Semester 1' }, second: { key: 'S2', name: 'Semester 2' } };
    if (activeYear === 'M2') return { first: { key: 'S3', name: 'Semester 3' }, second: { key: 'S4', name: 'Semester 4' } };
    return { first: { key: 'S1', name: 'Semester 1' }, second: { key: 'S2', name: 'Semester 2' } };
  };

  // Academic statistics outputs
  const activeSubjects = getActiveSubjects();
  const semesterStats = calculateSemesterAverage(activeSubjects);
  const yearGPA = calculateYearAverage();
  const isPassing = semesterStats.gpa >= 10;
  const progressPercent = Math.min((semesterStats.gpa / 20) * 100, 100);

  const semLabels = getSemesterLabels();

  // ================= 1. RENDER MINIMALIST SETUP SELECTOR =================
  if (!hasCompletedSetup) {
    const activeM2Branch = getActiveM2Branch();
    const currentSetupBranch = activeYear === 'L3' ? activeBranches.L3 : activeYear === 'M2' ? activeM2Branch : activeBranches.M1;

    return (
      <CurriculumSelector
        initialYear={activeYear}
        initialBranch={currentSetupBranch}
        onComplete={handleCompleteSetup}
      />
    );
  }

  // ================= 2. RENDER FOCUS MAIN DASHBOARD =================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Sleek Header */}
        <View style={styles.header}>
          {/* Settings Curriculum Switcher */}
          <TouchableOpacity style={styles.settingsGearButton} onPress={handleReconfigureCurriculum}>
            <Ionicons name="options-outline" size={22} color="#0A84FF" />
          </TouchableOpacity>

          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerTitleFocused}>
              {getYearTitle()} {getActiveBranchName() !== 'Common Core' && getActiveBranchName() !== 'Informatique' ? `— ${getActiveBranchName()}` : ''}
            </Text>
            <Text style={styles.headerSubtitleFocused}>
              {getActiveBranchName() === 'Common Core' ? 'Common Core' : getActiveBranchName() === 'Informatique' ? 'Informatique' : 'Specialty Course'}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Semester Segment Bar */}
        <View style={styles.semesterSegmentContainerFocused}>
          <TouchableOpacity
            style={[styles.semesterSegment, activeSemester === semLabels.first.key && styles.semesterSegmentActive]}
            onPress={() => setActiveSemester(semLabels.first.key)}
          >
            <Text style={[styles.semesterSegmentText, activeSemester === semLabels.first.key && styles.semesterSegmentTextActive]}>
              {semLabels.first.name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.semesterSegment, activeSemester === semLabels.second.key && styles.semesterSegmentActive]}
            onPress={() => setActiveSemester(semLabels.second.key)}
          >
            <Text style={[styles.semesterSegmentText, activeSemester === semLabels.second.key && styles.semesterSegmentTextActive]}>
              {semLabels.second.name}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main scrollable list */}
        <ScrollView 
          contentContainerStyle={styles.scrollContainerFocused} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Modular Summary Card */}
          <SummaryCard
            semesterStats={semesterStats}
            yearGPA={yearGPA}
            isPassing={isPassing}
            progressPercent={progressPercent}
            activeSubjectsLength={activeSubjects.length}
          />

          {/* Syllabus Modules Title */}
          <Text style={styles.sectionTitle}>Course Modules</Text>

          {/* Dynamic Subject Cards List */}
          {activeSubjects.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="document-text-outline" size={38} color="#48484A" />
              <Text style={styles.emptyCardText}>No modules loaded for this placeholder.</Text>
            </View>
          ) : (
            activeSubjects.map((item) => (
              <SubjectCard
                key={item.id}
                item={item}
                onGradeChange={handleGradeChange}
                onDelete={handleDeleteSubject}
              />
            ))
          )}

          {/* Quick Actions Footer */}
          {activeSubjects.length > 0 && (
            <View style={styles.footerActions}>
              <TouchableOpacity style={styles.footerButtonOutline} onPress={handleResetActiveSemester}>
                <Ionicons name="refresh-outline" size={16} color="#AEAEB2" />
                <Text style={styles.footerButtonOutlineText}>Clear Scores</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.footerButtonOutline} onPress={handleRestoreLayout}>
                <Ionicons name="reload" size={14} color="#AEAEB2" />
                <Text style={styles.footerButtonOutlineText}>Restore Layout</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modular Custom Course Insertion Modal */}
      <CustomModuleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        activeSemester={activeSemester}
        onAddSubject={handleAddSubject}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // Main Header
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
  headerTitleFocused: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitleFocused: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0A84FF',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  settingsGearButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  // Semester segment selector
  semesterSegmentContainerFocused: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 3,
    marginTop: 15,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  semesterSegment: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 9,
  },
  semesterSegmentActive: {
    backgroundColor: '#2C2C2E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  semesterSegmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E8E93',
  },
  semesterSegmentTextActive: {
    color: '#FFFFFF',
  },

  scrollContainerFocused: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    paddingLeft: 2,
  },
  emptyCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    marginBottom: 15,
  },
  emptyCardText: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },

  // Reset actions footer
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  footerButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  footerButtonOutlineText: {
    color: '#AEAEB2',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
});
