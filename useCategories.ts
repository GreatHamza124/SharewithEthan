// hooks/useCategories.ts
// hooks/useCategories.ts

import { useEffect, useState } from 'react';
import { ExpenseCategory, Expense } from '@/src/types';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { auth } from '../app/fireconfig'; // Adjust this path based on your setup
//import username  from '../app/(tabs)/Signup';

const COLOR_PALETTE = [
  '#FF6B6B', '#48D1CC', '#76C75F', '#FFA500',
  '#9370DB', '#FFD700', '#1E90FF', '#FF69B4'
];

const getRandomColor = () => {
  return COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
};

export default function useCategories() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const categoriesRef = collection(db, 'usernames', user.uid, 'categories');

    const unsubscribe = onSnapshot(categoriesRef, (snapshot) => {
      const data: ExpenseCategory[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ExpenseCategory[];
      setCategories(data);
    });

    return () => unsubscribe();
  }, [user]);

  const addCategory = async (category: Omit<ExpenseCategory, 'id' | 'expenses'>) => {
    if (!user) return;

    const categoriesRef = collection(db, 'usernames', user.uid, 'categories');
    await addDoc(categoriesRef, {
      ...category,
      color: category.color || getRandomColor(),
      expenses: []
    });
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;

    const categoryRef = doc(db, 'usernames', user.uid, 'categories', id);
    await deleteDoc(categoryRef);
  };

  const updateCategory = async (id: string, updates: Partial<Omit<ExpenseCategory, 'id'>>) => {
    if (!user) return;

    const categoryRef = doc(db, 'usernames', user.uid, 'categories', id);
    await updateDoc(categoryRef, updates);
  };

  const addExpense = async (categoryId: string, expense: Omit<Expense, 'id'>) => {
    if (!user) return;

    const categoryRef = doc(db, 'usernames', user.uid, 'categories', categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      date: expense.date || new Date().toISOString()
    };

    await updateDoc(categoryRef, {
      expenses: [...(category.expenses || []), newExpense]
    });
  };

  const deleteExpense = async (categoryId: string, expenseId: string) => {
    if (!user) return;

    const categoryRef = doc(db, 'usernames', user.uid, 'categories', categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const updatedExpenses = category.expenses.filter(exp => exp.id !== expenseId);
    await updateDoc(categoryRef, { expenses: updatedExpenses });
  };

  return {
    categories,
    addCategory,
    deleteCategory,
    updateCategory,
    addExpense,
    deleteExpense
  };
}

/*import { useState } from 'react';
import { ExpenseCategory, Expense } from '@/src/types';

const COLOR_PALETTE = [
    '#FF6B6B', // red
    '#48D1CC', // teal
    '#76C75F', // green
    '#FFA500', // orange
    '#9370DB', // purple
    '#FFD700', // gold
    '#1E90FF', // dodgerblue
    '#FF69B4'  // hotpink
];

const getRandomColor = () => {
    return COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
};

export default function useCategories() {
    const [categories, setCategories] = useState<ExpenseCategory[]>([
    
        {
            id: '1',
            name: 'Food',
            icon: 'fast-food',
            color: '#FF6B6B',
            expenses: []
        },
        {
            id: '2',
            name: 'Transport',
            icon: 'car',
            color: '#48D1CC',
            expenses: []
        }
    ]);

    const addCategory = (category: Omit<ExpenseCategory, 'id' | 'expenses'>) => {
        setCategories(prev => [...prev, {
            ...category,
            id: Date.now().toString(),
            expenses: [],
            color: category.color || getRandomColor() // Fallback to random color
        }]);
    };

    const deleteCategory = (id: string) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));
    };

    const updateCategory = (id: string, updates: Partial<Omit<ExpenseCategory, 'id'>>) => {
        setCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, ...updates } : cat
        ));
    };

    const addExpense = (categoryId: string, expense: Omit<Expense, 'id'>) => {
        setCategories(prev => prev.map(cat =>
            cat.id === categoryId
                ? {
                    ...cat,
                    expenses: [
                        ...cat.expenses,
                        {
                            ...expense,
                            id: Date.now().toString(),
                            date: expense.date || new Date().toISOString()
                        }
                    ]
                }
                : cat
        ));
    };

    const deleteExpense = (categoryId: string, expenseId: string) => {
        setCategories(prev => prev.map(cat =>
            cat.id === categoryId
                ? {
                    ...cat,
                    expenses: cat.expenses.filter(exp => exp.id !== expenseId)
                }
                : cat
        ));
    };

    return {
        categories,
        addCategory,
        deleteCategory,
        updateCategory,
        addExpense,
        deleteExpense
    };
}*/