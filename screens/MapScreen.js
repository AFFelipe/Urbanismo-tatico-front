import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapaIntervencoes({ userLocation, intervencoes }) {
  if (!userLocation) return null;

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05, // Zoom inicial
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true} // Habilita o "ponto azul" nativo do GPS
      >
        {intervencoes.map((item, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            title={item.ruas_envolvidas}
            description={item.bairro}
            pinColor="#2563eb" // Cor personalizada do pin
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: { height: 300, width: '100%', borderRadius: 12, overflow: 'hidden', marginTop: 20 },
  map: { flex: 1 },
});