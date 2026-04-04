import { useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { Colors } from '@/constants/Colors';

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

/** Text input with Add button for creating new tasks */
export function TaskInput({ onAddTask }: TaskInputProps) {
  const [inputText, setInputText] = useState('');
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const isInputEmpty = inputText.trim().length === 0;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      triggerShake();
      return;
    }
    onAddTask(trimmed);
    setInputText('');
    Keyboard.dismiss();
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: shakeAnimation }] }]}
    >
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Add a new task..."
        placeholderTextColor={Colors.inputPlaceholder}
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <TouchableOpacity
        style={[styles.addButton, isInputEmpty && styles.addButtonDisabled]}
        onPress={handleSubmit}
        activeOpacity={0.7}
      >
        <Text style={[styles.addButtonText, isInputEmpty && styles.addButtonTextDisabled]}>
          Add
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 12,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginLeft: 8,
  },
  addButtonDisabled: {
    backgroundColor: Colors.border,
  },
  addButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonTextDisabled: {
    color: Colors.textSecondary,
  },
});
