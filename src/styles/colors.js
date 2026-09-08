// 🎨 SAFEVISION AI - Colores Premium para Gala

export const colors = {
  // Colores principales
  primary: '#dc2626',      // Rojo vibrante
  secondary: '#0f172a',    // Azul oscuro profundo
  accent: '#f59e0b',       // Ámbar
  success: '#10b981',      // Verde
  warning: '#f97316',      // Naranja
  danger: '#ef4444',       // Rojo puro
  
  // Neutros
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Gradientes
  gradient: {
    primary: ['#dc2626', '#991b1b'],
    success: ['#10b981', '#047857'],
    warning: ['#f59e0b', '#d97706'],
    danger: ['#ef4444', '#dc2626'],
  },
  
  // Estados de riesgo
  risk: {
    critico: '#ef4444',
    alto: '#f59e0b',
    medio: '#fbbf24',
    bajo: '#10b981',
  },
  
  // Estados de validación
  status: {
    pendiente: '#6b7280',
    revisando: '#f59e0b',
    aprobado: '#10b981',
    rechazado: '#ef4444',
  },
};

// Temas
export const themes = {
  dark: {
    bg: colors.gray[900],
    bgSecondary: colors.gray[800],
    text: colors.white,
    textSecondary: colors.gray[400],
    border: colors.gray[700],
    card: colors.gray[800],
    surface: colors.gray[900],
  },
  light: {
    bg: colors.white,
    bgSecondary: colors.gray[50],
    text: colors.gray[900],
    textSecondary: colors.gray[600],
    border: colors.gray[200],
    card: colors.white,
    surface: colors.gray[50],
  },
};

export default colors;
