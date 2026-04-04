import { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { useTheme } from '@/contexts/ThemeContext';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/** A single task row with checkbox, text, swipe-to-delete, and delete button */
export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = () => (
    <TouchableOpacity
      style={[styles.deleteSwipeAction, { backgroundColor: colors.danger }]}
      onPress={() => {
        swipeableRef.current?.close();
        onDelete(task.id);
      }}
      activeOpacity={0.8}
    >
      <Text style={[styles.deleteSwipeText, { color: colors.surface }]}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
    >
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        {/* Checkbox */}
        <TouchableOpacity
          onPress={() => onToggle(task.id)}
          style={styles.checkboxTouchArea}
          activeOpacity={0.6}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
          accessibilityLabel={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: colors.border },
              task.completed && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
          >
            {task.completed && <Text style={[styles.checkmark, { color: colors.surface }]}>✓</Text>}
          </View>
        </TouchableOpacity>

        {/* Task Text */}
        <Text
          style={[
            styles.taskText,
            { color: colors.textPrimary },
            task.completed && { textDecorationLine: 'line-through', color: colors.textCompleted, opacity: 0.7 },
          ]}
        >
          {task.text}
        </Text>

        {/* Delete Icon Button */}
        <TouchableOpacity
          onPress={() => onDelete(task.id)}
          style={styles.deleteButton}
          activeOpacity={0.6}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={`Delete "${task.text}"`}
        >
          <Text style={[styles.deleteIcon, { color: colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  checkboxTouchArea: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '700',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 16,
  },
  deleteSwipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginLeft: 8,
  },
  deleteSwipeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
