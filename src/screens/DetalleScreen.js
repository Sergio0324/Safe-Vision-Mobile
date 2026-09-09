import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, themes } from '../styles/colors';

const theme = themes.dark;

export default function DetalleScreenPremium({ route, navigation }) {
  const params = route?.params || {};
  const inspeccion = params?.inspeccion || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [notasEdit, setNotasEdit] = useState(inspeccion.notas || '');
  const [estado, setEstado] = useState(inspeccion.estado || 'pendiente');
  const [fotoZoom, setFotoZoom] = useState(null);

  const handleAprobar = () => {
    setEstado('aprobado');
    Alert.alert('✅ Inspección Aprobada', 'Se ha validado correctamente');
  };

  const handleRechazar = () => {
    Alert.prompt('Rechazar Inspección', 'Motivo del rechazo:', (text) => {
      if (text) {
        setEstado('rechazado');
        Alert.alert('❌ Rechazada', 'Se ha registrado el rechazo');
      }
    });
  };

  const handleEditar = () => {
    setModalVisible(true);
  };

  const handleGuardarNotas = () => {
    setModalVisible(false);
    Alert.alert('✅ Guardado', 'Notas actualizadas');
  };

  const getStatusColor = () => {
    switch (estado) {
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

  const getStatusLabel = () => {
    switch (estado) {
      case 'aprobado':
        return '✅ APROBADO';
      case 'rechazado':
        return '❌ RECHAZADO';
      case 'revisando':
        return '⏳ EN REVISIÓN';
      default:
        return '⚪ PENDIENTE';
    }
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Header Gradiente */}
      <LinearGradient
        colors={colors.gradient.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{inspeccion.categoria || 'Inspección'}</Text>
          <Text style={styles.headerDate}>
            📅 {inspeccion.created_en?.split('T')[0] || 'Sin fecha'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Estado Visual */}
        <View
          style={[
            styles.statusCard,
            { borderLeftColor: getStatusColor() },
            { backgroundColor: theme.card },
          ]}
        >
          <View style={styles.statusHeader}>
            <Text style={[styles.statusLabel, { color: getStatusColor() }]}>
              {getStatusLabel()}
            </Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor() },
              ]}
            />
          </View>
          <Text style={[styles.statusSubtext, { color: theme.textSecondary }]}>
            Estado actual de validación
          </Text>
        </View>

        {/* Foto Principal */}
        {inspeccion.foto_url && (
          <TouchableOpacity
            style={[styles.fotoContainer, { backgroundColor: theme.card }]}
            onPress={() => setFotoZoom(inspeccion.foto_url)}
          >
            <Image
              source={{ uri: inspeccion.foto_url }}
              style={styles.foto}
            />
            <View style={styles.fotoOverlay}>
              <Text style={styles.fotoLabel}>🔍 Ver en grande</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Resumen Ejecutivo */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            📊 Resumen Ejecutivo
          </Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Nivel de Riesgo:
            </Text>
            <View
              style={[
                styles.riskBadge,
                {
                  backgroundColor: getRiskColor(inspeccion.nivel_riesgo) + '20',
                  borderColor: getRiskColor(inspeccion.nivel_riesgo),
                },
              ]}
            >
              <Text
                style={[
                  styles.riskText,
                  { color: getRiskColor(inspeccion.nivel_riesgo) },
                ]}
              >
                {inspeccion.nivel_riesgo?.toUpperCase() || 'SIN EVALUAR'}
              </Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Categoría:
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {inspeccion.categoria}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              ID Inspección:
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {inspeccion.id?.substring(0, 8)}...
            </Text>
          </View>
        </View>

        {/* Información General */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            ℹ️ Información General
          </Text>
          {inspeccion.created_at && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                Fecha Inspección:
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                {new Date(inspeccion.created_en).toLocaleString('es-CO')}
              </Text>
            </View>
          )}
          {inspeccion.ubicacion_descripcion && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                Ubicación:
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                {inspeccion.ubicacion_descripcion}
              </Text>
            </View>
          )}
          {inspeccion.estado && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                Estado Validación:
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                {inspeccion.estado?.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Análisis IA Completo */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            🤖 Análisis IA Completo
          </Text>
          {inspeccion.resultado_ia && (
            <View style={styles.analysisSection}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                Datos IA:
              </Text>
              <View
                style={[
                  styles.hallazgoBox,
                  { backgroundColor: theme.surface, borderLeftColor: colors.primary },
                ]}
              >
                <Text style={[styles.hallazgoText, { color: theme.text }]}>
                  {typeof inspeccion.resultado_ia === 'string'
                    ? inspeccion.resultado_ia
                    : JSON.stringify(inspeccion.resultado_ia, null, 2)}
                </Text>
              </View>
            </View>
          )}
          {inspeccion.descripcion && (
            <View style={styles.analysisSection}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                Descripción:
              </Text>
              <Text style={[styles.sectionText, { color: theme.text }]}>
                {inspeccion.descripcion}
              </Text>
            </View>
          )}
          {(inspeccion.hallazgo || inspeccion.hallazgo_texto) && (
            <View style={styles.analysisSection}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                Hallazgo Principal:
              </Text>
              <View
                style={[
                  styles.hallazgoBox,
                  { backgroundColor: theme.surface, borderLeftColor: colors.primary },
                ]}
              >
                <Text style={[styles.hallazgoText, { color: theme.text }]}>
                  {inspeccion.hallazgo_texto || inspeccion.hallazgo}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Incumplimientos */}
        {inspeccion.incumplimientos && inspeccion.incumplimientos.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              ⚠️ Incumplimientos Detectados
            </Text>
            {inspeccion.incumplimientos.map((inc, index) => (
              <View key={index} style={styles.incumplimientoItem}>
                <View
                  style={[
                    styles.incumplimientoDot,
                    { backgroundColor: colors.danger },
                  ]}
                />
                <Text style={[styles.incumplimientoText, { color: theme.text }]}>
                  {typeof inc === 'string' ? inc : inc.tipo || JSON.stringify(inc)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Plan de Acción */}
        {inspeccion.plan_accion && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              💡 Plan de Acción Recomendado
            </Text>
            <Text style={[styles.actionText, { color: theme.text }]}>
              {inspeccion.plan_accion}
            </Text>
          </View>
        )}

        {/* Normativas */}
        {inspeccion.norma && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              📚 Normativas Aplicables
            </Text>
            <Text style={[styles.normaText, { color: theme.text }]}>
              {inspeccion.norma}
            </Text>
          </View>
        )}

        {/* Notas */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.notasHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              📝 Notas y Observaciones
            </Text>
            <TouchableOpacity
              onPress={handleEditar}
              style={[styles.editButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.editButtonText}>✏️ Editar</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.notasText, { color: theme.textSecondary }]}>
            {notasEdit || 'Sin notas agregadas'}
          </Text>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={handleRechazar}
          >
            <Text style={styles.actionButtonText}>❌ Rechazar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.reviewButton]}
            onPress={() => setEstado('revisando')}
          >
            <Text style={styles.actionButtonText}>⏳ En Revisión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={handleAprobar}
          >
            <Text style={styles.approveButtonText}>✅ Aprobar</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal de Edición */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.surface }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>✕ Cerrar</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Editar Notas
            </Text>
            <TouchableOpacity onPress={handleGuardarNotas}>
              <Text style={styles.saveButton}>✓ Guardar</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[
              styles.textInput,
              { color: theme.text, borderColor: colors.primary },
            ]}
            placeholder="Escriba observaciones..."
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={10}
            value={notasEdit}
            onChangeText={setNotasEdit}
          />
        </SafeAreaView>
      </Modal>

      {/* Modal de Zoom de Foto */}
      <Modal visible={!!fotoZoom} animationType="fade">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <TouchableOpacity
            style={styles.zoomCloseButton}
            onPress={() => setFotoZoom(null)}
          >
            <Text style={styles.zoomCloseText}>✕ Cerrar</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: fotoZoom }}
            style={styles.zoomedImage}
            resizeMode="contain"
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
  headerContent: {
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusSubtext: {
    fontSize: 12,
    marginTop: 8,
  },
  fotoContainer: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    height: 300,
  },
  foto: {
    width: '100%',
    height: '100%',
  },
  fotoOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#00000040',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontWeight: '600',
    fontSize: 13,
  },
  riskBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  riskText: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  analysisSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  hallazgoBox: {
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
  },
  hallazgoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  incumplimientoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  incumplimientoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 6,
  },
  incumplimientoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  normaText: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  notasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  notasText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: colors.risk.critico + '20',
    borderWidth: 1.5,
    borderColor: colors.risk.critico,
  },
  reviewButton: {
    backgroundColor: colors.risk.medio + '20',
    borderWidth: 1.5,
    borderColor: colors.risk.medio,
  },
  approveButton: {
    backgroundColor: colors.risk.bajo,
  },
  actionButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },
  approveButtonText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    color: colors.risk.bajo,
    fontWeight: '600',
    fontSize: 14,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 16,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  zoomCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  zoomCloseText: {
    color: '#fff',
    fontWeight: '600',
  },
  zoomedImage: {
    width: '100%',
    height: '100%',
  },
});