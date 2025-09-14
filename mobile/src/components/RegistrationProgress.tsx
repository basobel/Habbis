import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RegistrationProgressProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

export default function RegistrationProgress({ 
  currentStep, 
  totalSteps, 
  stepNames 
}: RegistrationProgressProps) {
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.step,
              index < currentStep && styles.completedStep,
              index === currentStep - 1 && styles.currentStep,
            ]}
          />
        ))}
      </View>
      
      <View style={styles.stepInfo}>
        <Text style={styles.stepText}>
          Step {currentStep} of {totalSteps}
        </Text>
        <Text style={styles.stepName}>
          {stepNames[currentStep - 1]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  step: {
    flex: 1,
    height: 4,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  completedStep: {
    backgroundColor: '#22C55E',
  },
  currentStep: {
    backgroundColor: '#1E40AF',
  },
  stepInfo: {
    alignItems: 'center',
  },
  stepText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  stepName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});
