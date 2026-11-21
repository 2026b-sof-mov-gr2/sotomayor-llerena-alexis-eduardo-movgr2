import React, {useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import MapView, {Callout, Marker, Region} from 'react-native-maps';
import {Aula, PointStatus} from '../data/aulas';

type Props = {aulas: Aula[]; onBack: () => void; onOpenPorts: (aula: Aula) => void};
const campusRegion: Region = {latitude: -0.2109, longitude: -78.4892, latitudeDelta: 0.0027, longitudeDelta: 0.0027};

export default function CampusMapScreen({aulas, onBack, onOpenPorts}: Props) {
  const [selected, setSelected] = useState<Aula | null>(aulas[0] ?? null);
  const activePorts = selected?.ports.filter(port => port.status === 'enabled').length ?? 0;

  return <SafeAreaView style={s.safe}>
    <View style={s.topBar}><Pressable accessibilityRole="button" accessibilityLabel="Volver a puntos" onPress={onBack} style={s.backButton}><Text style={s.back}>‹</Text></Pressable><View><Text style={s.topTitle}>Mapa del campus</Text><Text style={s.topSubtitle}>Puntos de carga</Text></View><View style={s.placeholder}/></View>
    <View style={s.mapArea}>
      <MapView style={s.map} initialRegion={campusRegion} mapType="standard" showsUserLocation={false} showsCompass={false} rotateEnabled={false} accessibilityLabel="Mapa de puntos de carga del campus">
        {aulas.map(point => <Marker key={point.id} coordinate={point.coordinates} pinColor={markerColor(point.status)} onPress={() => setSelected(point)}><Callout tooltip><View style={s.callout}><Text style={s.calloutTitle}>{point.building}</Text><Text style={s.calloutCopy}>{point.location} · {point.floor}</Text></View></Callout></Marker>)}
      </MapView>
      <View style={s.mapNotice}><Text style={s.mapNoticeIcon}>⌖</Text><Text style={s.mapNoticeText}>Coordenadas de demostración</Text></View>
      <View style={s.legend}><Legend color="#14A94A" text="Disponible"/><Legend color="#D99500" text="Ocupado"/><Legend color="#D3322F" text="Dañado"/></View>
      {selected ? <View style={s.sheet}><View style={s.sheetHandle}/><View style={s.sheetHeader}><View><Text style={s.sheetTitle}>{selected.building}</Text><Text style={s.sheetLocation}>{selected.location} · {selected.floor}</Text></View><View style={[s.status, statusStyle(selected.status)]}><Text style={[s.statusText, statusTextStyle(selected.status)]}>{statusLabel(selected.status)}</Text></View></View><Text style={s.coordinates}>⌖ {selected.coordinates.latitude.toFixed(5)}, {selected.coordinates.longitude.toFixed(5)}</Text><View style={s.portSummary}><Text style={s.portCount}>{activePorts}<Text style={s.portTotal}>/{selected.ports.length}</Text></Text><Text style={s.portCopy}>puertos habilitados</Text><Pressable accessibilityRole="button" onPress={() => onOpenPorts(selected)} style={s.openButton}><Text style={s.openButtonText}>Gestionar puertos</Text></Pressable></View></View> : null}
    </View>
  </SafeAreaView>;
}

function Legend({color, text}: {color: string; text: string}) { return <View style={s.legendItem}><View style={[s.dot, {backgroundColor: color}]}/><Text style={s.legendText}>{text}</Text></View>; }
function markerColor(status: PointStatus) { return status === 'available' ? '#14A94A' : status === 'occupied' ? '#D99500' : '#D3322F'; }
function statusLabel(status: PointStatus) { return status === 'available' ? 'Disponible' : status === 'occupied' ? 'Ocupado' : 'Dañado'; }
function statusStyle(status: PointStatus) { return status === 'available' ? s.available : status === 'occupied' ? s.occupied : s.damaged; }
function statusTextStyle(status: PointStatus) { return status === 'available' ? s.availableText : status === 'occupied' ? s.occupiedText : s.damagedText; }

const s = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#EEF7FA'}, topBar: {height: 77, backgroundColor: '#063B8E', paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, backButton: {height: 48, width: 48, alignItems: 'center', justifyContent: 'center'}, back: {fontSize: 53, lineHeight: 48, color: '#FFF', fontWeight: '300'}, topTitle: {fontSize: 20, color: '#FFF', fontWeight: '900', textAlign: 'center'}, topSubtitle: {fontSize: 11, color: '#BFD8FF', textAlign: 'center', marginTop: 1}, placeholder: {width: 48},
  mapArea: {flex: 1, position: 'relative'}, map: {flex: 1}, mapNotice: {position: 'absolute', top: 17, left: 17, paddingHorizontal: 11, minHeight: 32, backgroundColor: 'rgba(255,255,255,.95)', borderRadius: 11, flexDirection: 'row', alignItems: 'center', shadowColor: '#1C3B64', shadowOpacity: .17, shadowRadius: 7, shadowOffset: {width: 0, height: 3}, elevation: 3}, mapNoticeIcon: {fontSize: 15, color: '#14529A', marginRight: 5}, mapNoticeText: {fontSize: 11, color: '#405879', fontWeight: '700'}, legend: {position: 'absolute', top: 61, left: 17, backgroundColor: 'rgba(255,255,255,.95)', padding: 10, borderRadius: 11, gap: 7, shadowColor: '#1C3B64', shadowOpacity: .14, shadowRadius: 7, shadowOffset: {width: 0, height: 3}, elevation: 3}, legendItem: {flexDirection: 'row', alignItems: 'center'}, dot: {width: 9, height: 9, borderRadius: 5, marginRight: 6}, legendText: {fontSize: 11, color: '#53647E'},
  callout: {minWidth: 157, backgroundColor: '#FFF', padding: 11, borderRadius: 12, shadowColor: '#163B73', shadowOpacity: .15, shadowRadius: 8, elevation: 4}, calloutTitle: {color: '#092D69', fontSize: 15, fontWeight: '900'}, calloutCopy: {fontSize: 12, color: '#62718C', marginTop: 2},
  sheet: {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 21, paddingBottom: 27, backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, shadowColor: '#102D5E', shadowOpacity: .23, shadowRadius: 17, shadowOffset: {width: 0, height: -4}, elevation: 10}, sheetHandle: {width: 42, height: 5, borderRadius: 3, backgroundColor: '#C8D3E4', alignSelf: 'center', marginBottom: 16}, sheetHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}, sheetTitle: {fontSize: 24, color: '#092D69', fontWeight: '900'}, sheetLocation: {fontSize: 14, color: '#64718A', marginTop: 3}, status: {paddingVertical: 7, paddingHorizontal: 10, borderRadius: 15}, statusText: {fontSize: 12, fontWeight: '800'}, available: {backgroundColor: '#D9F9E3'}, occupied: {backgroundColor: '#FFF0C3'}, damaged: {backgroundColor: '#FFE0E1'}, availableText: {color: '#08742C'}, occupiedText: {color: '#A86500'}, damagedText: {color: '#B51E1B'}, coordinates: {fontSize: 12, color: '#57739A', marginTop: 11}, portSummary: {flexDirection: 'row', alignItems: 'center', marginTop: 17}, portCount: {fontSize: 26, color: '#08742C', fontWeight: '900'}, portTotal: {fontSize: 18, color: '#738199'}, portCopy: {fontSize: 12, color: '#65728A', marginLeft: 7, flex: 1, maxWidth: 75}, openButton: {minHeight: 47, paddingHorizontal: 13, borderRadius: 14, backgroundColor: '#0872C7', alignItems: 'center', justifyContent: 'center'}, openButtonText: {color: '#FFF', fontSize: 13, fontWeight: '800'},
});
