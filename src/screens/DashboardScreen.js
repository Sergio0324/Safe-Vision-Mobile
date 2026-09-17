import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { listarInspecciones } from '../services/api';
import { colors, themes } from '../styles/colors';
import { getCategoria, getFecha, getNivelRiesgo, getConfianza } from './inspecciones';

const theme = themes.dark;
const screenWidth = Dimensions.get('window').width;
const SEDE_ID = '550e8400-e29b-41d4-a716-446655440000';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const CATEGORIA_LABELS = {
  extintores: 'Ext',
  senalizacion: 'Señal',
  equipos_emergencia: 'Emerg',
  epp: 'EPP',
  epcc: 'Caídas',
  trabajo_caliente: 'T.Cal',
  izaje_cargas: 'Izaje',
  espacios_confinados: 'Confin',
  trabajo_electrico: 'Eléct',
  sustancias_quimicas: 'Químicos',
};

function getUltimos6Meses() {
  const hoy = new Date();
  const meses = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    meses.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MESES[d.getMonth()] });
  }
  return meses;
}

// Calcula todas las estadísticas del dashboard a partir de las inspecciones reales
function computeStats(inspecciones) {
  const total = inspecciones.length;

  let aprobadas = 0;
  let rechazadas = 0;
  let revisando = 0;
  const riesgoCount = { critico: 0, alto: 0, medio: 0, bajo: 0 };
  const categoriaCount = {};
  const confianzas = [];

  inspecciones.forEach((item) => {
    const estado = item.estado?.toLowerCase();
    if (estado === 'aprobado') aprobadas++;
    else if (estado === 'rechazado') rechazadas++;
    else if (estado === 'revisando') revisando++;

    const nivel = getNivelRiesgo(item)?.toLowerCase();
    if (nivel && riesgoCount[nivel] !== undefined) riesgoCount[nivel]++;

    const cat = getCategoria(item);
    if (cat) categoriaCount[cat] = (categoriaCount[cat] || 0) + 1;

    const confianza = getConfianza(item);
    if (confianza !== null) confianzas.push(confianza);
  });

  const pendientes = total - aprobadas - rechazadas - revisando;
  const tasaAprobacion = total > 0 ? Math.round((aprobadas / total) * 100) : 0;
  const confianzaPromedio =
    confianzas.length > 0 ? Math.round(confianzas.reduce((a, b) => a + b, 0) / confianzas.length) : null;

  const riesgoOrdenado = Object.entries(riesgoCount).sort((a, b) => b[1] - a[1]);
  const riesgoPromedio = riesgoOrdenado[0][1] > 0 ? riesgoOrdenado[0][0] : 'sin datos';

  // Categorías por cantidad, top 6 para que el gráfico no se sature
  const categoriasOrdenadas = Object.entries(categoriaCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Tendencia de últimos 6 meses
  const meses = getUltimos6Meses();
  const tendenciaCounts = meses.map(() => 0);
  inspecciones.forEach((item) => {
    const fecha = getFecha(item);
    if (!fecha) return;
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const idx = meses.findIndex((m) => m.key === key);
    if (idx >= 0) tendenciaCounts[idx]++;
  });

  return {
    total,
    aprobadas,
    rechazadas,
    pendientes: Math.max(pendientes, 0),
    revisando,
    tasaAprobacion,
    riesgoPromedio,
    riesgoCount,
    categoriasOrdenadas,
    tendencia: { labels: meses.map((m) => m.label), data: tendenciaCounts },
    confianzaPromedio,
  };
}

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [exportando, setExportando] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      setError(null);
      const resultado = await listarInspecciones(SEDE_ID);
      if (resultado.success) {
        setStats(computeStats(resultado.data || []));
      } else {
        setError(resultado.error || 'No se pudieron cargar los datos');
      }
    } catch (err) {
      setError('Error inesperado: ' + err.message);
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
    if (!navigation) return;
    const unsubscribe = navigation.addListener('focus', cargarDatos);
    return unsubscribe;
  }, [navigation, cargarDatos]);

  const onRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  if (cargando) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Cargando estadísticas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.loadingText, { color: theme.text }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={cargarDatos}
          >
            <Text style={styles.retryButtonText}>🔄 Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const hayDatos = stats.total > 0;

  const dataPorCategoria = {
    labels: hayDatos
      ? stats.categoriasOrdenadas.map(([cat]) => CATEGORIA_LABELS[cat] || cat.substring(0, 6))
      : [],
    datasets: [
      {
        data: hayDatos ? stats.categoriasOrdenadas.map(([, count]) => count) : [],
      },
    ],
  };

  const dataRiesgo = [
    { name: 'Crítico', population: stats.riesgoCount.critico, color: colors.risk.critico, legendFontColor: theme.text, legendFontSize: 12 },
    { name: 'Alto', population: stats.riesgoCount.alto, color: colors.risk.alto, legendFontColor: theme.text, legendFontSize: 12 },
    { name: 'Medio', population: stats.riesgoCount.medio, color: colors.risk.medio, legendFontColor: theme.text, legendFontSize: 12 },
    { name: 'Bajo', population: stats.riesgoCount.bajo, color: colors.risk.bajo, legendFontColor: theme.text, legendFontSize: 12 },
  ].filter((r) => r.population > 0);

  const dataTendencia = {
    labels: stats.tendencia.labels,
    datasets: [
      {
        data: stats.tendencia.data,
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  // Recomendaciones generadas a partir de los datos reales (no inventadas)
  const recomendaciones = [];
  if (stats.riesgoCount.critico > 0) {
    recomendaciones.push({
      title: 'Atención inmediata',
      description: `${stats.riesgoCount.critico} inspección(es) con riesgo crítico requieren acción urgente`,
      priority: 'high',
    });
  }
  if (stats.categoriasOrdenadas[0]) {
    const [cat, count] = stats.categoriasOrdenadas[0];
    recomendaciones.push({
      title: 'Categoría más inspeccionada',
      description: `${CATEGORIA_LABELS[cat] || cat} concentra ${count} inspección(es)`,
      priority: 'medium',
    });
  }
  if (stats.confianzaPromedio !== null && stats.confianzaPromedio < 50) {
    recomendaciones.push({
      title: 'Confianza IA baja',
      description: `El promedio de confianza es de ${stats.confianzaPromedio}% — conviene revisar manualmente más inspecciones`,
      priority: 'high',
    });
  }
  if (stats.pendientes > 0) {
    recomendaciones.push({
      title: 'Inspecciones sin validar',
      description: `${stats.pendientes} inspección(es) están pendientes de revisión`,
      priority: stats.pendientes > stats.aprobadas ? 'high' : 'low',
    });
  }
  if (recomendaciones.length === 0 && hayDatos) {
    recomendaciones.push({
      title: 'Todo en orden',
      description: 'No hay hallazgos críticos ni pendientes en este momento',
      priority: 'low',
    });
  }

  const generarHTML = () => {
    const fecha = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const filasCategorias = stats.categoriasOrdenadas
      .map(
        ([cat, count]) =>
          `<tr><td>${CATEGORIA_LABELS[cat] || cat}</td><td style="text-align:right">${count}</td></tr>`
      )
      .join('');

    const filasRiesgo = Object.entries(stats.riesgoCount)
      .filter(([, count]) => count > 0)
      .map(
        ([nivel, count]) =>
          `<tr><td style="text-transform:capitalize">${nivel}</td><td style="text-align:right">${count}</td></tr>`
      )
      .join('');

    const filasTendencia = stats.tendencia.labels
      .map(
        (label, i) =>
          `<tr><td>${label}</td><td style="text-align:right">${stats.tendencia.data[i]}</td></tr>`
      )
      .join('');

    const itemsRecomendaciones = recomendaciones
      .map((r) => `<li><strong>${r.title}:</strong> ${r.description}</li>`)
      .join('');

    return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #1f2937; padding: 24px; }
          h1 { color: #dc2626; margin-bottom: 4px; }
          .subtitle { color: #6b7280; margin-bottom: 24px; font-size: 13px; }
          .kpis { display: flex; gap: 12px; margin-bottom: 8px; }
          .kpi { flex: 1; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; text-align: center; }
          .kpi .value { font-size: 22px; font-weight: bold; }
          .kpi .label { font-size: 11px; color: #6b7280; }
          h2 { font-size: 15px; border-bottom: 2px solid #dc2626; padding-bottom: 4px; margin-top: 26px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          td, th { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
          ul { padding-left: 18px; }
          li { margin-bottom: 6px; font-size: 12px; }
          .footer { margin-top: 32px; font-size: 10px; color: #9ca3af; text-align: center; }
        </style>
      </head>
      <body>
        <h1>📊 Dashboard de Inspecciones</h1>
        <div class="subtitle">Generado el ${fecha}</div>

        <div class="kpis">
          <div class="kpi"><div class="value">${stats.total}</div><div class="label">Total</div></div>
          <div class="kpi"><div class="value">${stats.aprobadas}</div><div class="label">Aprobadas</div></div>
          <div class="kpi"><div class="value">${stats.pendientes}</div><div class="label">Pendientes</div></div>
          <div class="kpi"><div class="value">${stats.rechazadas}</div><div class="label">Rechazadas</div></div>
        </div>

        <h2>Tasa de Aprobación</h2>
        <p>${stats.tasaAprobacion}% (${stats.aprobadas} de ${stats.total} inspecciones)</p>
        ${stats.confianzaPromedio !== null ? `<p>Confianza IA promedio: ${stats.confianzaPromedio}%</p>` : ''}

        ${filasCategorias ? `<h2>Inspecciones por Categoría</h2><table>${filasCategorias}</table>` : ''}
        ${filasRiesgo ? `<h2>Distribución de Riesgo</h2><table>${filasRiesgo}</table>` : ''}
        ${filasTendencia ? `<h2>Tendencia (últimos 6 meses)</h2><table>${filasTendencia}</table>` : ''}
        ${itemsRecomendaciones ? `<h2>Recomendaciones</h2><ul>${itemsRecomendaciones}</ul>` : ''}

        <div class="footer">SAFEVISION AI — Reporte generado automáticamente</div>
      </body>
    </html>`;
  };

  const handleExportarPDF = async () => {
    try {
      setExportando(true);

      // En Expo Go, el URI que entrega printToFileAsync a veces no calza
      // con el FileProvider interno de Expo Go y expo-sharing no puede
      // leerlo ("Not allowed to read file under given URL"), incluso si se
      // copia a otra carpeta. La forma confiable es pedirle el PDF en
      // base64 y escribirlo nosotros mismos con expo-file-system: así el
      // archivo queda creado por el mismo módulo que lo va a compartir.
      const { base64 } = await Print.printToFileAsync({
        html: generarHTML(),
        base64: true,
      });

      if (!base64) {
        throw new Error('No se pudo generar el contenido del PDF');
      }

      const destino = `${FileSystem.cacheDirectory}dashboard-${Date.now()}.pdf`;
      await FileSystem.writeAsStringAsync(destino, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const disponible = await Sharing.isAvailableAsync();
      if (disponible) {
        await Sharing.shareAsync(destino, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir Dashboard PDF',
        });
      } else {
        Alert.alert('PDF generado', `Guardado en: ${destino}`);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo generar el PDF: ' + err.message);
    } finally {
      setExportando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <LinearGradient colors={colors.gradient.primary} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>📊 Dashboard</Text>
            <Text style={styles.headerSubtitle}>Estadísticas y Análisis</Text>
          </View>
          {hayDatos && (
            <TouchableOpacity
              style={styles.exportButton}
              onPress={handleExportarPDF}
              disabled={exportando}
            >
              {exportando ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.exportButtonText}>📄 PDF</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {!hayDatos ? (
          <View style={[styles.card, { backgroundColor: theme.card, alignItems: 'center', paddingVertical: 40 }]}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📭</Text>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Aún no hay inspecciones</Text>
            <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 4 }}>
              Cuando registres inspecciones, sus estadísticas aparecerán aquí.
            </Text>
          </View>
        ) : (
          <>
            {/* KPIs principales */}
            <View style={styles.kpisContainer}>
              <StatCard label="Total" value={stats.total} icon="📋" color={colors.primary} />
              <StatCard label="Aprobadas" value={stats.aprobadas} icon="✅" color={colors.risk.bajo} />
              <StatCard label="Pendientes" value={stats.pendientes} icon="⏳" color={colors.risk.medio} />
              <StatCard label="Rechazadas" value={stats.rechazadas} icon="❌" color={colors.risk.critico} />
            </View>

            {/* Tasa de Aprobación */}
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>✅ Tasa de Aprobación</Text>
              <View style={styles.aprobacionContainer}>
                <View style={styles.percentageCircle}>
                  <Text style={styles.percentageText}>{stats.tasaAprobacion}%</Text>
                </View>
                <View style={styles.aprobacionInfo}>
                  <Text style={[styles.aprobacionLabel, { color: theme.textSecondary }]}>
                    {stats.aprobadas} de {stats.total} inspecciones aprobadas
                  </Text>
                  <ProgressBar value={stats.tasaAprobacion} />
                  {stats.confianzaPromedio !== null && (
                    <Text style={[styles.aprobacionSubtext, { color: theme.textSecondary }]}>
                      Confianza IA promedio: {stats.confianzaPromedio}%
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Gráfico: Inspecciones por Categoría */}
            {dataPorCategoria.labels.length > 0 && (
              <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>📊 Inspecciones por Categoría</Text>
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
            )}

            {/* Gráfico: Distribución de Riesgo */}
            {dataRiesgo.length > 0 && (
              <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>⚠️ Distribución de Riesgo</Text>
                <PieChart
                  data={dataRiesgo}
                  width={screenWidth - 48}
                  height={220}
                  chartConfig={{ color: () => theme.textSecondary }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  style={styles.chart}
                />
              </View>
            )}

            {/* Gráfico: Tendencia */}
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>📈 Tendencia (últimos 6 meses)</Text>
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
            {recomendaciones.length > 0 && (
              <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>💡 Recomendaciones</Text>
                {recomendaciones.map((rec, index) => (
                  <RecommendationItem key={index} {...rec} />
                ))}
              </View>
            )}
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Componentes auxiliares
function StatCard({ label, value, icon, color }) {
  return (
    <LinearGradient colors={[color, color + 'DD']} style={styles.statCard}>
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
        style={[styles.progressBarFill, { width: `${value}%`, backgroundColor: colors.risk.bajo }]}
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
    <View style={[styles.recommendationItem, { borderLeftColor: getPriorityColor() }]}>
      <View style={styles.recommendationContent}>
        <Text style={styles.recommendationTitle}>{title}</Text>
        <Text style={styles.recommendationDescription}>{description}</Text>
      </View>
      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() + '20' }]}>
        <Text style={[styles.priorityText, { color: getPriorityColor() }]}>
          {priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  loadingText: { marginTop: 16, fontSize: 16, textAlign: 'center' },
  errorIcon: { fontSize: 48 },
  retryButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  retryButtonText: { color: '#fff', fontWeight: 'bold' },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#fff', opacity: 0.9 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exportButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    minWidth: 64,
    alignItems: 'center',
  },
  exportButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  content: { padding: 16, paddingBottom: 40 },
  kpisContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
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
  statIcon: { fontSize: 32, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 12, color: '#fff', opacity: 0.9, marginTop: 4 },
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
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  aprobacionContainer: { flexDirection: 'row', alignItems: 'center', gap: 20 },
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
  percentageText: { fontSize: 36, fontWeight: 'bold', color: colors.primary },
  aprobacionInfo: { flex: 1 },
  aprobacionLabel: { fontSize: 13, marginBottom: 12 },
  progressBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 4 },
  aprobacionSubtext: { fontSize: 12, marginTop: 8 },
  chart: { borderRadius: 12, marginVertical: 8 },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  recommendationContent: { flex: 1 },
  recommendationTitle: { fontSize: 13, fontWeight: '700', color: '#1f2937', marginBottom: 4 },
  recommendationDescription: { fontSize: 12, color: '#6b7280', lineHeight: 16 },
  priorityBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  priorityText: { fontWeight: '600', fontSize: 12 },
});