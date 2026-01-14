# Integração com App Mobile (React Native Expo + Supabase)

Este documento serve como guia para o desenvolvimento do aplicativo mobile que consumirá os dados da plataforma CMS.

## 1. Configuração do Supabase no Expo

Instale as dependências necessárias no seu projeto Expo:

```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

Configure o cliente Supabase:

```typescript
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'SUA_SUPABASE_URL';
const supabaseAnonKey = 'SUA_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

## 2. Estrutura de Dados e Queries Recomendadas

Para o aplicativo mobile, você deve buscar apenas os dados **publicados**. Abaixo estão as queries recomendadas.

### buscar Configurações do Projeto (Temas e Menus)

```typescript
export const getAppConfig = async (projectSlug: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, slug, theme, menus, logo_url')
    .eq('slug', projectSlug)
    .single();

  if (error) throw error;
  return data;
};
```

### Buscar Conteúdo de uma Página (Apenas Versão Publicada)

Esta é a query principal para renderizar as telas do app.

```typescript
export const getPublishedPage = async (projectId: string, pageSlug: string) => {
  const { data, error } = await supabase
    .from('pages')
    .select(`
      id,
      title,
      slug,
      page_versions!inner (
        id,
        status,
        sections: page_sections (
          id,
          order_index,
          content,
          definition: section_definitions (
            name,
            schema
          )
        )
      )
    `)
    .eq('project_id', projectId)
    .eq('slug', pageSlug)
    .eq('page_versions.status', 'PUBLISHED')
    .single();

  if (error) throw error;
  
  // Formata os dados para facilitar o consumo
  const publishedVersion = data.page_versions[0];
  const sections = publishedVersion.sections.sort((a, b) => a.order_index - b.order_index);
  
  return {
    ...data,
    sections
  };
};
```

## 3. Renderização Dinâmica no React Native

No seu App, você terá um mapeador de componentes que associa o `name` da `section_definition` a um componente React Native.

### Exemplo de Component Mapper

```tsx
import { HeroSection } from './components/HeroSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import { RichText } from './components/RichText';

const SECTION_COMPONENTS = {
  'Hero Section': HeroSection,
  'Features Grid': FeaturesGrid,
  'Rich Text': RichText,
};

export const DynamicRenderer = ({ sections }) => {
  return (
    <>
      {sections.map((section) => {
        const Component = SECTION_COMPONENTS[section.definition.name];
        if (!Component) return null;

        return <Component key={section.id} content={section.content} />;
      })}
    </>
  );
};
```

### Exemplo de um Componente (HeroSection)

```tsx
import { View, Text, Image, StyleSheet } from 'react-native';

export const HeroSection = ({ content }) => {
  return (
    <View style={styles.container}>
      {content.backgroundImage && (
        <Image source={{ uri: content.backgroundImage }} style={styles.bg} />
      )}
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.subtitle}>{content.subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666' },
  bg: { width: '100%', height: 200, borderRadius: 10 }
});
```

## 4. Gerenciamento de Tema

Use o campo `theme` retornado pelo projeto para configurar seu provedor de tema (Styled Components, Restyle, ou Stylesheet puro).

```typescript
// Exemplo de uso do theme
const styles = (theme) => StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: parseInt(theme.buttonStyle.radius),
  }
});
```

## 5. Dicas de Performance

1. **Caching**: Utilize `React Query` ou `SWR` no mobile para cachear as respostas do Supabase e evitar redundância de rede.
2. **Imagens**: Use `expo-image` para melhor performance de carregamento e cache de imagens.
3. **Deep Linking**: Como as páginas têm `slug`, você pode configurar o Deep Linking no Expo para que `meuapp://home` ou `meuapp://categoria` abra as páginas corretas dinamicamente.
