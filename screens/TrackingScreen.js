import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

// Função Haversine (pode ser movida para um arquivo utils.js no futuro)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000; // Raio da terra em metros
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function TrackingScreen({ navigation, route }) {
  // Recebe as intervenções da HomeScreen via parâmetros de navegação
  const { intervencoes = [] } = route.params || {};
  const [currentLocation, setCurrentLocation] = useState(null);
  const [closestIntervention, setClosestIntervention] = useState(null);
  const [isInsideGeofence, setIsInsideGeofence] = useState(false);

  useEffect(() => {
    let locationSubscription;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      // watchPositionAsync atualiza a posição conforme o usuário anda
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Atualiza a cada 5 segundos
          distanceInterval: 10, // Atualiza a cada 10 metros percorridos
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setCurrentLocation({ latitude, longitude });

          if (intervencoes.length > 0) {
            // Encontra a intervenção mais próxima
            let minDistance = Infinity;
            let closest = null;

            intervencoes.forEach((item) => {
              const distance = haversineDistance(latitude, longitude, item.latitude, item.longitude);
              if (distance < minDistance) {
                minDistance = distance;
                closest = { ...item, distance };
              }
            });

            setClosestIntervention(closest);
            // Regra do Geofencing: menor que 50 metros
            setIsInsideGeofence(minDistance <= 50);
          }
        }
      );
    };

    startTracking();

    // Cleanup para não vazar memória ao sair da tela
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [intervencoes]);

  if (!currentLocation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10 }}>Buscando sinal de GPS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Radar de Urbanismo</Text>

      {closestIntervention ? (
        <View style={styles.radarCard}>
          <Text style={styles.label}>Destino mais próximo:</Text>
          <Text style={styles.streetName}>{closestIntervention.ruas_envolvidas}</Text>
          <Text style={styles.distanceInfo}>
            Distância: {Math.round(closestIntervention.distance)} metros
          </Text>

          {isInsideGeofence ? (
            <View style={styles.geofenceActive}>
              <Text style={styles.geofenceText}>Você está na área de intervenção!</Text>
            </View>
          ) : (
            <View style={styles.geofenceInactive}>
              <Text style={styles.geofenceText}>Continue caminhando...</Text>
            </View>
          )}
        </View>
      ) : (
        <Text>Nenhuma intervenção carregada.</Text>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Voltar para Lista</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  radarCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, elevation: 4 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  streetName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  distanceInfo: { fontSize: 16, color: '#334155', marginBottom: 16 },
  geofenceActive: { backgroundColor: '#22c55e', padding: 12, borderRadius: 8, alignItems: 'center' },
  geofenceInactive: { backgroundColor: '#f59e0b', padding: 12, borderRadius: 8, alignItems: 'center' },
  geofenceText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  backButton: { marginTop: 'auto', backgroundColor: '#334155', padding: 14, borderRadius: 8, alignItems: 'center' },
  backButtonText: { color: '#fff', fontWeight: 'bold' }
});