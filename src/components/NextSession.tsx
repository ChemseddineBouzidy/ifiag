import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NextSession: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Session suivante</Text>
        <Text style={styles.badge}>Prochaine</Text>
      </View>

      <View style={styles.infoRow}>
        <Feather name="calendar" size={16} color="#059669" />
        <Text style={styles.label}>30 mai 2025</Text>
      </View>

      <View style={styles.infoRow}>
        <Feather name="clock" size={16} color="#059669" />
        <Text style={styles.label}>14h00 - 15h00</Text>
      </View>

      <View style={styles.infoRow}>
        <Feather name="user" size={16} color="#059669" />
        <Text style={styles.label}>Jean Dupont</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Rejoindre la session</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  badge: {
    backgroundColor: '#d1fae5',
    color: '#047857',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    overflow: 'hidden'
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  label: { marginLeft: 8, fontSize: 14, color: '#111827' },
  button: {
    backgroundColor: '#059669',
    marginTop: 16,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default NextSession;
