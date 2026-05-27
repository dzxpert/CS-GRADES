import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function CurriculumSelector({ initialYear, initialBranch, onComplete }) {
  const [setupStep, setSetupStep] = useState(1);
  const [setupYear, setSetupYear] = useState(initialYear || 'L1');
  const [setupBranch, setSetupBranch] = useState(initialBranch || '');

  // Year Title Helper for step 2 sub-label
  const getYearTitle = (year) => {
    if (year === 'L1') return 'Licence 1';
    if (year === 'L2') return 'Licence 2';
    if (year === 'L3') return 'Licence 3';
    if (year === 'M1') return 'Master 1';
    if (year === 'M2') return 'Master 2';
    return '';
  };

  // Step 1: Click Year handler (UX: auto-advances to Step 2)
  const handleSelectYear = (year) => {
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

  const handleLaunch = () => {
    onComplete(setupYear, setupBranch);
  };

  return (
    <SafeAreaView style={styles.onboardingContainer}>
      <StatusBar style="light" />
      <View style={styles.onboardingHeader}>
        <Ionicons name="school-outline" size={56} color="#0A84FF" style={styles.onboardingLogo} />
        <Text style={styles.onboardingTitle}>CS Grades</Text>
        <Text style={styles.onboardingSubtitle}>Configure your university study curriculum</Text>
      </View>

      {/* Step 1: Select Year (Minimalist & Symmetrical) */}
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
                onPress={() => handleSelectYear(item.key)}
              >
                <Text style={[styles.cleanYearCardText, setupYear === item.key && styles.cleanYearCardTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Step 2: Select Specialty */}
      {setupStep === 2 && (
        <View style={styles.onboardingStepContainer}>
          <Text style={styles.stepTitle}>Select Your Specialty</Text>
          <Text style={styles.stepYearSub}>Selected: <Text style={styles.stepYearHighlight}>{getYearTitle(setupYear)}</Text></Text>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.onboardingScroll}>
            {/* L1 / L2 Unified Curriculum info */}
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

          {/* Setup Action Buttons */}
          <View style={styles.onboardingActions}>
            <TouchableOpacity style={styles.onboardingBackButton} onPress={() => setSetupStep(1)}>
              <Text style={styles.onboardingBackButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.onboardingLaunchButton} onPress={handleLaunch}>
              <Text style={styles.onboardingLaunchButtonText}>Launch Calculator</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  
  // Symmetrical Setup cards
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

  // Setup button actions
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
});
