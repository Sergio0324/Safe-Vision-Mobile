import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { crearInspeccion } from '../services/api';
import { colors } from '../styles/colors';

const SEDE_ID = '550e8400-e29b-41d4-a716-446655440000';

const CATEGORIAS = [
  { id: 'extintores', nombre: 'Extintores', icono: '🧯', color: '#dc2626' },
  { id: 'senalizacion', nombre: 'Señalización', icono: '⚠️', color: '#f59e0b' },
  { id: 'equipos_emergencia', nombre: 'Equipos Emergencia', icono: '🚑', color: '#3b82f6' },
  { id: 'epp', nombre: 'Protección Personal', icono: '🦺', color: '#8b5cf6' },
  { id: 'epcc', nombre: 'Protección Caídas', icono: '🪂', color: '#ec4899' },
  { id: 'trabajo_caliente', nombre: 'Trabajo Caliente', icono: '🔥', color: '#f97316' },
  { id: 'izaje_cargas', nombre: 'Izaje Cargas', icono: '🏗️', color: '#06b6d4' },
  { id: 'espacios_confinados', nombre: 'Espacios Confinados', icono: '⚫', color: '#64748b' },
  { id: 'trabajo_electrico', nombre: 'Riesgo Eléctrico', icono: '⚡', color: '#eab308' },
  { id: 'sustancias_quimicas', nombre: 'Sustancias Químicas', icono: '🧪', color: '#10b981' },
];

export default function CapturaScreenFinal({ navigation }) {
  const cameraRef = useRef(null);

  // Hook de Permisos de Cámara para Expo SDK 51+
  const [permission, requestPermission] = useCameraPermissions();

  // Estados
  const [paso, setPaso] = useState(1);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  // ===== PASO 1: Seleccionar Categoría =====
  const handleContinuar = async () => {
    if (!categoriaSeleccionada) {
      Alert.alert('Error', 'Selecciona una categoría');
      return;
    }

    // Solicitar permiso de cámara si no ha sido otorgado
    if (!permission?.granted) {
      const status = await requestPermission();
      if (!status.granted) {
        Alert.alert('Permiso denegado', 'Se requiere acceso a la cámara para tomar fotos de la inspección.');
        return;
      }
    }

    setPaso(2);
  };

  // ===== PASO 2: Tomar Foto =====
  const handleTakePicture = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'Cámara no lista');
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo?.uri) {
        setPhotoUri(photo.uri);
        setPaso(3);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo capturar la foto: ' + error.message);
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
        setPaso(3);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al seleccionar imagen: ' + error.message);
    }
  };

  const handleRetomar = () => {
    setPhotoUri(null);
    setPaso(2);
  };

  // ===== PASO 3: Descripción =====
  const handleContinuarDescripcion = () => {
    if (!descripcion.trim()) {
      Alert.alert('Error', 'Agrega una descripción');
      return;
    }
    setPaso(4);
  };

  // ===== PASO 4: Enviar =====
 const handleEnviar = async () => {
    if (!photoUri || !categoriaSeleccionada || !descripcion) {
      Alert.alert('Error', 'Faltan datos requeridos');
      return;
    }

    setLoading(true);
    try {
      const resultado = await crearInspeccion({
  sede_id: SEDE_ID,
  categoria: categoriaSeleccionada.id,
  ubicacion_descripcion: descripcion.trim(),
  photoUri: photoUri,
});
      if (resultado.success) {
        Alert.alert('Éxito', 'Inspección creada correctamente');
        navigation.goBack(); // O navega a la lista
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleVolver = () => {
    if (paso === 1) {
      navigation.goBack();
    } else if (paso === 2) {
      setPaso(1);
    } else if (paso === 3) {
      setPaso(2);
    } else if (paso === 4) {
      setPaso(3);
    }
  };

  // RENDER PASO 1
  // ===== PASO 1: Categorías =====
  if (paso === 1) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={colors.gradient.primary} style={styles.header}>
          <Text style={styles.headerTitle}>📸 Nueva Inspección</Text>
          <Text style={styles.headerSubtitle}>Paso 1 de 4: Selecciona categoría</Text>
        </LinearGradient>

        {/* Flex 1 aquí asegura que la lista empuje los botones hacia abajo, pero sin pasarse */}
        <View style={styles.mainContent}>
          <FlatList
            data={CATEGORIAS}
            numColumns={2}
            style={{ flex: 1 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoriaItem,
                  categoriaSeleccionada?.id === item.id && styles.categoriaItemSelected,
                ]}
                onPress={() => setCategoriaSeleccionada(item)}
              >
                <LinearGradient
                  colors={[item.color, item.color + '80']}
                  style={[
                    styles.categoriaGradient,
                    categoriaSeleccionada?.id === item.id && { borderWidth: 3, borderColor: '#fff' }
                  ]}
                >
                  <Text style={styles.categoriaIcon}>{item.icono}</Text>
                </LinearGradient>
                <Text
                  style={[
                    styles.categoriaNombre,
                    categoriaSeleccionada?.id === item.id && styles.categoriaNombreSelected,
                  ]}
                >
                  {item.nombre}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContent}
          />
        </View>

        {/* ¡AQUÍ ESTÁ LA CLAVE! Agregamos paddingBottom para esquivar tu menú inferior */}
        <View style={[styles.buttonContainer, { paddingBottom: 80 }]}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleVolver}
          >
            <Text style={styles.buttonText}>← Atrás</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              !categoriaSeleccionada && styles.buttonDisabled,
            ]}
            onPress={handleContinuar}
            disabled={!categoriaSeleccionada}
          >
            <Text style={styles.buttonText}>Continuar →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  // RENDER PASO 2
 // ===== PASO 2: Cámara =====
  if (paso === 2) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={colors.gradient.primary} style={styles.header}>
          <Text style={styles.headerTitle}>📸 Nueva Inspección</Text>
          <Text style={styles.headerSubtitle}>
            Paso 2 de 4: {categoriaSeleccionada?.nombre}
          </Text>
        </LinearGradient>

        <View style={styles.mainContent}>
          {!permission?.granted ? (
            <View style={styles.permissionContainer}>
              <Text style={styles.infoText}>Se necesita permiso para acceder a la cámara</Text>
              <TouchableOpacity style={[styles.button, styles.buttonPrimary, { marginTop: 12 }]} onPress={requestPermission}>
                <Text style={styles.buttonText}>Otorgar Permisos</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cameraContainer}>
              <CameraView style={styles.camera} ref={cameraRef} facing="back" />
            </View>
          )}
        </View>

        {/* PaddingBottom agregado para subir los botones de la cámara */}
        <View style={[styles.buttonContainer, { paddingBottom: 80 }]}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleVolver}
          >
            <Text style={styles.buttonText}>← Atrás</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonCapture]}
            onPress={handleTakePicture}
          >
            <Text style={styles.buttonText}>📷 Capturar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonGallery]}
            onPress={handlePickImage}
          >
            <Text style={styles.buttonText}>🖼️ Galería</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ===== PASO 3: Descripción =====
  if (paso === 3) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={colors.gradient.primary} style={styles.header}>
          <Text style={styles.headerTitle}>📝 Nueva Inspección</Text>
          <Text style={styles.headerSubtitle}>Paso 3 de 4: Descripción</Text>
        </LinearGradient>

        <View style={styles.mainContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📸 Foto Capturada</Text>
              {photoUri && <Image source={{ uri: photoUri }} style={styles.photoPreview} />}
              <TouchableOpacity
                style={styles.changePhotoButton}
                onPress={handleRetomar}
              >
                <Text style={styles.changePhotoText}>🔄 Retomar foto</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 Categoría</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  {categoriaSeleccionada?.icono} {categoriaSeleccionada?.nombre}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✍️ Descripción *</Text>
              <Text style={styles.hint}>
                Describe qué ves o qué se está inspeccionando
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: Extintores sin manómetro en pared norte..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={5}
                value={descripcion}
                onChangeText={setDescripcion}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{descripcion.length} caracteres</Text>
            </View>
          </ScrollView>
        </View>

        {/* PaddingBottom agregado para subir los botones */}
        <View style={[styles.buttonContainer, { paddingBottom: 80 }]}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleVolver}
          >
            <Text style={styles.buttonText}>← Atrás</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              !descripcion.trim() && styles.buttonDisabled,
            ]}
            onPress={handleContinuarDescripcion}
            disabled={!descripcion.trim()}
          >
            <Text style={styles.buttonText}>Continuar →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ===== PASO 4: Resumen =====
  if (paso === 4) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={colors.gradient.primary} style={styles.header}>
          <Text style={styles.headerTitle}>✅ Resumen</Text>
          <Text style={styles.headerSubtitle}>Paso 4 de 4: Enviar para análisis</Text>
        </LinearGradient>

        <View style={styles.mainContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📸 Foto</Text>
              {photoUri && <Image source={{ uri: photoUri }} style={styles.photoPreview} />}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 Categoría</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  {categoriaSeleccionada?.icono} {categoriaSeleccionada?.nombre}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✍️ Descripción</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>{descripcion}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🤖 La IA Analizará:</Text>
              <View style={styles.benefitsList}>
                <BenefitItem icon="📋" text="Hallazgo detallado" />
                <BenefitItem icon="⚠️" text="Nivel de riesgo" />
                <BenefitItem icon="📚" text="Normas aplicables" />
                <BenefitItem icon="💡" text="Plan de acción" />
                <BenefitItem icon="✅" text="Incumplimientos" />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* PaddingBottom agregado para subir los botones */}
        <View style={[styles.buttonContainer, { paddingBottom: 80 }]}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleVolver}
            disabled={loading}
          >
            <Text style={styles.buttonText}>← Atrás</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonAnalyze]}
            onPress={handleEnviar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🚀 Analizar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  } 
r}

function BenefitItem({ icon, text }) {
  return (
    <View style={styles.benefitItem}>
      <Text style={styles.benefitIcon}>{icon}</Text>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
  },
 mainContent: {
    flex: 1, // Mantiene el contenido ocupando el espacio intermedio
  },
  flatListContent: {
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 20, // Da margen suficiente al scroll
  },
  categoriaGradientSelected: {
    borderWidth: 3,
    borderColor: '#ffffff', // Borde blanco visible al seleccionar
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    // Asegura que no quede tapado por la barra inferior
    paddingBottom: 16, 
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  flatListContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  categoriaItem: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  categoriaItemSelected: {
    opacity: 1,
  },
  categoriaGradient: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  categoriaIcon: {
    fontSize: 32,
  },
  categoriaNombre: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cbd5e1',
    textAlign: 'center',
  },
  categoriaNombreSelected: {
    color: colors.primary || '#3b82f6',
    fontWeight: '700',
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  changePhotoText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  infoBox: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary || '#3b82f6',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1e293b',
    color: '#fff',
    borderWidth: 2,
    borderColor: colors.primary || '#3b82f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    minHeight: 100,
  },
  charCount: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
    textAlign: 'right',
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary || '#3b82f6',
  },
  benefitIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  benefitText: {
    color: '#cbd5e1',
    fontSize: 12,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.primary || '#3b82f6',
  },
  buttonSecondary: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#555',
  },
  buttonCapture: {
    backgroundColor: colors.primary || '#3b82f6',
  },
  buttonGallery: {
    backgroundColor: '#7c3aed',
  },
  buttonAnalyze: {
    backgroundColor: '#10b981',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 13,
  },
});