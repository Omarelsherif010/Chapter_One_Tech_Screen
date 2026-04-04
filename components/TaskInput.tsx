import { useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { Priority } from '@/types/task';

const PRIORITY_OPTIONS: { key: Priority; label: string; colorKey: 'priorityHigh' | 'priorityMedium' | 'priorityLow' }[] = [
  { key: 'high', label: 'H', colorKey: 'priorityHigh' },
  { key: 'medium', label: 'M', colorKey: 'priorityMedium' },
  { key: 'low', label: 'L', colorKey: 'priorityLow' },
];

interface TaskInputProps {
  onAddTask: (text: string, priority: Priority) => void;
}

/** Text input with priority selector and Add button for creating new tasks */
export function TaskInput({ onAddTask }: TaskInputProps) {
  const { colors } = useTheme();
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
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
    onAddTask(trimmed, priority);
    setInputText('');
    setPriority('medium');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.wrapper}>
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

      {/* Priority Selector */}
      <View style={styles.priorityRow}>
        <Text style={[styles.priorityLabel, { color: colors.textSecondary }]}>Priority:</Text>
        {PRIORITY_OPTIONS.map(({ key, label, colorKey }) => {
          const isSelected = priority === key;
          const pillColor = colors[colorKey];
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.priorityPill,
                { borderColor: pillColor },
                isSelected && { backgroundColor: pillColor },
              ]}
              onPress={() => setPriority(key)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${key} priority`}
            >
              <Text
                style={[
                  styles.priorityPillText,
                  { color: pillColor },
                  isSelected && { color: colors.surface },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
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
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  priorityLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 4,
  },
  priorityPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
