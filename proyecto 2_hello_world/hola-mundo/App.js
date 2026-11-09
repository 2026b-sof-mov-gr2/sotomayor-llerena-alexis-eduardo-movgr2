import { StatusBar } from 'expo-status-bar';
import { NativeModules, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

const { NativeResources } = NativeModules;

function androidColorToHex(value) {
  return `#${(value & 0xffffff).toString(16).padStart(6, '0')}`;
}

// Expo Go/iOS no puede cargar los recursos Android. Este fallback permite
// probar la misma matriz desde Expo Go; Android sigue usando el módulo Kotlin.
function getExpoGoResources(windowDimensions = Dimensions.get('window')) {
  const { width, height } = windowDimensions;
  const orientation = width > height ? 'landscape' : 'portrait';
  // En Expo Go dejamos la demostración en español para ambas orientaciones.
  const language = 'es';
  const key = `${orientation}-${language}`;
  const resources = {
    'portrait-es': { text: 'Vertical · Español', textColor: '#123B5D', backgroundColor: '#E8F4FA' },
    'portrait-en': { text: 'Portrait · English', textColor: '#5B275D', backgroundColor: '#F6E8FA' },
    'landscape-es': { text: 'Horizontal · Español', textColor: '#6B3B12', backgroundColor: '#FFF1DB' },
    'landscape-en': { text: 'Landscape · English', textColor: '#174D3B', backgroundColor: '#E4F7EC' },
  };
  return { ...resources[key], language, orientation };
}

export default function App() {
  const [resources, setResources] = useState(null);
  const loadResources = useCallback(async (dimensionEvent) => {
    if (!NativeResources) {
      setResources(getExpoGoResources(dimensionEvent?.window));
      return;
    }
    const resolved = await NativeResources.getResolvedResources();
    setResources({ ...resolved, textColor: androidColorToHex(resolved.textColor), backgroundColor: androidColorToHex(resolved.backgroundColor) });
  }, []);

  useEffect(() => {
    const initialLoad = setTimeout(loadResources, 0);
    const subscription = Dimensions.addEventListener('change', loadResources);
    return () => { clearTimeout(initialLoad); subscription.remove(); };
  }, [loadResources]);

  if (!resources) return <View style={styles.loading}><Text style={styles.loadingText}>Cargando recursos nativos…</Text></View>;

  return (
    <View style={[styles.container, { backgroundColor: resources.backgroundColor }]}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>RECURSOS NATIVOS DE ANDROID</Text>
        <Text style={[styles.title, { color: resources.textColor }]}>{resources.text}</Text>
        <Text style={styles.subtitle}>Android selecciona automáticamente strings.xml y colors.xml según idioma y orientación.</Text>
        <View style={styles.badge}><Text style={[styles.badgeText, { color: resources.textColor }]}>● {resources.orientation} · {resources.language}</Text></View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 28, elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  eyebrow: { color: '#64748b', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, marginBottom: 18 },
  title: {
    fontSize: 34, fontWeight: '800', marginBottom: 14,
  },
  subtitle: { color: '#475569', fontSize: 16, lineHeight: 24 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#f1f5f9', borderRadius: 999, marginTop: 24, paddingHorizontal: 14, paddingVertical: 9 },
  badgeText: { fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
  loading: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  loadingText: { color: '#475569', fontSize: 16 },
});
