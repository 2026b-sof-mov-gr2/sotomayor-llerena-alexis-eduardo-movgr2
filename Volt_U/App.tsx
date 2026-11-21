/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import ListScreen from './src/screens/ListScreen';
import FormScreen from './src/screens/FormScreen';
import PortMapScreen from './src/screens/PortMapScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import CampusMapScreen from './src/screens/CampusMapScreen';
import {initialAulas, Aula, statusFromPorts} from './src/data/aulas';

function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <AppContent />
    </>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [aulas, setAulas] = useState<Aula[]>(initialAulas);
  const [editingAula, setEditingAula] = useState<Aula | null | undefined>(undefined);
  const [portMapAula, setPortMapAula] = useState<Aula | null>(null);
  const [campusMapOpen, setCampusMapOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const saveAula = (draft: Omit<Aula, 'id'> & {id?: string}) => {
    if (draft.id) {
      setAulas(current => current.map(point => point.id === draft.id ? (draft as Aula) : point));
      setNotice('Estado actualizado');
    } else {
      setAulas(current => [{...draft, id: Date.now().toString()} as Aula, ...current]);
      setNotice('Punto registrado');
    }
    setEditingAula(undefined);
  };
  const deleteAula = (id: string) => {
    setAulas(current => current.filter(point => point.id !== id));
    setNotice('Reporte eliminado');
  };
  const updatePorts = (id: string, ports: Aula['ports']) => {
    setAulas(current => current.map(point => point.id === id ? {...point, ports, status: statusFromPorts(ports), updatedAt: 'Ahora'} : point));
    setPortMapAula(current => current?.id === id ? {...current, ports, status: statusFromPorts(ports), updatedAt: 'Ahora'} : current);
  };
  const openPortMap = (aula: Aula) => { setCampusMapOpen(false); setPortMapAula(aula); };

  return <View style={styles.container}>{isLoading ? <LoadingScreen onComplete={() => setIsLoading(false)} /> : campusMapOpen ? <CampusMapScreen aulas={aulas} onBack={() => setCampusMapOpen(false)} onOpenPorts={openPortMap} /> : portMapAula ? <PortMapScreen aula={portMapAula} onBack={() => setPortMapAula(null)} onUpdatePorts={updatePorts} /> : editingAula === undefined ? <ListScreen aulas={aulas} notice={notice} onNoticeShown={() => setNotice('')} onCreate={() => setEditingAula(null)} onEdit={setEditingAula} onCampusMap={() => setCampusMapOpen(true)} onMapPorts={openPortMap} onDelete={deleteAula} /> : <FormScreen aula={editingAula} onBack={() => setEditingAula(undefined)} onSave={saveAula} />}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F7F9FC',
  },
});

export default App;
