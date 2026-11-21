import React, {useState} from 'react';
import {Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Aula, buildingOptions, coordinateForBuilding, createPorts, floorOptions, PointStatus} from '../data/aulas';

type Props = {aula: Aula | null; onBack: () => void; onSave: (aula: Omit<Aula, 'id'> & {id?: string}) => void};
const statuses: {key: PointStatus; label: string; icon: string}[] = [{key: 'available', label: 'Disponible', icon: '✓'}, {key: 'occupied', label: 'Ocupado', icon: '◷'}, {key: 'damaged', label: 'Dañado', icon: '⚠'}];

export default function FormScreen({aula, onBack, onSave}: Props) {
  const isUpdate = Boolean(aula);
  const [building, setBuilding] = useState(aula?.building ?? 'Edificio D');
  const [floor, setFloor] = useState(aula?.floor ?? 'Piso 3');
  const [location, setLocation] = useState(aula?.location ?? '');
  const [description, setDescription] = useState(aula?.description ?? '');
  const [portCount, setPortCount] = useState(String(aula?.ports.length ?? 2));
  const [status, setStatus] = useState<PointStatus>(aula?.status ?? 'available');
  const [error, setError] = useState('');

  const save = () => {
    if (!location.trim()) { setError('Ingresa la ubicación del punto de carga.'); return; }
    const parsedPorts = Number.parseInt(portCount, 10);
    if (!isUpdate && (!Number.isFinite(parsedPorts) || parsedPorts < 1 || parsedPorts > 24)) { setError('Indica entre 1 y 24 puertos de carga.'); return; }
    onSave({id: aula?.id, building, floor, location: location.trim(), description: description.trim(), status, updatedAt: 'Ahora', ports: aula?.ports ?? createPorts(building, parsedPorts), coordinates: aula?.coordinates ?? coordinateForBuilding(building)});
  };

  return <SafeAreaView style={s.safe}>
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={s.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Volver a puntos de carga" onPress={onBack} hitSlop={10} style={s.backButton}><Text style={s.back}>‹</Text></Pressable>
        <View style={s.brand}><View style={s.pin}><Text style={s.pinIcon}>ϟ</Text></View><View style={s.brandDivider}/><Text style={s.logo}><Text style={s.volt}>Volt</Text><Text style={s.u}>U</Text></Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Ver alertas" hitSlop={10} style={s.backButton}><Text style={s.bell}>♧</Text></Pressable>
      </View>
      <View style={s.intro}><Text style={s.title}><Text style={s.titleMark}>▌</Text> {isUpdate ? 'Actualizar estado' : 'Registrar punto'}</Text><Text style={s.subtitle}>{isUpdate ? 'Actualiza la disponibilidad de un punto de carga.' : 'Agrega un nuevo punto de carga al campus.'}</Text></View>
      <View style={[s.card, isUpdate && s.updateCard]}>
        <View style={s.illustration}><View style={s.buildingArt}><View style={s.artRoof}/><View style={s.artWindows}/><View style={s.artDoor}/></View><View style={s.artPlug}><Text style={s.artPlugText}>ϟ</Text></View></View>
        {isUpdate ? <PointSummary point={aula!} /> : <>
          <SelectField icon="▥" label="Edificio" value={building} options={buildingOptions} onSelect={setBuilding}/>
          <SelectField icon="◇" label="Piso" value={floor} options={floorOptions} onSelect={setFloor}/>
          <InputField icon="⌖" label="Ubicación" value={location} onChange={value => {setLocation(value); setError('');}} placeholder="Ej. Área de cómputo"/>
          <InputField icon="▤" label="Descripción (opcional)" value={description} onChange={setDescription} placeholder="Ej. Contactos junto a las mesas"/>
          <InputField icon="ϟ" label="Puertos de carga" value={portCount} onChange={value => {setPortCount(value); setError('');}} placeholder="Ej. 4" keyboardType="number-pad"/>
        </>}
        <Text style={s.statusTitle}>{isUpdate ? 'Nuevo estado' : 'Estado'}</Text>
        <View style={s.statuses}>{statuses.map(item => <Pressable accessibilityRole="radio" accessibilityState={{checked: status === item.key}} key={item.key} onPress={() => setStatus(item.key)} style={[s.status, status === item.key && selectedStyle(item.key)]}><Text style={[s.statusText, status === item.key && selectedTextStyle(item.key)]}>{item.icon}  {item.label}</Text></Pressable>)}</View>
        {error ? <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text> : null}
        <View style={s.actions}><Pressable accessibilityRole="button" onPress={onBack} style={s.cancel}><Text style={s.cancelText}>Cancelar</Text></Pressable><Pressable accessibilityRole="button" onPress={save} style={[s.save, isUpdate && s.updateSave]}><Text style={s.saveText}>{isUpdate ? 'Actualizar estado' : 'Guardar punto'}</Text></Pressable></View>
      </View>
    </ScrollView>
    <View style={s.bottomNav}><View style={s.tab}><Text style={s.tabIcon}>⌑</Text><Text style={s.tabText}>Mapa</Text></View><View style={[s.tab, s.activeTab]}><Text style={s.activeIcon}>ϟ</Text><Text style={s.activeText}>Puntos</Text></View><View style={s.tab}><Text style={s.tabIcon}>♧</Text><Text style={s.tabText}>Alertas</Text></View></View>
  </SafeAreaView>;
}

function PointSummary({point}: {point: Aula}) { return <View style={s.summary}>
  <SummaryRow icon="▥" label="Edificio" value={point.building}/><SummaryRow icon="◇" label="Piso" value={point.floor}/><SummaryRow icon="⌖" label="Ubicación" value={point.location}/><SummaryRow icon="▤" label="Descripción" value={point.description || 'Sin descripción'}/>
</View>; }
function SummaryRow({icon, label, value}: {icon: string; label: string; value: string}) { return <View style={s.summaryRow}><Text style={s.fieldIcon}>{icon}</Text><View style={s.summaryCopy}><Text style={s.summaryLabel}>{label}</Text><Text style={s.summaryValue}>{value}</Text></View></View>; }
function InputField({icon, label, value, onChange, placeholder, keyboardType}: {icon: string; label: string; value: string; onChange: (value: string) => void; placeholder: string; keyboardType?: 'default' | 'number-pad'}) { return <View style={s.field}><Text style={s.label}><Text style={s.fieldIcon}>{icon}</Text> {label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChange} keyboardType={keyboardType} style={s.input} placeholder={placeholder} placeholderTextColor="#788299"/></View>; }
function SelectField({icon, label, value, options, onSelect}: {icon: string; label: string; value: string; options: string[]; onSelect: (value: string) => void}) {
  const [open, setOpen] = useState(false);
  return <View style={s.field}><Text style={s.label}><Text style={s.fieldIcon}>{icon}</Text> {label}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Seleccionar ${label}`} onPress={() => setOpen(true)} style={s.select}><Text style={s.selectValue}>{value}</Text><Text style={s.chevron}>⌄</Text></Pressable><Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}><Pressable onPress={() => setOpen(false)} style={s.optionBackdrop}><View style={s.options}>{options.map(option => <Pressable accessibilityRole="button" key={option} onPress={() => {onSelect(option); setOpen(false);}} style={[s.option, option === value && s.optionSelected]}><Text style={[s.optionText, option === value && s.optionTextSelected]}>{option}</Text>{option === value ? <Text style={s.check}>✓</Text> : null}</Pressable>)}</View></Pressable></Modal></View>;
}
function selectedStyle(status: PointStatus) { return status === 'available' ? s.selectedAvailable : status === 'occupied' ? s.selectedOccupied : s.selectedDamaged; }
function selectedTextStyle(status: PointStatus) { return status === 'available' ? s.availableText : status === 'occupied' ? s.occupiedText : s.damagedText; }

const s = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#EDF8F8'}, content: {paddingBottom: 120}, topBar: {height: 92, backgroundColor: '#063B8E', paddingHorizontal: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, backButton: {width: 48, height: 48, alignItems: 'center', justifyContent: 'center'}, back: {fontSize: 53, lineHeight: 48, color: '#FFF', fontWeight: '300'}, brand: {flexDirection: 'row', alignItems: 'center', gap: 12}, pin: {height: 48, width: 38, borderRadius: 22, backgroundColor: '#75EE5C', borderWidth: 5, borderColor: '#A9FA69', alignItems: 'center', justifyContent: 'center'}, pinIcon: {fontSize: 28, color: '#063B8E', fontWeight: '900'}, brandDivider: {height: 43, width: 1.5, backgroundColor: '#81A9E4'}, logo: {fontSize: 34, fontWeight: '900', letterSpacing: -1.5}, volt: {color: '#FFF'}, u: {color: '#76ED5D'}, bell: {fontSize: 34, color: '#FFF', lineHeight: 38},
  intro: {paddingTop: 32, paddingHorizontal: 32, paddingBottom: 25}, title: {fontSize: 34, fontWeight: '900', color: '#073274', letterSpacing: -.8}, titleMark: {color: '#0CBD55', fontSize: 31}, subtitle: {fontSize: 17, lineHeight: 24, color: '#56627A', marginTop: 8}, card: {backgroundColor: '#FFF', borderRadius: 28, marginHorizontal: 30, padding: 27, shadowColor: '#133A74', shadowOpacity: .15, shadowRadius: 15, shadowOffset: {width: 0, height: 8}, elevation: 5}, updateCard: {paddingTop: 21},
  illustration: {height: 116, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1FCF8', borderRadius: 18, marginBottom: 18, overflow: 'hidden'}, buildingArt: {width: 112, height: 80, backgroundColor: '#F9FCFF', borderTopLeftRadius: 3, borderTopRightRadius: 3, alignItems: 'center', paddingTop: 17, shadowColor: '#2A629E', shadowOpacity: .25, shadowRadius: 5, elevation: 3}, artRoof: {width: 128, height: 15, position: 'absolute', top: -7, backgroundColor: '#D1E2FC', transform: [{skewY: '-8deg'}]}, artWindows: {width: 67, height: 21, backgroundColor: '#77B8F5', borderLeftWidth: 6, borderRightWidth: 6, borderColor: '#F9FCFF'}, artDoor: {width: 26, height: 42, marginTop: 8, backgroundColor: '#468ED1'}, artPlug: {position: 'absolute', right: '26%', bottom: 23, width: 52, height: 58, borderRadius: 26, backgroundColor: '#0DB845', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#A7F8BA'}, artPlugText: {color: '#FFF', fontSize: 35, fontWeight: '900'},
  field: {marginBottom: 16}, label: {fontSize: 17, fontWeight: '800', color: '#092D69', marginBottom: 7}, fieldIcon: {fontSize: 20, color: '#0A428C'}, input: {height: 54, borderWidth: 1, borderColor: '#B8C8E5', borderRadius: 14, paddingHorizontal: 16, fontSize: 17, color: '#3E475C'}, select: {height: 54, borderWidth: 1, borderColor: '#B8C8E5', borderRadius: 14, paddingLeft: 16, paddingRight: 15, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}, selectValue: {fontSize: 17, color: '#3E475C'}, chevron: {fontSize: 27, color: '#093D87', lineHeight: 28},
  optionBackdrop: {flex: 1, backgroundColor: 'rgba(8,28,61,.4)', justifyContent: 'center', padding: 34}, options: {backgroundColor: '#FFF', borderRadius: 20, padding: 10, shadowColor: '#071F4A', shadowOpacity: .22, shadowRadius: 16, elevation: 8}, option: {minHeight: 52, borderRadius: 13, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, optionSelected: {backgroundColor: '#E1F9E8'}, optionText: {fontSize: 17, color: '#34435F'}, optionTextSelected: {fontWeight: '800', color: '#0A6B31'}, check: {fontSize: 19, fontWeight: '900', color: '#0A9D3D'},
  summary: {gap: 10, marginBottom: 22}, summaryRow: {minHeight: 72, borderRadius: 17, backgroundColor: '#EEF3FF', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center'}, summaryCopy: {marginLeft: 13, flex: 1}, summaryLabel: {fontSize: 14, color: '#63708A'}, summaryValue: {fontSize: 19, color: '#18366B', fontWeight: '800', marginTop: 2},
  statusTitle: {fontSize: 22, fontWeight: '900', color: '#073274', marginTop: 4, marginBottom: 14}, statuses: {flexDirection: 'row', gap: 7}, status: {flex: 1, minHeight: 58, borderWidth: 1, borderColor: '#D4DAE7', borderRadius: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3}, statusText: {fontSize: 11, color: '#576078', fontWeight: '800'}, selectedAvailable: {borderColor: '#0AAF45', backgroundColor: '#E1F9E8'}, selectedOccupied: {borderColor: '#D49300', backgroundColor: '#FFF5D6'}, selectedDamaged: {borderColor: '#D72B27', backgroundColor: '#FFE4E3'}, availableText: {color: '#08742C'}, occupiedText: {color: '#A86500'}, damagedText: {color: '#B51E1B'}, error: {color: '#C5221F', fontWeight: '700', marginTop: 12},
  actions: {flexDirection: 'row', gap: 14, marginTop: 27}, cancel: {flex: 1, minHeight: 56, borderColor: '#0750B4', borderWidth: 2, borderRadius: 18, alignItems: 'center', justifyContent: 'center'}, cancelText: {color: '#06459E', fontSize: 16, fontWeight: '800'}, save: {flex: 1.22, minHeight: 56, backgroundColor: '#0872C7', borderRadius: 18, alignItems: 'center', justifyContent: 'center'}, updateSave: {backgroundColor: '#08A53A'}, saveText: {color: '#FFF', fontSize: 16, fontWeight: '800'},
  bottomNav: {height: 90, position: 'absolute', bottom: 0, left: 16, right: 16, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 7, shadowColor: '#173B6E', shadowOpacity: .15, shadowRadius: 14, shadowOffset: {width: 0, height: -3}, elevation: 8}, tab: {minWidth: 92, minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 24}, activeTab: {backgroundColor: '#DDF8E8', paddingHorizontal: 16}, tabIcon: {fontSize: 29, color: '#5E6880', lineHeight: 31}, tabText: {fontSize: 15, color: '#5E6880'}, activeIcon: {fontSize: 31, color: '#074297', lineHeight: 31, fontWeight: '900'}, activeText: {fontSize: 16, color: '#074297', fontWeight: '800'},
});
