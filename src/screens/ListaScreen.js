import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { listarInspecciones } from '../services/api';
import { colors, themes } from '../styles/colors';

const theme = themes.dark;
const SEDE_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function ListaScreenPremium({ navigation }) {
  const [inspecciones, setInspecciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filtro, setFiltro] = useState('todos');
  
  // CORRECCIÓN 1: Iniciamos con un arreglo vacío e incluimos setAnimatedValues
  const [animatedValues, setAnimatedValues] = useState([]);

  useEffect(() => {
    cargarInspecciones();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarInspecciones();
    });
    return unsubscribe;
  }, [navigation]);

  const cargarInspecciones = async () => {
    try {
      setCargando(true);
      setError(null);

      const resultado = await listarInspecciones(SEDE_ID);

      // CORRECCIÓN 2: Lógica de animación actualizada al recibir los datos
      if (resultado.success) {
        const newData = resultado.data || [];
        setInspecciones(newData);

        // Creamos un nuevo arreglo de valores en 0 para cada elemento
        const newAnimatedValues = newData.map(() => new Animated.Value(0));
        
        // Guardamos en el estado
        setAnimatedValues(newAnimatedValues);

        // Animamos cada card usando el nuevo arreglo
        newData.forEach((_, index) => {
          Animated.timing(newAnimatedValues[index], {
            toValue: 1,
            duration: 300 + index * 100,
            useNativeDriver: true,
          }).start();
        });
      } else {
        setError(resultado.error);
      }
    } catch (err) {
      setError('Error inesperado: ' + err.message);
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarInspecciones();
  };

  const getRiskColor = (nivel) => {
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

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'aprobado':
        return colors.risk.bajo;
      case 'rechazado':
        return colors.risk.critico;
      case 'revisando':
        return colors.risk.medio;
      default:
        return colors.gray[500];
    }
  };

  const filtrarInspecciones = () => {
    if (filtro === 'todos') return inspecciones;
    return inspecciones.filter((ins) => 
      ins.nivel_riesgo?.toLowerCase() === filtro.toLowerCase()
    );
  };

  if (cargando) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Cargando inspecciones...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorTitle, { color: theme.text }]}>
            Error de conexión
          </Text>
          <Text style={[styles.errorText, { color: theme.textSecondary }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={cargarInspecciones}
          >
            <Text style={styles.retryButtonText}>🔄 Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (inspecciones.length === 0) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
        <LinearGradient
          colors={colors.gradient.primary}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>📋 Mis Inspecciones</Text>
          <Text style={styles.headerSubtitle}>
            Total: {inspecciones.length}
          </Text>
        </LinearGradient>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Sin inspecciones
          </Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Aún no tienes inspecciones registradas.{'\n'}
            Crea una nueva desde la pantalla de inicio.
          </Text>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.createButtonText}>➕ Nueva Inspección</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      </ScrollView>
    );
  }

  const inspectionsFiltradas = filtrarInspecciones();

  // CORRECCIÓN 3: Ajuste en la función renderInspeccion
  const renderInspeccion = ({ item, index }) => {
    // Tomamos el valor animado del estado o forzamos 1 (visible) si no se encuentra
    const animValue = animatedValues[index] || new Animated.Value(1);

    return (
      <Animated.View
        style={{
          opacity: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
          transform: [
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={[
            styles.inspeccionCard,
            { backgroundColor: theme.card, borderLeftColor: getRiskColor(item.nivel_riesgo) },
          ]}
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('Detalle', {
              id: item.id,
              inspeccion: item,
            })
          }
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleSection}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {item.categoria || 'Inspección'}
              </Text>
              <Text style={[styles.cardDate, { color: theme.textSecondary }]}>
                📅 {item.created_en?.split('T')[0] || 'Sin fecha'}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.estado) + '20', borderColor: getStatusColor(item.estado) },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.estado) },
                ]}
              >
                {item.estado?.toUpperCase() || 'PENDIENTE'}
              </Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.riskSection}>
              <Text style={[styles.riskLabel, { color: theme.textSecondary }]}>
                Nivel de Riesgo:
              </Text>
              <View
                style={[
                  styles.riskBadge,
                  {
                    backgroundColor: getRiskColor(item.nivel_riesgo) + '20',
                    borderColor: getRiskColor(item.nivel_riesgo),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.riskBadgeText,
                    { color: getRiskColor(item.nivel_riesgo) },
                  ]}
                >
                  {item.nivel_riesgo?.toUpperCase() || 'SIN EVALUAR'}
                </Text>
              </View>
            </View>

            {item.descripcion && (
              <Text style={[styles.description, { color: theme.text }]} numberOfLines={2}>
                {item.descripcion}
              </Text>
            )}
          </View>

          <View style={styles.cardFooter}>
            <Text style={[styles.cardId, { color: theme.textSecondary }]}>
              ID: {item.id?.substring(0, 8)}...
            </Text>
            <View
              style={[
                styles.arrowIcon,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <Text style={styles.arrow}>→</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradient.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>📋 Mis Inspecciones</Text>
          <Text style={styles.headerSubtitle}>
            Total: {inspecciones.length} | Mostradas: {inspectionsFiltradas.length}
          </Text>
        </View>
        <TouchableOpacity onPress={cargarInspecciones} style={styles.refreshButton}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Filtros */}
      <View style={[styles.filtersContainer, { backgroundColor: theme.card }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.filtersList}
        >
          {['todos', 'bajo', 'medio', 'alto', 'critico'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterBadge,
                filtro === filter && styles.filterBadgeActive,
                filtro === filter && { backgroundColor: colors.primary },
              ]}
              onPress={() => setFiltro(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  filtro === filter && { color: '#fff' },
                ]}
              >
                {filter === 'todos' ? 'Todos' : filter.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista */}
      <FlatList
        data={inspectionsFiltradas}
        renderItem={renderInspeccion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  refreshIcon: {
    fontSize: 20,
  },
  filtersContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  filtersList: {
    paddingHorizontal: 8,
  },
  filterBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  filterBadgeActive: {
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 24,
  },
  inspeccionCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#8f0013',
  },
  cardTitleSection: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 11,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 12,
  },
  riskSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskLabel: {
    fontSize: 11,
  },
  riskBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#8d0000',
  },
  cardId: {
    fontSize: 10,
  },
  arrowIcon: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  arrow: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
});