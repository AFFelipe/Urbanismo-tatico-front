import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const API_BASE = 'http://192.168.1.7:3000';

function toRad(value) { return (value * Math.PI) / 180; }

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function formatDistance(meters) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${Math.round(meters)} m`;
}

export default function HomeScreen({ navigation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [intervencoes, setIntervencoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Estados do Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');

  const loadLocationAndData = useCallback(async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Permissão negada');
      const position = await Location.getCurrentPositionAsync({});
      setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      const response = await fetch(`${API_BASE}/intervencoes`);
      const data = await response.json();
      setIntervencoes(data);
    } catch (err) { setErrorMsg('Erro ao carregar dados'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadLocationAndData(); }, [loadLocationAndData]);

  const handleEnviarFeedback = async () => {
    try {
      await fetch(`${API_BASE}/registro-posicao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          rua_nome: itemSelecionado.ruas_envolvidas,
          timestamp: new Date().toISOString(),
          feedback_nota: nota,
          feedback_texto: comentario
        }),
      });
      setModalVisible(false);
      Alert.alert('Sucesso', 'Feedback enviado com sucesso!');
    } catch (err) { Alert.alert('Erro', 'Falha ao enviar feedback'); }
  };

  const listaOrdenada = userLocation ? [...intervencoes].map(item => ({
    ...item,
    distancia: haversineDistance(userLocation.latitude, userLocation.longitude, item.latitude, item.longitude)
  })).sort((a, b) => a.distancia - b.distancia) : [];

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Tracking', { intervencoes: intervencoes })}>
          <Text style={styles.navButtonText}>Ir para Tracking</Text>
      </TouchableOpacity>

      <FlatList
        data={listaOrdenada}
        keyExtractor={(item, index) => `${item.ruas_envolvidas}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.ruas_envolvidas}</Text>
            <Text>{item.bairro}</Text>
            <Text>{formatDistance(item.distancia)}</Text>
            <TouchableOpacity style={styles.registerButton} onPress={() => { setItemSelecionado(item); setModalVisible(true); }}>
              <Text style={styles.registerButtonText}>Registrar Presença</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Avalie o espaço 📍</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setNota(star)}>
                  <Ionicons name={star <= nota ? 'star' : 'star-outline'} size={40} color="#f59e0b" />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.input} placeholder="O que achou desta intervenção?" value={comentario} onChangeText={setComentario} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}><Text>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleEnviarFeedback}><Text style={{color: 'white', fontWeight: 'bold'}}>Enviar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  navButton: { backgroundColor: '#2563eb', padding: 10, borderRadius: 6, marginBottom: 16, alignItems: 'center' },
  navButtonText: { color: '#fff', fontWeight: '600' },
  item: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10 },
  itemTitle: { fontWeight: 'bold', marginBottom: 4 },
  registerButton: { backgroundColor: '#16a34a', padding: 8, borderRadius: 6, marginTop: 8, alignItems: 'center' },
  registerButtonText: { color: '#fff', fontWeight: '600' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '85%', backgroundColor: 'white', padding: 20, borderRadius: 15, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  starsContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20, minHeight: 60 },
  modalButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  btnCancel: { padding: 12, backgroundColor: '#e2e8f0', borderRadius: 5, flex: 0.4, alignItems: 'center' },
  btnSubmit: { padding: 12, backgroundColor: '#16a34a', borderRadius: 5, flex: 0.4, alignItems: 'center' }
});