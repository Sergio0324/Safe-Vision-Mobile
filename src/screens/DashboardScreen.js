import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, themes } from '../styles/colors';

const theme = themes.dark;
const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const [stats, setStats] = useState({
    totalInspecciones: 24,
    aprobadas: 18,
    rechazadas: 3,
    pendientes: 3,
    tasaAprobacion: 75,
    riesgoPromedio: 'bajo',
  });

  // Datos por categoría (ejemplo)
  const dataPorCategoria = {
    labels: ['Ext', 'Señal', 'EPP', 'Trabajo', 'Químicos'],
    datasets: [
      {
        data: [12, 8, 5, 6, 3],
        colors: [
          () => colors.primary,
          () => colors.accent,
          () => colors.risk.bajo,
          () => colors.risk.medio,
          () => colors.risk.alto,
        ],
      },
    ],
  };

  // Datos de riesgo
  const dataRiesgo = [
    {
      name: 'Crítico',
      population: 2,
      color: colors.risk.critico,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: 'Alto',
      population: 4,
      color: colors.risk.alto,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: 'Medio',
      population: 6,
      color: colors.risk.medio,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: 'Bajo',
      population: 12,
      color: colors.risk.bajo,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
  ];

  // Datos de tendencia (últimos 6 meses)
  const dataTendencia = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        data: [3, 5, 8, 6, 10, 12],
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradient.primary}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>📊 Dashboard</Text>
        <Text style={styles.headerSubtitle}>Estadísticas y Análisis</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* KPIs principales */}
        <View style={styles.kpisContainer}>
          <StatCard
            label="Total"
            value={stats.totalInspecciones}
            icon="📋"
            color={colors.primary}
          />
          <StatCard
            label="Aprobadas"
            value={stats.aprobadas}
            icon="✅"
            color={colors.risk.bajo}
          />
          <StatCard
            label="Pendientes"
            value={stats.pendientes}
            icon="⏳"
            color={colors.risk.medio}
          />
          <StatCard
            label="Rechazadas"
            value={stats.rechazadas}
            icon="❌"
            color={colors.risk.critico}
          />
        </View>

        {/* Tasa de Aprobación */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            ✅ Tasa de Aprobación
          </Text>
          <View style={styles.aprobacionContainer}>
            <View style={styles.percentageCircle}>
              <Text style={styles.percentageText}>{stats.tasaAprobacion}%</Text>
            </View>
            <View style={styles.aprobacionInfo}>
              <Text style={[styles.aprobacionLabel, { color: theme.textSecondary }]}>
                {stats.aprobadas} de {stats.totalInspecciones} inspecciones aprobadas
              </Text>
              <ProgressBar value={stats.tasaAprobacion} />
              <Text style={[styles.aprobacionSubtext, { color: theme.textSecondary }]}>
                Excelente desempeño 🎉
              </Text>
            </View>
          </View>
        </View>

        {/* Gráfico: Inspecciones por Categoría */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            📊 Inspecciones por Categoría
          </Text>
          <BarChart
            data={dataPorCategoria}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              backgroundColor: theme.card,
              backgroundGradientFrom: theme.card,
              backgroundGradientTo: theme.card,
              color: () => colors.primary,
              labelColor: () => theme.textSecondary,
              style: { borderRadius: 12 },
            }}
            style={styles.chart}
          />
        </View>

        {/* Gráfico: Distribución de Riesgo */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            ⚠️ Distribución de Riesgo
          </Text>
          <PieChart
            data={dataRiesgo}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              color: () => theme.textSecondary,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>

        {/* Gráfico: Tendencia */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            📈 Tendencia (últimos 6 meses)
          </Text>
          <LineChart
            data={dataTendencia}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              backgroundColor: theme.card,
              backgroundGradientFrom: theme.card,
              backgroundGradientTo: theme.card,
              color: () => theme.textSecondary,
              labelColor: () => theme.textSecondary,
              style: { borderRadius: 12 },
            }}
            style={styles.chart}
          />
        </View>

        {/* Recomendaciones */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            💡 Recomendaciones
          </Text>
          <RecommendationItem
            title="Enfoque en Seguridad"
            description="2 inspecciones críticas requieren atención inmediata"
            priority="high"
          />
          <RecommendationItem
            title="Mejorar EPP"
            description="La categoría EPP tiene 3 incumplimientos frecuentes"
            priority="medium"
          />
          <RecommendationItem
            title="Capacitación"
            description="Se recomienda reentrenamiento en procedimientos"
            priority="low"
          />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Componentes auxiliares
function StatCard({ label, value, icon, color }) {
  return (
    <LinearGradient
      colors={[color, color + 'DD']}
      style={styles.statCard}
    >
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  );
}

function ProgressBar({ value }) {
  return (
    <View style={styles.progressBarContainer}>
      <View
        style={[
          styles.progressBarFill,
          { width: `${value}%`, backgroundColor: colors.risk.bajo },
        ]}
      />
    </View>
  );
}

function RecommendationItem({ title, description, priority }) {
  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return colors.risk.critico;
      case 'medium':
        return colors.risk.medio;
      case 'low':
        return colors.risk.bajo;
      default:
        return colors.gray[500];
    }
  };

  return (
    <View
      style={[
        styles.recommendationItem,
        { borderLeftColor: getPriorityColor() },
      ]}
    >
      <View style={styles.recommendationContent}>
        <Text style={styles.recommendationTitle}>{title}</Text>
        <Text style={styles.recommendationDescription}>{description}</Text>
      </View>
      <View
        style={[
          styles.priorityBadge,
          { backgroundColor: getPriorityColor() + '20' },
        ]}
      >
        <Text
          style={[styles.priorityText, { color: getPriorityColor() }]}
        >
          {priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  kpisContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  aprobacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  percentageCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  percentageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  aprobacionInfo: {
    flex: 1,
  },
  aprobacionLabel: {
    fontSize: 13,
    marginBottom: 12,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  aprobacionSubtext: {
    fontSize: 12,
    marginTop: 8,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  priorityBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  priorityText: {
    fontWeight: '600',
    fontSize: 12,
  },
});
