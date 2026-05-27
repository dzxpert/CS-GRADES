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

// Complete preloaded default University curriculum structure (L1 - M2)
const INITIAL_GRADES_DATABASE = {
  L1: {
    S1: [
      { id: 'l1s1_1', name: 'Analysis 1', multiplier: 4, td: '', exam: '' },
      { id: 'l1s1_2', name: 'Algebra 1', multiplier: 3, td: '', exam: '' },
      { id: 'l1s1_3', name: 'Machine architecture 1', multiplier: 3, td: '', exam: '' },
      { id: 'l1s1_4', name: 'Algorithms and data structures 1', multiplier: 4, td: '', exam: '' },
      { id: 'l1s1_5', name: 'Scientific terminology & expression', multiplier: 1, td: '', exam: '' },
      { id: 'l1s1_6', name: 'Foreign language 1', multiplier: 1, td: '', exam: '' },
      { id: 'l1s1_7', name: 'Electronics & system components', multiplier: 2, td: '', exam: '' },
    ],
    S2: [
      { id: 'l1s2_1', name: 'Analysis 2', multiplier: 4, td: '', exam: '' },
      { id: 'l1s2_2', name: 'Algebra 2', multiplier: 2, td: '', exam: '' },
      { id: 'l1s2_3', name: 'Machine architecture 2', multiplier: 2, td: '', exam: '' },
      { id: 'l1s2_4', name: 'Algorithms and data structures 2', multiplier: 4, td: '', exam: '' },
      { id: 'l1s2_5', name: 'Info & comm technology', multiplier: 1, td: '', exam: '' },
      { id: 'l1s2_6', name: 'Probability & descriptive stats', multiplier: 2, td: '', exam: '' },
      { id: 'l1s2_7', name: 'Programming tools for math', multiplier: 1, td: '', exam: '' },
      { id: 'l1s2_8', name: 'Physics 2 (general electricity)', multiplier: 2, td: '', exam: '' },
    ]
  },
  L2: {
    Informatique: {
      S3: [
        { id: 'l2s3_1', name: 'Numerical methods', multiplier: 2, td: '', exam: '' },
        { id: 'l2s3_2', name: 'Mathematical logic', multiplier: 2, td: '', exam: '' },
        { id: 'l2s3_3', name: 'Computer engineering', multiplier: 3, td: '', exam: '' },
        { id: 'l2s3_4', name: 'Algorithms and data structures 3', multiplier: 3, td: '', exam: '' },
        { id: 'l2s3_5', name: 'Formal language theory', multiplier: 2, td: '', exam: '' },
        { id: 'l2s3_6', name: 'Information systems', multiplier: 3, td: '', exam: '' },
        { id: 'l2s3_7', name: 'Foreign language 2', multiplier: 1, td: '', exam: '' },
      ],
      S4: [
        { id: 'l2s4_1', name: 'Object-oriented programming', multiplier: 2, td: '', exam: '' },
        { id: 'l2s4_2', name: 'Web application development', multiplier: 2, td: '', exam: '' },
        { id: 'l2s4_3', name: 'Networks', multiplier: 3, td: '', exam: '' },
        { id: 'l2s4_4', name: 'Databases', multiplier: 3, td: '', exam: '' },
        { id: 'l2s4_5', name: 'Language theory', multiplier: 2, td: '', exam: '' },
        { id: 'l2s4_6', name: 'Operating systems 1', multiplier: 3, td: '', exam: '' },
        { id: 'l2s4_7', name: 'Foreign language 3', multiplier: 1, td: '', exam: '' },
      ]
    }
  },
  L3: {
    ISIL: {
      S5: [
        { id: 'l3s5_1', name: 'Software engineering', multiplier: 4, td: '', exam: '' },
        { id: 'l3s5_2', name: 'Human-machine interface', multiplier: 2, td: '', exam: '' },
        { id: 'l3s5_3', name: 'Digital economy & intelligence', multiplier: 1, td: '', exam: '' },
        { id: 'l3s5_4', name: 'Advanced web programming', multiplier: 2, td: '', exam: '' },
        { id: 'l3s5_5', name: 'Information systems management', multiplier: 2, td: '', exam: '' },
        { id: 'l3s5_6', name: 'Distributed information systems', multiplier: 4, td: '', exam: '' },
        { id: 'l3s5_7', name: 'Decision support systems', multiplier: 2, td: '', exam: '' },
      ],
      S6: [
        { id: 'l3s6_1', name: 'Computer research', multiplier: 3, td: '', exam: '' },
        { id: 'l3s6_2', name: 'Information security', multiplier: 3, td: '', exam: '' },
        { id: 'l3s6_3', name: 'Semi-structured data', multiplier: 3, td: '', exam: '' },
        { id: 'l3s6_4', name: 'Operating systems 2', multiplier: 3, td: '', exam: '' },
        { id: 'l3s6_5', name: 'Business intelligence', multiplier: 1, td: '', exam: '' },
        { id: 'l3s6_6', name: 'The project', multiplier: 3, td: '', exam: '' },
        { id: 'l3s6_7', name: 'Scientific writing', multiplier: 1, td: '', exam: '' },
      ]
    },
    SI: {
      S5: [
        { id: 'l3si_s5_1', name: 'SI Core Systems (Placeholder)', multiplier: 4, td: '', exam: '' },
        { id: 'l3si_s5_2', name: 'Advanced Mathematics (SI)', multiplier: 3, td: '', exam: '' },
        { id: 'l3si_s5_3', name: 'Logic & Computation (SI)', multiplier: 3, td: '', exam: '' },
        { id: 'l3si_s5_4', name: 'System Modeling (SI)', multiplier: 2, td: '', exam: '' },
      ],
      S6: [
        { id: 'l3si_s6_1', name: 'Theory of Systems (SI)', multiplier: 4, td: '', exam: '' },
        { id: 'l3si_s6_2', name: 'Cybernetic Automation (SI)', multiplier: 3, td: '', exam: '' },
        { id: 'l3si_s6_3', name: 'Degree Project (SI)', multiplier: 3, td: '', exam: '' },
        { id: 'l3si_s6_4', name: 'Technical Analysis (SI)', multiplier: 2, td: '', exam: '' },
      ]
    }
  },
  M1: {
    SYM: {
      S1: [
        { id: 'm1sym_s1_1', name: 'Interactive decision support systems', multiplier: 2, td: '', exam: '' },
        { id: 'm1sym_s1_2', name: 'Scientific English 1', multiplier: 1, td: '', exam: '' },
        { id: 'm1sym_s1_3', name: 'Software project management', multiplier: 2, td: '', exam: '' },
        { id: 'm1sym_s1_4', name: 'Signal processing', multiplier: 2, td: '', exam: '' },
        { id: 'm1sym_s1_5', name: 'Multimedia programming', multiplier: 2, td: '', exam: '' },
        { id: 'm1sym_s1_6', name: 'Methods for artificial intelligence', multiplier: 2, td: '', exam: '' },
        { id: 'm1sym_s1_7', name: 'Ethics and deontology', multiplier: 1, td: '', exam: '' },
        { id: 'm1sym_s1_8', name: 'Distributed systems & parallel arch', multiplier: 2, td: '', exam: '' },
        { id: 'm1sym_s1_9', name: 'Pervasive information systems', multiplier: 3, td: '', exam: '' },
      ],
      S2: [
        { id: 'm1sym_s2_1', name: 'Complexity and optimisation', multiplier: 2, td: '', exam: '' },
        { id: 'm1sym_s2_2', name: 'Scientific English 2', multiplier: 1, td: '', exam: '' },
        { id: 'm1sym_s2_3', name: 'Modelling & simulation of complex sys', multiplier: 2, td: '', exam: '' },
        { id: 'm1sym_s2_4', name: 'Image processing', multiplier: 2, td: '', exam: '' },
        { id: 'm1sym_s2_5', name: 'Multimedia databases', multiplier: 2, td: '', exam: '' },
        { id: 'm1sym_s2_6', name: 'Pattern recognition', multiplier: 2, td: '', exam: '' },
        { id: 'm1sym_s2_7', name: 'Corporate culture', multiplier: 1, td: '', exam: '' },
        { id: 'm1sym_s2_8', name: 'Big data and data mining', multiplier: 3, td: '', exam: '' },
        { id: 'm1sym_s2_9', name: 'Geographic info systems & apps', multiplier: 2, td: '', exam: '' },
      ]
    },
    RSI: {
      S1: [
        { id: 'm1rsi_s1_1', name: 'RSI Network Routing Protocols (PH)', multiplier: 3, td: '', exam: '' },
        { id: 'm1rsi_s1_2', name: 'Advanced Telecommunications (PH)', multiplier: 3, td: '', exam: '' },
        { id: 'm1rsi_s1_3', name: 'Cryptography & Data Security (PH)', multiplier: 3, td: '', exam: '' },
        { id: 'm1rsi_s1_4', name: 'Scientific English 1', multiplier: 1, td: '', exam: '' },
      ],
      S2: [
        { id: 'm1rsi_s2_1', name: 'Distributed Network Services (PH)', multiplier: 3, td: '', exam: '' },
        { id: 'm1rsi_s2_2', name: 'Mobile & Wireless Networks (PH)', multiplier: 3, td: '', exam: '' },
        { id: 'm1rsi_s2_3', name: 'Network Admin & Virtualization (PH)', multiplier: 3, td: '', exam: '' },
        { id: 'm1rsi_s2_4', name: 'Scientific English 2', multiplier: 1, td: '', exam: '' },
      ]
    },
    SI: {
      S1: [
        { id: 'm1si_s1_1', name: 'Advanced Software Architectures (PH)', multiplier: 3, td: '', exam: '' },
        { id: 'm1si_s1_2', name: 'Object Databases (SI-PH)', multiplier: 3, td: '', exam: '' },
        { id: 'm1si_s1_3', name: 'Scientific English 1', multiplier: 1, td: '', exam: '' },
      ],
      S2: [
        { id: 'm1si_s2_1', name: 'Distributed Databases (SI-PH)', multiplier: 3, td: '', exam: '' },
        { id: 'm1si_s2_2', name: 'Information Systems Audit (SI-PH)', multiplier: 3, td: '', exam: '' },
        { id: 'm1si_s2_3', name: 'Scientific English 2', multiplier: 1, td: '', exam: '' },
      ]
    }
  },
  M2: {
    SYM: {
      S3: [
        { id: 'm2sym_s3_1', name: 'Anti-corruption', multiplier: 1, td: '', exam: '' },
        { id: 'm2sym_s3_2', name: 'Wireless networks', multiplier: 2, td: '', exam: '' },
        { id: 'm2sym_s3_3', name: 'Marketing and cyber marketing', multiplier: 2, td: '', exam: '' },
        { id: 'm2sym_s3_4', name: 'Scientific research initiation methods', multiplier: 2, td: '', exam: '' },
        { id: 'm2sym_s3_5', name: 'Scientific English 3', multiplier: 1, td: '', exam: '' },
        { id: 'm2sym_s3_6', name: 'Multimedia and networks', multiplier: 3, td: '', exam: '' },
        { id: 'm2sym_s3_7', name: 'Multimedia quality and security', multiplier: 2, td: '', exam: '' },
        { id: 'm2sym_s3_8', name: 'Multimedia development tools', multiplier: 2, td: '', exam: '' },
        { id: 'm2sym_s3_9', name: 'Virtual reality and virtual humans', multiplier: 2, td: '', exam: '' },
      ],
      S4: [
        { id: 'm2sym_s4_1', name: 'Internship', multiplier: 10, td: '', exam: '' },
        { id: 'm2sym_s4_2', name: 'Project', multiplier: 10, td: '', exam: '' },
        { id: 'm2sym_s4_3', name: 'Seminar', multiplier: 10, td: '', exam: '' },
      ]
    },
    RSI: {
      S3: [
        { id: 'm2rsi_s3_1', name: 'Cloud Networks & SDN (PH)', multiplier: 3, td: '', exam: '' },
        { id: 'm2rsi_s3_2', name: 'Scientific English 3', multiplier: 1, td: '', exam: '' },
      ],
      S4: [
        { id: 'm2rsi_s4_1', name: 'Thesis / Internship (RSI-PH)', multiplier: 15, td: '', exam: '' },
        { id: 'm2rsi_s4_2', name: 'Project Defense (RSI-PH)', multiplier: 15, td: '', exam: '' },
      ]
    },
    SI: {
      S3: [
        { id: 'm2si_s3_1', name: 'Enterprise Resource Planning (SI-PH)', multiplier: 3, td: '', exam: '' },
        { id: 'm2si_s3_2', name: 'Scientific English 3', multiplier: 1, td: '', exam: '' },
      ],
      S4: [
        { id: 'm2si_s4_1', name: 'Thesis / Internship (SI-PH)', multiplier: 15, td: '', exam: '' },
        { id: 'm2si_s4_2', name: 'Project Defense (SI-PH)', multiplier: 15, td: '', exam: '' },
      ]
    }
  }
};

export default function App() {
  // Setup Wizard States (Replaced onboarding)
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const [setupStep, setSetupStep] = useState(1); // 1 = Select Year, 2 = Select Specialty
  const [setupYear, setSetupYear] = useState('L1');
  const [setupBranch, setSetupBranch] = useState('');

  // Main focused active states
  const [activeYear, setActiveYear] = useState('L1');
  const [activeSemester, setActiveSemester] = useState('S1');
  const [activeBranches, setActiveBranches] = useState({
    L3: 'ISIL',
    M1: 'SYM',
  });

  // Grades database state
  const [grades, setGrades] = useState(INITIAL_GRADES_DATABASE);

  // Modal Custom Course states
  const [modalVisible, setModalVisible] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectMultiplier, setNewSubjectMultiplier] = useState('3');

  // Load saved grades, filter settings, and Setup status on startup
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

  // Save state to AsyncStorage helper
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

  // Save last opened page/filters dynamically
  useEffect(() => {
    if (hasCompletedSetup) {
      saveStateToStorage(null, null, { year: activeYear, semester: activeSemester }, null);
    }
  }, [activeYear, activeSemester, hasCompletedSetup]);

  // M2 branch automatically mirrors M1 branch choice
  const getActiveM2Branch = () => {
    return activeBranches.M1;
  };

  // Helper: Get active branch name for display
  const getActiveBranchName = () => {
    if (activeYear === 'L1') return 'Common Core';
    if (activeYear === 'L2') return 'Informatique';
    if (activeYear === 'L3') return activeBranches.L3;
    if (activeYear === 'M1') return activeBranches.M1;
    if (activeYear === 'M2') return `${getActiveM2Branch()} (From M1)`;
    return '';
  };

  // Helper: retrieve active subjects array based on active filters
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

  // Handle grade inputs dynamically in nested structure
  const handleGradeChange = (id, field, value) => {
    let sanitized = value.replace(/[^0-9.]/g, '');
    if ((sanitized.match(/\./g) || []).length > 1) return;

    const numericVal = parseFloat(sanitized);
    if (!isNaN(numericVal) && numericVal > 20) {
      sanitized = '20';
    }

    const updatedGrades = { ...grades };

    // Locate active subjects list
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

    // Perform replacement
    const updatedList = listToUpdate.map((sub) => {
      if (sub.id === id) {
        return { ...sub, [field]: sanitized };
      }
      return sub;
    });

    // Write back to nested DB
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

  // Re-open Setup screen to change Year/Specialty (saves scores!)
  const handleReonboardSettings = () => {
    Alert.alert(
      'Curriculum Setup',
      'Would you like to change your Academic Year or Specialty? Your currently written grades will be fully preserved!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Configure',
          onPress: () => {
            setSetupStep(1);
            setSetupYear(activeYear);
            if (activeYear === 'L3') {
              setSetupBranch(activeBranches.L3);
            } else if (activeYear === 'M1') {
              setSetupBranch(activeBranches.M1);
            } else if (activeYear === 'M2') {
              setSetupBranch(getActiveM2Branch());
            } else {
              setSetupBranch('');
            }
            setHasCompletedSetup(false);
          }
        }
      ]
    );
  };

  // Complete curriculum configuration & enter main focused grades page
  const handleCompleteSetup = () => {
    setActiveYear(setupYear);
    
    // Set appropriate semester index
    let defaultSem = 'S1';
    if (setupYear === 'L2') defaultSem = 'S3';
    else if (setupYear === 'L3') defaultSem = 'S5';
    else if (setupYear === 'M1') defaultSem = 'S1';
    else if (setupYear === 'M2') defaultSem = 'S3';
    setActiveSemester(defaultSem);

    // Set branches
    const updatedBranches = { ...activeBranches };
    if (setupYear === 'L3' && setupBranch) {
      updatedBranches.L3 = setupBranch;
    } else if (setupYear === 'M1' && setupBranch) {
      updatedBranches.M1 = setupBranch;
    } else if (setupYear === 'M2' && setupBranch) {
      updatedBranches.M1 = setupBranch; // Sync M2 branch by locking it to M1's option
    }
    setActiveBranches(updatedBranches);

    setHasCompletedSetup(true);
    saveStateToStorage(null, updatedBranches, { year: setupYear, semester: defaultSem }, true);
  };

  // Selection Step 1 Year Click (UX: Smoothly auto-advances to Step 2)
  const handleSelectSetupYear = (year) => {
    setSetupYear(year);
    
    if (year === 'L1' || year === 'L2') {
      setSetupBranch('');
    } else if (year === 'L3') {
      setSetupBranch('ISIL');
    } else if (year === 'M1' || year === 'M2') {
      setSetupBranch('SYM');
    }

    setSetupStep(2);
  };

  // Add custom subject inside the active semester
  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for the subject.');
      return;
    }

    const coef = parseInt(newSubjectMultiplier);
    if (isNaN(coef) || coef <= 0) {
      Alert.alert('Invalid Multiplier', 'Please enter a valid positive coefficient.');
      return;
    }

    const newSub = {
      id: Date.now().toString(),
      name: newSubjectName.trim(),
      multiplier: coef,
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

  // Restore active curriculum layout back to default syllabus
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

  // Calculations
  const getSubjectAverage = (td, exam) => {
    const tdVal = parseFloat(td);
    const examVal = parseFloat(exam);
    if (isNaN(tdVal) && isNaN(examVal)) return null;

    const cleanTd = isNaN(tdVal) ? 0 : tdVal;
    const cleanExam = isNaN(examVal) ? 0 : examVal;
    return (cleanTd + cleanExam) / 2;
  };

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

  const activeSubjects = getActiveSubjects();
  const semesterStats = calculateSemesterAverage(activeSubjects);
  const yearGPA = calculateYearAverage();
  const isPassing = semesterStats.gpa >= 10;
  const progressPercent = Math.min((semesterStats.gpa / 20) * 100, 100);

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

  const semLabels = getSemesterLabels();

  // ================= 1. CURRICULUM SELECTOR ENTRY SCREEN =================
  if (!hasCompletedSetup) {
    return (
      <SafeAreaView style={styles.onboardingContainer}>
        <StatusBar style="light" />
        <View style={styles.onboardingHeader}>
          <Ionicons name="school-outline" size={56} color="#0A84FF" style={styles.onboardingLogo} />
          <Text style={styles.onboardingTitle}>CS Grades</Text>
          <Text style={styles.onboardingSubtitle}>Configure your university study curriculum</Text>
        </View>

        {/* Step 1: select Year (Minimalist & Symmetrical) */}
        {setupStep === 1 && (
          <View style={styles.onboardingStepContainer}>
            <Text style={styles.stepTitle}>Select Your Year</Text>
            
            <View style={styles.yearGrid}>
              {[
                { key: 'L1', label: 'Licence 1' },
                { key: 'L2', label: 'Licence 2' },
                { key: 'L3', label: 'Licence 3' },
                { key: 'M1', label: 'Master 1' },
                { key: 'M2', label: 'Master 2' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.cleanYearCard, setupYear === item.key && styles.cleanYearCardActive]}
                  onPress={() => handleSelectSetupYear(item.key)}
                >
                  <Text style={[styles.cleanYearCardText, setupYear === item.key && styles.cleanYearCardTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: select Specialty */}
        {setupStep === 2 && (
          <View style={styles.onboardingStepContainer}>
            <Text style={styles.stepTitle}>Select Your Specialty</Text>
            <Text style={styles.stepYearSub}>Selected: <Text style={styles.stepYearHighlight}>{getYearTitle()}</Text></Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.onboardingScroll}>
              {/* L1 / L2 Unified Curriculum */}
              {(setupYear === 'L1' || setupYear === 'L2') && (
                <View style={styles.onboardingUnifiedCard}>
                  <Ionicons name="sparkles-outline" size={38} color="#0A84FF" style={{ marginBottom: 12 }} />
                  <Text style={styles.unifiedTitle}>Unified Curriculum</Text>
                  <Text style={styles.unifiedText}>
                    Course modules and coefficients are fully standardized for this core year.
                  </Text>
                  <Text style={styles.unifiedSubText}>
                    {setupYear === 'L1' ? 'Common Core' : 'Informatique Branch'}
                  </Text>
                </View>
              )}

              {/* L3 Specialties */}
              {setupYear === 'L3' && (
                <View style={styles.choicesContainer}>
                  {[
                    { branch: 'ISIL', desc: 'Software Engineering & Information Systems' },
                    { branch: 'SI', desc: 'Systemes d\'Information (PH)' }
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.branch}
                      style={[styles.cleanChoiceCard, setupBranch === item.branch && styles.cleanChoiceCardActive]}
                      onPress={() => setSetupBranch(item.branch)}
                    >
                      <View style={styles.choiceHeaderRow}>
                        <Text style={[styles.choiceNameText, setupBranch === item.branch && styles.choiceNameTextActive]}>
                          {item.branch}
                        </Text>
                        {setupBranch === item.branch && <Ionicons name="checkmark-circle" size={18} color="#30D158" />}
                      </View>
                      <Text style={styles.choiceDescText}>{item.desc}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* M1 & M2 Specialties */}
              {(setupYear === 'M1' || setupYear === 'M2') && (
                <View style={styles.choicesContainer}>
                  {[
                    { branch: 'SYM', desc: 'Systemes et Multimedia (Preloaded)' },
                    { branch: 'RSI', desc: 'Reseaux et Systemes Informatiques (PH)' },
                    { branch: 'SI', desc: 'Systemes d\'Information (PH)' }
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.branch}
                      style={[styles.cleanChoiceCard, setupBranch === item.branch && styles.cleanChoiceCardActive]}
                      onPress={() => setSetupBranch(item.branch)}
                    >
                      <View style={styles.choiceHeaderRow}>
                        <Text style={[styles.choiceNameText, setupBranch === item.branch && styles.choiceNameTextActive]}>
                          {item.branch}
                        </Text>
                        {setupBranch === item.branch && <Ionicons name="checkmark-circle" size={18} color="#30D158" />}
                      </View>
                      <Text style={styles.choiceDescText}>{item.desc}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Bottom buttons */}
            <View style={styles.onboardingActions}>
              <TouchableOpacity style={styles.onboardingBackButton} onPress={() => setSetupStep(1)}>
                <Text style={styles.onboardingBackButtonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.onboardingLaunchButton} onPress={handleCompleteSetup}>
                <Text style={styles.onboardingLaunchButtonText}>Launch Calculator</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ================= 2. FOCUS MAIN DASHBOARD SCREEN (Year Switch Bar Removed!) =================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Sleek Focused Header */}
        <View style={styles.header}>
          {/* Switch settings gear */}
          <TouchableOpacity style={styles.settingsGearButton} onPress={handleReonboardSettings}>
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

        {/* Dynamic Semester Selection Segments */}
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

        {/* Scrollable Curriculum List */}
        <ScrollView 
          contentContainerStyle={styles.scrollContainerFocused} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Dashboard Summary Card */}
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
                <Text style={styles.statValue}>{semesterStats.gradedCount} / {activeSubjects.length}</Text>
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

          {/* Syllabus Modules Title */}
          <Text style={styles.sectionTitle}>Course Modules</Text>

          {/* Dynamic Subject Cards List */}
          {activeSubjects.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="document-text-outline" size={38} color="#48484A" />
              <Text style={styles.emptyCardText}>No modules loaded for this placeholder.</Text>
            </View>
          ) : (
            activeSubjects.map((item) => {
              const subjectAvg = getSubjectAverage(item.td, item.exam);
              const isSubPassing = subjectAvg !== null ? subjectAvg >= 10 : true;

              return (
                <View key={item.id} style={styles.subjectCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.subjectNameWrapper}>
                      <Text style={styles.subjectName} numberOfLines={2}>{item.name}</Text>
                      <View style={styles.multiplierBadge}>
                        <Text style={styles.multiplierText}>Coef {item.multiplier}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.deleteButton} 
                      onPress={() => handleDeleteSubject(item.id, item.name)}
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
                          onChangeText={(val) => handleGradeChange(item.id, 'td', val)}
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
                          onChangeText={(val) => handleGradeChange(item.id, 'exam', val)}
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
            })
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
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Custom Module</Text>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={22} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalInputLabel}>MODULE NAME</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="e.g. Image Analysis"
                  placeholderTextColor="#48484A"
                  value={newSubjectName}
                  onChangeText={setNewSubjectName}
                  autoFocus={true}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalInputLabel}>COEFFICIENT (MULTIPLIER)</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="e.g. 3"
                  placeholderTextColor="#48484A"
                  keyboardType="number-pad"
                  value={newSubjectMultiplier}
                  onChangeText={(val) => setNewSubjectMultiplier(val.replace(/[^0-9]/g, ''))}
                />
              </View>

              <TouchableOpacity style={styles.modalSubmitButton} onPress={handleAddSubject}>
                <Text style={styles.modalSubmitButtonText}>Add New Module</Text>
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
    backgroundColor: '#000000', // Symmetrical Pure Dark Theme
  },

  // Focused Main Header
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

  // Symmetrical Semester Control
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

  // ================= 1. Minimalist curriculum Setup Screens =================
  onboardingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  onboardingHeader: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 50 : 60,
    marginBottom: 10,
  },
  onboardingLogo: {
    marginBottom: 14,
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  onboardingTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  onboardingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  onboardingStepContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepYearSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepYearHighlight: {
    color: '#0A84FF',
    fontWeight: '800',
  },
  
  // Year selector grid (UX: Extremely clean and balanced!)
  yearGrid: {
    width: '100%',
    paddingHorizontal: 10,
  },
  cleanYearCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cleanYearCardActive: {
    borderColor: '#0A84FF',
    backgroundColor: 'rgba(10, 132, 255, 0.05)',
    shadowColor: '#0A84FF',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  cleanYearCardText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#AEAEB2',
  },
  cleanYearCardTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  onboardingScroll: {
    flex: 1,
    marginBottom: 16,
  },
  onboardingUnifiedCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginTop: 20,
  },
  unifiedTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  unifiedText: {
    fontSize: 13,
    color: '#AEAEB2',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  unifiedSubText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A84FF',
    textTransform: 'uppercase',
  },

  // Specialty choice cards (UX: Symmetrical and responsive)
  choicesContainer: {
    width: '100%',
    paddingHorizontal: 8,
  },
  cleanChoiceCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cleanChoiceCardActive: {
    borderColor: '#30D158',
    backgroundColor: 'rgba(48, 209, 88, 0.03)',
  },
  choiceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  choiceNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  choiceNameTextActive: {
    color: '#30D158',
  },
  choiceDescText: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
  },

  // Setup Actions
  onboardingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Platform.OS === 'ios' ? 24 : 16,
  },
  onboardingBackButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  onboardingBackButtonText: {
    color: '#AEAEB2',
    fontSize: 15,
    fontWeight: '700',
  },
  onboardingLaunchButton: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0A84FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  onboardingLaunchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // ================= MAIN SCREEN LAYOUT STYLES =================
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
  badgeSuccess: {
    backgroundColor: 'rgba(48, 209, 88, 0.08)',
    borderColor: 'rgba(48, 209, 88, 0.2)',
  },
  badgeDanger: {
    backgroundColor: 'rgba(255, 69, 58, 0.08)',
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  badgeMuted: {
    backgroundColor: 'rgba(142, 142, 147, 0.08)',
    borderColor: 'rgba(142, 142, 147, 0.15)',
  },
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    padding: 2,
  },
  modalInputGroup: {
    marginBottom: 16,
  },
  modalInputLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  modalTextInput: {
    backgroundColor: '#2C2C2E',
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  modalSubmitButton: {
    backgroundColor: '#0A84FF',
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  modalSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
