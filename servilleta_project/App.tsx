/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {StatusBar, StyleSheet, useColorScheme, View} from 'react-native';
import ListScreen from './src/screens/ListScreen';
import FormScreen from './src/screens/FormScreen';
import {initialAulas, Aula} from './src/data/aulas';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </>
  );
}

function AppContent() {
  const [aulas, setAulas] = useState<Aula[]>(initialAulas);
  const [editingAula, setEditingAula] = useState<Aula | null | undefined>(undefined);
  const saveAula = (draft: Omit<Aula, 'id'> & {id?: string}) => {
    if (draft.id) setAulas(current => current.map(a => a.id === draft.id ? (draft as Aula) : a));
    else setAulas(current => [{...draft, id: Date.now().toString()} as Aula, ...current]);
    setEditingAula(undefined);
  };
  return <View style={styles.container}>{editingAula === undefined ? <ListScreen aulas={aulas} onCreate={() => setEditingAula(null)} onEdit={setEditingAula} onDelete={id => setAulas(current => current.filter(a => a.id !== id))} /> : <FormScreen aula={editingAula} onBack={() => setEditingAula(undefined)} onSave={saveAula} />}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F7F9FC',
  },
});

export default App;
