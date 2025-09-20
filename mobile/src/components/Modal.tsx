import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal as RNModal,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeFallback } from '@/hooks/useThemeFallback';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  animationType = 'slide',
  size = 'medium',
}: ModalProps) {
  const { getTextColor, getBackgroundColor, getBorderColor } = useThemeFallback();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getModalSize = () => {
    switch (size) {
      case 'small':
        return { width: screenWidth * 0.8, height: screenHeight * 0.4 };
      case 'large':
        return { width: screenWidth * 0.95, height: screenHeight * 0.8 };
      case 'fullscreen':
        return { width: screenWidth, height: screenHeight };
      default: // medium
        return { width: screenWidth * 0.9, height: screenHeight * 0.6 };
    }
  };

  const modalSize = getModalSize();

  useEffect(() => {
    if (visible) {
      if (animationType === 'slide') {
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (animationType === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } else {
      if (animationType === 'slide') {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (animationType === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [visible, animationType]);

  const getAnimatedStyle = () => {
    if (animationType === 'slide') {
      return {
        transform: [
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [modalSize.height, 0],
            }),
          },
        ],
      };
    } else if (animationType === 'fade') {
      return {
        opacity: fadeAnim,
      };
    }
    return {};
  };

  const renderContent = () => (
    <View style={[styles.modalContainer, { backgroundColor: getBackgroundColor('card') }]}>
      {title && (
        <View style={[styles.header, { borderBottomColor: getBorderColor('primary') }]}>
          <Text style={[styles.title, { color: getTextColor('primary') }]}>{title}</Text>
          {showCloseButton && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={getTextColor('primary')} />
            </TouchableOpacity>
          )}
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );

  if (animationType === 'none') {
    return (
      <RNModal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={[styles.modal, modalSize]}>{renderContent()}</View>
        </View>
      </RNModal>
    );
  }

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, modalSize, getAnimatedStyle()]}>
          {renderContent()}
        </Animated.View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
