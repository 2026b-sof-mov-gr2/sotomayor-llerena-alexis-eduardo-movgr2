import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import AulaCard from '../components/AulaCard';
import DeleteModal from '../components/DeleteModal';
import {Aula, PointStatus} from '../data/aulas';

type Props = { aulas: Aula[]; notice: string; onNoticeShown: () => void; onCreate: () => void; onEdit: (aula: Aula) => void; onCampusMap: () => void; onMapPorts: (aula: Aula) => void; onDelete: (id: string) => void };
const filterLabels: Record<PointStatus, string> = {available: 'Disponibles', occupied: 'Ocupados', damaged: 'Dañados'};

export default function ListScreen({aulas, notice, onNoticeShown, onCreate, onEdit, onCampusMap, onMapPorts, onDelete}: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<PointStatus | 'all'>('all');
  const [toDelete, setToDelete] = useState<Aula | null>(null);

  useEffect(() => { if (!notice) return; const timer = setTimeout(onNoticeShown, 2600); return () => clearTimeout(timer); }, [notice, onNoticeShown]);
  const items = useMemo(() => aulas.filter(point => (filter === 'all' || point.status === filter) && `${point.building} ${point.location} ${point.floor}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [aulas, filter, query]);
  const nextFilter = () => setFilter(current => current === 'all' ? 'available' : current === 'available' ? 'occupied' : current === 'occupied' ? 'damaged' : 'all');
  const confirmDelete = () => { if (toDelete) { onDelete(toDelete.id); setToDelete(null); } };

  return <SafeAreaView style={s.safe}>
    <FlatList data={items} keyExtractor={point => point.id} renderItem={({item}) => <AulaCard aula={item} onPress={() => onEdit(item)} onMapPorts={() => onMapPorts(item)} onDelete={() => setToDelete(item)} />}
      ListHeaderComponent={<><View style={s.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Abrir menú" hitSlop={10} style={s.topButton}><Text style={s.menu}>☰</Text></Pressable>
        <View style={s.brand}><View style={s.pin}><Text style={s.pinIcon}>ϟ</Text></View><View style={s.brandDivider}/><Text style={s.logo}><Text style={s.volt}>Volt</Text><Text style={s.u}>U</Text></Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Ver alertas" hitSlop={10} style={s.topButton}><Text style={s.bell}>♧</Text></Pressable>
      </View><View style={s.header}>
        <Text style={s.heading}><Text style={s.headingMark}>▌</Text> Puntos de carga</Text>
        <Text style={s.support}>Encuentra y consulta puntos de carga en el campus.</Text>
        <View style={s.searchRow}><View style={s.search}><Text style={s.searchIcon}>⌕</Text><TextInput accessibilityLabel="Buscar punto de carga" value={query} onChangeText={setQuery} placeholder="Buscar por edificio o ubicación" placeholderTextColor="#717A91" style={s.input}/></View><Pressable accessibilityRole="button" accessibilityLabel="Cambiar filtro de estado" onPress={nextFilter} style={[s.filter, filter !== 'all' && s.filterActive]}><Text style={s.filterText}>☷</Text></Pressable></View>
        {filter !== 'all' && <Pressable accessibilityRole="button" onPress={() => setFilter('all')} style={s.filterPill}><Text style={s.filterPillText}>Filtro: {filterLabels[filter]}  ×</Text></Pressable>}
      </View></>}
      ListEmptyComponent={<View style={s.empty}><Text style={s.emptyTitle}>No encontramos puntos</Text><Text style={s.emptyCopy}>Prueba con otro edificio, ubicación o filtro.</Text></View>}
      contentContainerStyle={s.list} showsVerticalScrollIndicator={false}/>
    <Pressable accessibilityRole="button" accessibilityLabel="Registrar punto de carga" onPress={onCreate} style={s.fab}><Text style={s.plus}>＋</Text></Pressable>
    {notice ? <View accessibilityLiveRegion="polite" style={s.toast}><Text style={s.toastIcon}>✓</Text><Text style={s.toastText}>{notice}</Text></View> : null}
    <DeleteModal visible={!!toDelete} title="Eliminar reporte" description={`¿Deseas eliminar el reporte de ${toDelete?.building ?? ''}? Esta acción no se puede deshacer.`} onCancel={() => setToDelete(null)} onConfirm={confirmDelete}/>
    <View style={s.bottomNav}><Pressable accessibilityRole="tab" accessibilityLabel="Mapa del campus" onPress={onCampusMap} style={s.tab}><Text style={s.tabIcon}>⌑</Text><Text style={s.tabText}>Mapa</Text></Pressable><Pressable accessibilityRole="tab" accessibilityState={{selected: true}} accessibilityLabel="Puntos" style={[s.tab, s.activeTab]}><Text style={s.activeIcon}>ϟ</Text><Text style={s.activeText}>Puntos</Text></Pressable><Pressable accessibilityRole="tab" accessibilityLabel="Alertas" style={s.tab}><Text style={s.tabIcon}>♧</Text><Text style={s.tabText}>Alertas</Text></Pressable></View>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#EEF7FA'}, list: {paddingBottom: 124},
  topBar: {height: 96, backgroundColor: '#063B8E', paddingHorizontal: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, topButton: {height: 48, width: 48, alignItems: 'center', justifyContent: 'center'}, menu: {fontSize: 33, color: '#FFF', lineHeight: 36},
  brand: {flexDirection: 'row', alignItems: 'center', gap: 12}, pin: {height: 48, width: 38, borderRadius: 22, backgroundColor: '#75EE5C', borderWidth: 5, borderColor: '#A9FA69', alignItems: 'center', justifyContent: 'center'}, pinIcon: {fontSize: 28, color: '#063B8E', fontWeight: '900'}, brandDivider: {height: 43, width: 1.5, backgroundColor: '#81A9E4'}, logo: {fontSize: 34, fontWeight: '900', letterSpacing: -1.5}, volt: {color: '#FFF'}, u: {color: '#76ED5D'}, bell: {fontSize: 34, color: '#FFF', lineHeight: 38},
  header: {paddingTop: 34, paddingBottom: 28, paddingHorizontal: 33}, heading: {fontSize: 34, fontWeight: '900', color: '#073274', letterSpacing: -.8}, headingMark: {color: '#10BD58', fontSize: 31}, support: {fontSize: 17, color: '#58647B', marginTop: 8, lineHeight: 24},
  searchRow: {flexDirection: 'row', marginTop: 28, gap: 14}, search: {flex: 1, height: 64, borderRadius: 20, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 17, shadowColor: '#163B73', shadowOpacity: .12, shadowRadius: 12, shadowOffset: {width: 0, height: 5}, elevation: 3}, searchIcon: {fontSize: 33, color: '#68738A', marginRight: 9, lineHeight: 34}, input: {flex: 1, fontSize: 16, color: '#172B4D'}, filter: {width: 64, height: 64, borderRadius: 20, backgroundColor: '#E8F0FF', alignItems: 'center', justifyContent: 'center', shadowColor: '#163B73', shadowOpacity: .1, shadowRadius: 9, shadowOffset: {width: 0, height: 4}, elevation: 2}, filterActive: {backgroundColor: '#D8F7E4', borderWidth: 1, borderColor: '#9CE8B6'}, filterText: {fontSize: 30, color: '#073B88'}, filterPill: {alignSelf: 'flex-start', marginTop: 11, backgroundColor: '#D7F6E2', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 15}, filterPillText: {color: '#14683A', fontSize: 13, fontWeight: '700'},
  fab: {position: 'absolute', right: 42, bottom: 107, width: 70, height: 70, borderRadius: 35, backgroundColor: '#00A63A', alignItems: 'center', justifyContent: 'center', shadowColor: '#006E2B', shadowOpacity: .4, shadowRadius: 12, shadowOffset: {width: 0, height: 7}, elevation: 8}, plus: {fontSize: 47, lineHeight: 52, color: '#FFF', fontWeight: '300'},
  toast: {position: 'absolute', left: 34, right: 34, bottom: 148, backgroundColor: '#086A35', borderRadius: 16, minHeight: 68, paddingHorizontal: 19, flexDirection: 'row', alignItems: 'center', shadowColor: '#06371E', shadowOpacity: .25, shadowRadius: 13, shadowOffset: {width: 0, height: 7}, elevation: 6}, toastIcon: {height: 32, width: 32, borderRadius: 16, backgroundColor: '#DAF8E6', color: '#086A35', textAlign: 'center', lineHeight: 32, fontSize: 18, fontWeight: '900'}, toastText: {marginLeft: 13, color: '#FFF', fontSize: 18, fontWeight: '800'},
  bottomNav: {height: 90, position: 'absolute', bottom: 0, left: 16, right: 16, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 7, shadowColor: '#173B6E', shadowOpacity: .15, shadowRadius: 14, shadowOffset: {width: 0, height: -3}, elevation: 8}, tab: {minWidth: 92, minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 24}, activeTab: {backgroundColor: '#DDF8E8', paddingHorizontal: 16}, tabIcon: {fontSize: 29, color: '#5E6880', lineHeight: 31}, tabText: {fontSize: 15, color: '#5E6880'}, activeIcon: {fontSize: 31, color: '#074297', lineHeight: 31, fontWeight: '900'}, activeText: {fontSize: 16, color: '#074297', fontWeight: '800'}, empty: {alignItems: 'center', paddingHorizontal: 40, paddingTop: 42}, emptyTitle: {fontSize: 19, fontWeight: '800', color: '#173B76'}, emptyCopy: {fontSize: 15, color: '#63708A', textAlign: 'center', marginTop: 7},
});
