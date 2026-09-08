import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors-premium';

export default function RiskBadge({ nivel = 'bajo', size = 'medium' }) {
  const getRiskColor = () => {
    switch (nivel?.toLowerCase()) {
      case 'critico':
        return colors.risk.critico;
      case 'alto':
        return colors.risk.alto;
      case 'medio':
        return colors.risk.medio;
      case 'bajo':
        return colors.risk.bajo;
      default:
        return colors.gray[500];
    }
  };

  const getLabel = () => {
    switch (nivel?.toLowerCase()) {
      case 'critico':
        return '🔴 CRÍTICO';
      case 'alto':
        return '🟠 ALTO';
      case 'medio':
        return '🟡 MEDIO';
      case 'bajo':
        return '🟢 BAJO';
      default:
        return '⚪ DESCONOCIDO';
    }
  };

  const sizes = {
    small: {
      badge: { paddingVertical: 4, paddingHorizontal: 8 },
      text: { fontSize: 11 },
    },
    medium: {
      badge: { paddingVertical: 6, paddingHorizontal: 12 },
      text: { fontSize: 12 },
    },
    large: {
      badge: { paddingVertical: 8, paddingHorizontal: 16 },
      text: { fontSize: 14 },
    },
  };

  const sizeConfig = sizes[size] || sizes.medium;

  return (
    <View
      style={[
        styles.badge,
        sizeConfig.badge,
        { backgroundColor: getRiskColor() + '20', borderColor: getRiskColor() },
      ]}
    >
      <Text style={[styles.text, sizeConfig.text, { color: getRiskColor() }]}>
        {getLabel()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});
