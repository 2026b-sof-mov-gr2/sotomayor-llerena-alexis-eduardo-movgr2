import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, Animated, Easing, SafeAreaView, StyleSheet, Text, View} from 'react-native';

type Props = {onComplete: () => void};

export default function LoadingScreen({onComplete}: Props) {
  const reveal = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(reveal, {toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
      Animated.loop(Animated.sequence([
        Animated.timing(pulse, {toValue: 1, duration: 850, easing: Easing.inOut(Easing.quad), useNativeDriver: true}),
        Animated.timing(pulse, {toValue: 0.92, duration: 850, easing: Easing.inOut(Easing.quad), useNativeDriver: true}),
      ])),
    ]).start();
    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, [onComplete, pulse, reveal]);

  return <SafeAreaView style={s.safe} accessibilityLabel="Cargando VoltU">
    <View style={s.glowTop}/><View style={s.glowBottom}/>
    <Animated.View style={[s.content, {opacity: reveal, transform: [{translateY: reveal.interpolate({inputRange: [0, 1], outputRange: [18, 0]})}]}]}>
      <Animated.View style={[s.pin, {transform: [{scale: pulse}, {rotate: '45deg'}]}]}><View style={s.pinInner}><Text style={s.bolt}>ϟ</Text></View></Animated.View>
      <View style={s.brandRow}><Text style={s.volt}>Volt</Text><Text style={s.u}>U</Text></View>
      <View style={s.divider}/>
      <Text style={s.tagline}>Energía disponible en tu campus</Text>
    </Animated.View>
    <View style={s.loading}><ActivityIndicator size="small" color="#8AF574"/><Text style={s.loadingText}>Cargando puntos de carga…</Text></View>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#063B8E', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  glowTop: {position: 'absolute', top: -115, right: -100, height: 335, width: 335, borderRadius: 180, backgroundColor: '#0D65BD', opacity: .75},
  glowBottom: {position: 'absolute', bottom: -115, left: -110, height: 315, width: 315, borderRadius: 170, backgroundColor: '#07538C', opacity: .8},
  content: {alignItems: 'center', marginTop: -30},
  pin: {width: 124, height: 142, borderTopLeftRadius: 67, borderTopRightRadius: 67, borderBottomLeftRadius: 67, borderBottomRightRadius: 10, backgroundColor: '#78EE5C', alignItems: 'center', justifyContent: 'center', shadowColor: '#001E55', shadowOpacity: .35, shadowRadius: 18, shadowOffset: {width: 0, height: 10}, elevation: 10},
  pinInner: {width: 78, height: 78, borderRadius: 39, backgroundColor: '#0A4B9D', alignItems: 'center', justifyContent: 'center', transform: [{rotate: '-45deg'}], borderWidth: 5, borderColor: '#C2FF79'},
  bolt: {fontSize: 50, lineHeight: 56, color: '#FFF', fontWeight: '900'},
  brandRow: {flexDirection: 'row', marginTop: 46, alignItems: 'baseline'}, volt: {fontSize: 56, letterSpacing: -3, fontWeight: '900', color: '#FFF'}, u: {fontSize: 56, letterSpacing: -3, fontWeight: '900', color: '#8AF574'}, divider: {height: 2, width: 54, backgroundColor: '#83F06F', borderRadius: 2, marginTop: 16}, tagline: {fontSize: 16, color: '#D7E8FF', marginTop: 16},
  loading: {position: 'absolute', bottom: 70, alignItems: 'center'}, loadingText: {fontSize: 14, color: '#D7E8FF', marginTop: 12},
});
