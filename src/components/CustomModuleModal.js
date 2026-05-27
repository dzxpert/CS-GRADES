import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomModuleModal({ visible, onClose, activeSemester, onAddSubject }) {
  const [name, setName] = useState('');
  const [multiplier, setMultiplier] = useState('3');

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for the subject.');
      return;
    }

    const coef = parseInt(multiplier);
    if (isNaN(coef) || coef <= 0) {
      Alert.alert('Invalid Multiplier', 'Please enter a valid positive coefficient.');
      return;
    }

    onAddSubject(name.trim(), coef);
    
    // Reset local form states
    setName('');
    setMultiplier('3');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalKeyboardAvoiding}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Module to {activeSemester}</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
                <Ionicons name="close" size={22} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>SUBJECT MODULE NAME</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Graphic Computing"
                placeholderTextColor="#48484A"
                value={name}
                onChangeText={setName}
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
                value={multiplier}
                onChangeText={(val) => setMultiplier(val.replace(/[^0-9]/g, ''))}
              />
            </View>

            <TouchableOpacity style={styles.modalSubmitButton} onPress={handleSubmit}>
              <Text style={styles.modalSubmitButtonText}>Add New Module</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
