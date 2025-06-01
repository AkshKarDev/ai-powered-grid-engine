
import React, { createContext, useContext, ReactNode } from 'react';
import { GridTheme } from '@/types/grid';

const defaultTheme: GridTheme = {
  name: 'default',
  colors: {
    background: '#ffffff',
    headerBackground: '#f9fafb',
    rowBackground: '#ffffff',
    alternateRowBackground: '#f9fafb',
    selectedRowBackground: '#dbeafe',
    groupRowBackground: '#f3f4f6',
    borderColor: '#e5e7eb',
    textColor: '#111827',
    headerTextColor: '#374151',
    selectedTextColor: '#1e40af',
  },
  spacing: {
    cellPadding: '12px',
    headerPadding: '12px',
  },
  typography: {
    fontSize: '14px',
    fontWeight: '400',
    headerFontWeight: '500',
  },
};

const darkTheme: GridTheme = {
  name: 'dark',
  colors: {
    background: '#1f2937',
    headerBackground: '#111827',
    rowBackground: '#1f2937',
    alternateRowBackground: '#374151',
    selectedRowBackground: '#1e40af',
    groupRowBackground: '#374151',
    borderColor: '#4b5563',
    textColor: '#f9fafb',
    headerTextColor: '#e5e7eb',
    selectedTextColor: '#ffffff',
  },
  spacing: {
    cellPadding: '12px',
    headerPadding: '12px',
  },
  typography: {
    fontSize: '14px',
    fontWeight: '400',
    headerFontWeight: '500',
  },
};

const compactTheme: GridTheme = {
  name: 'compact',
  colors: {
    background: '#ffffff',
    headerBackground: '#f8fafc',
    rowBackground: '#ffffff',
    alternateRowBackground: '#f8fafc',
    selectedRowBackground: '#e0f2fe',
    groupRowBackground: '#f1f5f9',
    borderColor: '#e2e8f0',
    textColor: '#0f172a',
    headerTextColor: '#334155',
    selectedTextColor: '#0369a1',
  },
  spacing: {
    cellPadding: '8px',
    headerPadding: '8px',
  },
  typography: {
    fontSize: '13px',
    fontWeight: '400',
    headerFontWeight: '500',
  },
};

const modernTheme: GridTheme = {
  name: 'modern',
  colors: {
    background: '#ffffff',
    headerBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    rowBackground: '#ffffff',
    alternateRowBackground: '#fafbfc',
    selectedRowBackground: '#e8f4f8',
    groupRowBackground: '#f0f9ff',
    borderColor: '#e1e5e9',
    textColor: '#2d3748',
    headerTextColor: '#ffffff',
    selectedTextColor: '#2b6cb0',
  },
  spacing: {
    cellPadding: '16px',
    headerPadding: '16px',
  },
  typography: {
    fontSize: '14px',
    fontWeight: '400',
    headerFontWeight: '600',
  },
};

export const themes = {
  default: defaultTheme,
  dark: darkTheme,
  compact: compactTheme,
  modern: modernTheme,
};

const GridThemeContext = createContext<{
  theme: GridTheme;
  setTheme: (themeName: keyof typeof themes) => void;
}>({
  theme: defaultTheme,
  setTheme: () => {},
});

export const useGridTheme = () => useContext(GridThemeContext);

interface GridThemeProviderProps {
  children: ReactNode;
  initialTheme?: keyof typeof themes;
}

export const GridThemeProvider: React.FC<GridThemeProviderProps> = ({
  children,
  initialTheme = 'default',
}) => {
  const [currentTheme, setCurrentTheme] = React.useState<GridTheme>(
    themes[initialTheme]
  );

  const setTheme = (themeName: keyof typeof themes) => {
    setCurrentTheme(themes[themeName]);
  };

  return (
    <GridThemeContext.Provider value={{ theme: currentTheme, setTheme }}>
      {children}
    </GridThemeContext.Provider>
  );
};
