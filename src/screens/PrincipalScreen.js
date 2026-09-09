import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/colors';
import { logo} from '../assets/logo.png';

export default function PrincipalScreenPremium({ navigation }) {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const pulseStyle = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 1],
    }),
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fondo con gradiente */}
      <LinearGradient
        colors={['#0f172a', '#1a1f35', '#0f172a']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      <Animated.View style={[styles.header, pulseStyle]}>
  
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>SAFEVISION AI</Text>
        <Text style={styles.subtitle}>
          Auditoría Inteligente de Seguridad
        </Text>
      </Animated.View>

        {/* Descripción breve */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
            Sistema de inspección de seguridad potenciado por Inteligencia Artificial
          </Text>
        </View>

        {/* Botones principales */}
        <View style={styles.mainButtonsContainer}>
          {/* Nueva Inspección */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Captura')}
          >
            <LinearGradient
              colors={colors.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonEmoji}>📸</Text>
              <View style={styles.buttonContent}>
                <Text style={styles.primaryButtonTitle}>
                  Nueva Inspección
                </Text>
                <Text style={styles.primaryButtonSubtitle}>
                  Analizar con IA
                </Text>
              </View>
              <Text style={styles.buttonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Ver Inspecciones */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Lista')}
          >
            <LinearGradient
              colors={['#1e40af', '#1e3a8a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonEmoji}>📋</Text>
              <View style={styles.buttonContent}>
                <Text style={styles.secondaryButtonTitle}>
                  Mis Inspecciones
                </Text>
                <Text style={styles.secondaryButtonSubtitle}>
                  Historial completo
                </Text>
              </View>
              <Text style={styles.buttonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Dashboard */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <LinearGradient
              colors={['#7c3aed', '#6d28d9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tertiaryButton}
            >
              <Text style={styles.tertiaryButtonEmoji}>📊</Text>
              <View style={styles.buttonContent}>
                <Text style={styles.tertiaryButtonTitle}>
                  Dashboard
                </Text>
                <Text style={styles.tertiaryButtonSubtitle}>
                  Estadísticas y análisis
                </Text>
              </View>
              <Text style={styles.buttonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Características */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresSectionTitle}>✨ Características</Text>
          <FeatureCard
            icon="🤖"
            title="IA Avanzada"
            description="Análisis automático con Inteligencia Artificial"
          />
          <FeatureCard
            icon="📸"
            title="Captura de Fotos"
            description="Toma fotos desde tu dispositivo"
          />
          <FeatureCard
            icon="✅"
            title="Validación"
            description="Aprueba, rechaza o revisa inspecciones"
          />
          <FeatureCard
            icon="📊"
            title="Gráficos"
            description="Visualiza estadísticas en tiempo real"
          />
          <FeatureCard
            icon="📝"
            title="Notas"
            description="Agrega observaciones a cada inspección"
          />
          <FeatureCard
            icon="📚"
            title="Normativas"
            description="Cumplimiento con regulaciones SG-SST"
          />
        </View>

        {/* Categorías */}
        <View style={styles.categoriesSection}>
          <Text style={styles.categoryTitle}>🎯 10 Categorías de Inspección</Text>
          <View style={styles.categoriesGrid}>
            <CategoryBadge icon="🧯" label="Extintores" />
            <CategoryBadge icon="⚠️" label="Señalización" />
            <CategoryBadge icon="🚑" label="Emergencia" />
            <CategoryBadge icon="🦺" label="EPP" />
            <CategoryBadge icon="🪂" label="Caídas" />
            <CategoryBadge icon="🔥" label="Trabajo Caliente" />
            <CategoryBadge icon="🏗️" label="Izaje" />
            <CategoryBadge icon="⚫" label="Confinado" />
            <CategoryBadge icon="⚡" label="Eléctrico" />
            <CategoryBadge icon="🧪" label="Químicos" />
          </View>
        </View>

        {/* Info Footer */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Datos Importantes</Text>
          <Text style={styles.infoText}>
            ✓ Aplicación de análisis de seguridad
          </Text>
          <Text style={styles.infoText}>
            ✓ Conectada a backend en tiempo real
          </Text>
          <Text style={styles.infoText}>
            ✓ Almacenamiento en base de datos segura
          </Text>
          <Text style={styles.infoText}>
            ✓ Reportes automáticos de normativas
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

function CategoryBadge({ icon, label }) {
  return (
    <View style={styles.categoryBadge}>
      <Text style={styles.categoryIcon}>{icon}</Text>
      <Text style={styles.categoryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  descriptionBox: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  descriptionText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  mainButtonsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 4,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  tertiaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  secondaryButtonEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  tertiaryButtonEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  buttonContent: {
    flex: 1,
  },
  primaryButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  primaryButtonSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  secondaryButtonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButtonSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  tertiaryButtonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  tertiaryButtonSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  buttonArrow: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 12,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#94a3b8',
  },
  categoriesSection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryBadge: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cbd5e1',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
    marginBottom: 6,
  },
  logo: {
  width: 140,
  height: 140,
  marginBottom: 10,
  alignSelf: 'center',
  },
});
