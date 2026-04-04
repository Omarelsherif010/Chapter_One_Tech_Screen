import { useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

/** Text input with Add button for creating new tasks */
export function TaskInput({ onAddTask }: TaskInputProps) {
  const { colors } = useTheme();
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
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.inputBorder },
        { transform: [{ translateX: shakeAnimation }] },
      ]}
    >
      <TextInput
        ref={inputRef}
        style={[styles.input, { color: colors.textPrimary }]}
        placeholder="Add a new task..."
        placeholderTextColor={colors.inputPlaceholder}
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: colors.primary },
          isInputEmpty && { backgroundColor: colors.border },
        ]}
        onPress={handleSubmit}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.addButtonText,
            { color: colors.surface },
            isInputEmpty && { color: colors.textSecondary },
          ]}
        >
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
    borderRadius: 12,
    borderWidth: 1,
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
    paddingVertical: 12,
  },
  addButton: {
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginLeft: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
