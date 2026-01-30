import { useState, useCallback } from 'react';
import { STORAGE_KEY } from '../data/constants';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.map((item) => ({
      ...item,
      participants: Array.isArray(item.participants) ? item.participants : [],
      attendance: Array.isArray(item.attendance) ? item.attendance : [],
      exerciseDone:
        item.studyId === 'exercise' && item.exerciseDone && typeof item.exerciseDone === 'object'
          ? item.exerciseDone
          : {},
    }));
  } catch {
    return [];
  }
}

function saveToStorage(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useSchedules() {
  const [schedules, setSchedules] = useState(loadFromStorage);

  const persist = useCallback((next) => {
    setSchedules(next);
    saveToStorage(next);
  }, []);

  const add = useCallback((item) => {
    const newItem = {
      id: 'id-' + Date.now(),
      studyId: item.studyId,
      date: item.date,
      time: item.time || '',
      note: (item.note || '').trim(),
      participants: Array.isArray(item.participants) ? item.participants : [],
      attendance: [],
      exerciseDone: item.studyId === 'exercise' ? {} : undefined,
    };
    setSchedules((prev) => {
      const next = [...prev, newItem].sort((a, b) =>
        (a.date + (a.time || '')).localeCompare(b.date + (b.time || ''))
      );
      saveToStorage(next);
      return next;
    });
    return newItem;
  }, []);

  const remove = useCallback((id) => {
    setSchedules((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const filteredByMember = useCallback((memberName) => {
    if (!memberName) return schedules;
    return schedules.filter((s) => s.participants && s.participants.includes(memberName));
  }, [schedules]);

  const updateAttendance = useCallback((id, attendance) => {
    setSchedules((prev) => {
      const next = prev.map((s) =>
        s.id === id ? { ...s, attendance: Array.isArray(attendance) ? attendance : [] } : s
      );
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateExerciseDone = useCallback((id, memberName, types) => {
    setSchedules((prev) => {
      const next = prev.map((s) => {
        if (s.id !== id || s.studyId !== 'exercise') return s;
        const exerciseDone = { ...(s.exerciseDone || {}), [memberName]: Array.isArray(types) ? types : [] };
        return { ...s, exerciseDone };
      });
      saveToStorage(next);
      return next;
    });
  }, []);

  return { schedules, add, remove, filteredByMember, updateAttendance, updateExerciseDone };
}
