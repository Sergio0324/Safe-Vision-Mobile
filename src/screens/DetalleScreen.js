import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { validarInspeccion } from '../services/api';
import { colors, themes } from '../styles/colors';
import {
  getCategoria,
  getFecha,
  getNivelRiesgo,
  getFotoUrl,
  getDatosIA,
  getIncumplimientos,
  getAccionesSugeridas,
  getConfianza,
  getConfianzaColor,
  formatEtiqueta,
  formatValor,
} from './inspecciones';

const theme = themes.dark;

export default function DetalleScreenPremium({ route, navigation }) {
  const params = route?.params || {};
  const inspeccion = params?.inspeccion || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [notasEdit, setNotasEdit] = useState(inspeccion.notas || '');
  const [estado, setEstado] = useState(inspeccion.estado || 'pendiente');
  const [fotoZoom, setFotoZoom] = useState(null);
  const [guardandoEstado, setGuardandoEstado] = useState(false);

  const categoria = getCategoria(inspeccion);
  const fecha = getFecha(inspeccion);
  const nivelRiesgo = getNivelRiesgo(inspeccion);
  const fotoUrl = getFotoUrl(inspeccion);
  const datosIA = getDatosIA(inspeccion);
  const incumplimientos = getIncumplimientos(inspeccion);
  const accionesSugeridas = getAccionesSugeridas(inspeccion);
  const confianza = getConfianza(inspeccion);

  // Guarda el nuevo estado en la base de datos (PUT /inspecciones/:id) y
  // solo actualiza la UI si el backend confirma el cambio.
  const actualizarEstado = async (nuevoEstado, datosExtra = {}) => {
    if (!inspeccion.id) {
      Alert.alert('Error', 'No se encontró el ID de la inspección');
      return;
    }
    try {
      setGuardandoEstado(true);
      const resultado = await actualizarInspeccion(inspeccion.id, {
        estado: nuevoEstado,
        ...datosExtra,
      });
      if (resultado.success) {
        setEstado(nuevoEstado);
        if (datosExtra.notas) setNotasEdit(datosExtra.notas);
        const mensajes = {
          aprobado: ['✅ Aprobada', 'Se ha validado correctamente'],
          rechazado: ['❌ Rechazada', 'Se ha registrado el rechazo'],
          revisando: ['⏳ En Revisión', 'Se marcó para revisión manual'],
        };
        const [titulo, texto] = mensajes[nuevoEstado] || ['Actualizado', ''];
        Alert.alert(titulo, texto);
      } else {
        Alert.alert('Error', resultado.error || 'No se pudo actualizar el estado');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el estado: ' + err.message);
    } finally {
      setGuardandoEstado(false);
    }
  };

  const handleAprobar = async () => {
    await actualizarEstado('aprobado');
  };

  const handleRechazar = () => {
    Alert.prompt('Rechazar Inspección', 'Motivo del rechazo:', async (text) => {
      if (text) {
        await actualizarEstado('rechazado', { notas: text });
      }
    });
  };

  const handleEnRevision = async () => {
    await actualizarEstado('revisando');
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
          <Text style={styles.headerTitle}>{categoria || 'Inspección'}</Text>
          <Text style={styles.headerDate}>
            📅 {fecha?.split('T')[0] || 'Sin fecha'}
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
        {fotoUrl && (
          <TouchableOpacity
            style={[styles.fotoContainer, { backgroundColor: theme.card }]}
            onPress={() => setFotoZoom(fotoUrl)}
          >
            <Image
              source={{ uri: fotoUrl }}
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

          {confianza !== null && (
            <View style={styles.puntajeContainer}>
              <View
                style={[
                  styles.puntajeCircle,
                  {
                    borderColor: getConfianzaColor(confianza, colors),
                    backgroundColor: getConfianzaColor(confianza, colors) + '20',
                  },
                ]}
              >
                <Text style={[styles.puntajeText, { color: getConfianzaColor(confianza, colors) }]}>
                  {confianza}%
                </Text>
              </View>
              <Text style={[styles.puntajeLabel, { color: theme.textSecondary }]}>
                Confianza del análisis IA
              </Text>
              {confianza < 50 && (
                <Text style={[styles.puntajeAlerta, { color: colors.risk.critico }]}>
                  ⚠️ Confianza baja — se recomienda revisión manual
                </Text>
              )}
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Nivel de Riesgo:
            </Text>
            <View
              style={[
                styles.riskBadge,
                {
                  backgroundColor: getRiskColor(nivelRiesgo) + '20',
                  borderColor: getRiskColor(nivelRiesgo),
                },
              ]}
            >
              <Text
                style={[
                  styles.riskText,
                  { color: getRiskColor(nivelRiesgo) },
                ]}
              >
                {nivelRiesgo?.toUpperCase() || 'SIN EVALUAR'}
              </Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Categoría:
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {categoria}
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

        {/* Detalle del Análisis IA (datos específicos de la categoría) */}
        {datosIA && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              🤖 Análisis IA Completo
            </Text>
            {Object.entries(datosIA)
              .filter(([clave]) => clave !== 'observaciones')
              .map(([clave, valor]) => (
                <View key={clave} style={styles.datoRow}>
                  <Text style={[styles.datoLabel, { color: theme.textSecondary }]}>
                    {formatEtiqueta(clave)}
                  </Text>
                  <Text style={[styles.datoValue, { color: theme.text }]}>
                    {formatValor(valor)}
                  </Text>
                </View>
              ))}

            {datosIA.observaciones && (
              <View style={styles.analysisSection}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                  Observaciones:
                </Text>
                <View
                  style={[
                    styles.hallazgoBox,
                    { backgroundColor: theme.surface, borderLeftColor: colors.primary },
                  ]}
                >
                  <Text style={[styles.hallazgoText, { color: theme.text }]}>
                    {datosIA.observaciones}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Incumplimientos */}
        {incumplimientos.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              ⚠️ Incumplimientos Detectados
            </Text>
            {incumplimientos.map((inc, index) => {
              const esObjeto = typeof inc === 'object' && inc !== null;
              const tipo = esObjeto ? inc.tipo : inc;
              const riesgo = esObjeto ? inc.riesgo : null;
              const norma = esObjeto ? inc.norma : null;
              const revisionManual = esObjeto ? inc.requiere_revision_manual : false;

              return (
                <View
                  key={index}
                  style={[
                    styles.incumplimientoCard,
                    { borderLeftColor: getRiskColor(riesgo) },
                  ]}
                >
                  <View style={styles.incumplimientoHeader}>
                    <Text style={[styles.incumplimientoTipo, { color: theme.text }]}>
                      {formatEtiqueta(tipo || 'Incumplimiento')}
                    </Text>
                    {riesgo && (
                      <View
                        style={[
                          styles.miniBadge,
                          { backgroundColor: getRiskColor(riesgo) + '20', borderColor: getRiskColor(riesgo) },
                        ]}
                      >
                        <Text style={[styles.miniBadgeText, { color: getRiskColor(riesgo) }]}>
                          {riesgo.toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  {norma && (
                    <Text style={[styles.normaText, { color: theme.textSecondary }]}>
                      📚 {norma}
                    </Text>
                  )}
                  {revisionManual && (
                    <Text style={[styles.revisionManualText, { color: colors.risk.medio }]}>
                      🔍 Requiere revisión manual
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Acciones Sugeridas */}
        {accionesSugeridas.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              💡 Plan de Acción Recomendado
            </Text>
            {accionesSugeridas.map((accion, index) => (
              <View key={index} style={styles.incumplimientoItem}>
                <View style={[styles.incumplimientoDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.incumplimientoText, { color: theme.text }]}>
                  {accion}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Metadatos de gestión */}
        {(inspeccion.fecha_limite || inspeccion.validado_por || inspeccion.fecha_validacion || inspeccion.responsable_id) && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              🗂️ Gestión y Seguimiento
            </Text>
            {inspeccion.responsable_id && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Responsable:</Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                  {inspeccion.responsable_id.substring(0, 8)}...
                </Text>
              </View>
            )}
            {inspeccion.fecha_limite && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Fecha límite:</Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                  {inspeccion.fecha_limite.split('T')[0]}
                </Text>
              </View>
            )}
            {inspeccion.validado_por && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Validado por:</Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                  {inspeccion.validado_por.substring(0, 8)}...
                </Text>
              </View>
            )}
            {inspeccion.fecha_validacion && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Fecha validación:</Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                  {inspeccion.fecha_validacion.split('T')[0]}
                </Text>
              </View>
            )}
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
            style={[styles.actionButton, styles.rejectButton, guardandoEstado && styles.actionButtonDisabled]}
            onPress={handleRechazar}
            disabled={guardandoEstado}
          >
            <Text style={styles.actionButtonText}>❌ Rechazar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.reviewButton, guardandoEstado && styles.actionButtonDisabled]}
            onPress={handleEnRevision}
            disabled={guardandoEstado}
          >
            {guardandoEstado ? (
              <ActivityIndicator size="small" color={colors.risk.medio} />
            ) : (
              <Text style={styles.actionButtonText}>⏳ En Revisión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton, guardandoEstado && styles.actionButtonDisabled]}
            onPress={handleAprobar}
            disabled={guardandoEstado}
          >
            {guardandoEstado ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.approveButtonText}>✅ Aprobar</Text>
            )}
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
  puntajeContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  puntajeCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  puntajeText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  puntajeLabel: {
    fontSize: 12,
  },
  puntajeAlerta: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
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
  datoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.15)',
  },
  datoLabel: {
    fontSize: 13,
    flex: 1,
  },
  datoValue: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  analysisSection: {
    marginTop: 12,
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
  incumplimientoCard: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'rgba(148,163,184,0.08)',
  },
  incumplimientoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  incumplimientoTipo: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  miniBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  miniBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  normaText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  revisionManualText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
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
    justifyContent: 'center',
    fontWeight: '600',
  },
  actionButtonDisabled: {
    opacity: 0.5,
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