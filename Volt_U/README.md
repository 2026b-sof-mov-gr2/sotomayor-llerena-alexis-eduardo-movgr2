# VoltU — Gestión de puntos de carga del campus

VoltU es una aplicación móvil académica desarrollada con React Native y Expo para localizar y administrar puntos de carga eléctrica dentro de un campus universitario. La aplicación muestra el estado de cada edificio, permite consultar sus coordenadas, revisar la distribución de sus puertos y ejecutar operaciones CRUD sobre los puntos y conectores registrados.

## Descripción del proyecto

El problema que resuelve VoltU es la dificultad de conocer dónde existe un punto de carga y si se encuentra disponible antes de llegar al edificio. La aplicación centraliza esta información en una interfaz móvil sencilla:

- Lista de edificios con estado **Disponible**, **Ocupado** o **Dañado**.
- Búsqueda por edificio, piso o ubicación.
- Filtro por estado del punto.
- Mapa del campus con coordenadas de demostración.
- Plano interno de puertos por edificio.
- Registro de nuevos puntos de carga.
- Actualización del estado general y del estado de cada puerto.
- Habilitación, deshabilitación, creación y eliminación de puertos.
- Confirmación antes de eliminar información.
- Pantalla inicial de carga con la identidad visual de VoltU.

Actualmente el CRUD trabaja en memoria. Esto permite demostrar el flujo completo de la aplicación, pero los cambios se pierden al cerrar o reiniciar la app. Para una versión productiva se debe conectar `setAulas` con una API o con almacenamiento local como AsyncStorage.

## Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
| --- | --- |
| React Native | Construcción de la interfaz móvil con componentes nativos. |
| Expo SDK 58 | Ejecución, empaquetado y desarrollo de la aplicación. |
| TypeScript | Tipado estático de datos, propiedades y funciones. |
| React 19 | Componentes funcionales y hooks. |
| `react-native-maps` | Mapa con marcadores por coordenadas. |
| JavaScript/TypeScript ES | Métodos `map`, `filter`, `some`, `find` y funciones flecha. |

## Ejecución

Instalar dependencias:

```bash
npm install
```

Iniciar Expo:

```bash
npm start
```

Si Expo conserva una versión anterior del bundle, iniciar limpiando la caché:

```bash
npm start -- --clear
```

Comprobar el tipado del proyecto:

```bash
npm run lint
```

La aplicación puede abrirse con Expo Go, un emulador Android o un simulador iOS.

## Arquitectura del proyecto

```text
Volt_U/
├── App.tsx                         # Estado global y flujo principal
├── index.js                        # Punto de entrada de Expo
├── app.json                        # Configuración de Expo
├── package.json                    # Dependencias y scripts
├── src/
│   ├── data/
│   │   └── aulas.ts                # Tipos, coordenadas y datos iniciales
│   ├── components/
│   │   ├── AulaCard.tsx            # Tarjeta de edificio
│   │   └── DeleteModal.tsx         # Confirmación reutilizable
│   └── screens/
│       ├── LoadingScreen.tsx       # Carga inicial de VoltU
│       ├── ListScreen.tsx          # Lista, búsqueda y filtros
│       ├── CampusMapScreen.tsx     # Mapa con coordenadas
│       ├── PortMapScreen.tsx       # Plano CRUD de puertos
│       └── FormScreen.tsx          # Crear y actualizar puntos
```

## Uso de los componentes del lenguaje y del framework

### 1. Componentes funcionales

Cada pantalla y componente se declara como una función que devuelve JSX. Por ejemplo, `ListScreen` recibe información y callbacks mediante props:

```tsx
type Props = {
  aulas: Aula[];
  onCreate: () => void;
  onEdit: (aula: Aula) => void;
};

export default function ListScreen({aulas, onCreate, onEdit}: Props) {
  return <FlatList data={aulas} />;
}
```

Esto separa la presentación de la lógica principal y permite reutilizar las pantallas con distintos datos.

### 2. JSX

JSX combina TypeScript con una sintaxis parecida a HTML para declarar la interfaz. Los componentes React Native usados son, entre otros:

- `View`: contenedor visual.
- `Text`: texto.
- `TextInput`: entrada de datos.
- `Pressable`: botones y zonas táctiles.
- `FlatList`: lista eficiente de puntos.
- `ScrollView`: desplazamiento de formularios.
- `Modal`: diálogos y formularios secundarios.
- `ActivityIndicator`: indicador de carga.
- `MapView` y `Marker`: mapa y marcadores.

React Native no utiliza elementos web como `<div>` o `<button>`; utiliza estos componentes para renderizar controles nativos en Android e iOS.

### 3. Tipos de TypeScript

El modelo está definido en `src/data/aulas.ts`:

```ts
export type PointStatus = 'available' | 'occupied' | 'damaged';
export type PortStatus = 'enabled' | 'occupied' | 'disabled';

export type ChargingPort = {
  id: string;
  label: string;
  zone: string;
  status: PortStatus;
};
```

Los tipos restringen los valores válidos. Por ejemplo, un puerto no puede recibir accidentalmente el texto `"unknown"` como estado. Esto ayuda a detectar errores durante el desarrollo antes de ejecutar la aplicación.

### 4. Estado con `useState`

`App.tsx` mantiene el estado principal de la aplicación:

```tsx
const [aulas, setAulas] = useState<Aula[]>(initialAulas);
const [editingAula, setEditingAula] = useState<Aula | null | undefined>(undefined);
```

Los valores tienen tres significados para `editingAula`:

- `undefined`: mostrar la lista.
- `null`: abrir el formulario de creación.
- un objeto `Aula`: abrir el formulario de actualización.

También se mantiene el mapa del campus y el mapa interno de puertos mediante estados independientes. Esta estrategia funciona como una navegación sencilla basada en estado sin incorporar una librería adicional de navegación.

### 5. Props y callbacks

Los componentes hijos no modifican directamente el estado de `App.tsx`. Reciben funciones callback:

```tsx
<ListScreen
  aulas={aulas}
  onCreate={() => setEditingAula(null)}
  onEdit={setEditingAula}
  onDelete={deleteAula}
/>
```

Este patrón se conoce como **flujo de datos unidireccional**: el estado baja mediante props y los eventos suben mediante callbacks. Así se mantiene una única fuente de verdad para el CRUD.

### 6. Hooks de React

- `useState`: almacena puntos, puertos, filtros, selección y rutas de pantalla.
- `useEffect`: oculta automáticamente los mensajes de confirmación después de unos segundos y controla el ciclo de la pantalla de carga.
- `useMemo`: calcula la lista filtrada sin repetir el trabajo innecesariamente en cada render.
- `useRef`: conserva referencias de animación en `LoadingScreen` sin provocar renders adicionales.

### 7. Operaciones CRUD

El CRUD se implementa con actualizaciones inmutables de arrays:

```tsx
// Crear
setAulas(current => [{...draft, id: Date.now().toString()}, ...current]);

// Actualizar
setAulas(current => current.map(point =>
  point.id === draft.id ? draft : point
));

// Eliminar
setAulas(current => current.filter(point => point.id !== id));
```

Para los puertos se utiliza el mismo principio. `map` reemplaza un puerto, `filter` lo elimina y el operador spread (`...`) crea una nueva colección sin mutar la anterior.

### 8. Búsqueda, filtros y estados derivados

`ListScreen` usa `filter` e `includes` para encontrar coincidencias por edificio, ubicación o piso. El estado general de un edificio se calcula con `statusFromPorts`:

```ts
if (ports.some(port => port.status === 'enabled')) return 'available';
if (ports.some(port => port.status === 'occupied')) return 'occupied';
return 'damaged';
```

La función `some` comprueba si existe al menos un puerto que cumpla una condición. De esta manera, el estado del edificio se actualiza cuando se habilita o deshabilita un puerto.

### 9. Coordenadas y mapa

Cada `Aula` contiene una coordenada:

```ts
coordinates: {
  latitude: -0.21095,
  longitude: -78.48945,
}
```

`CampusMapScreen` recorre los puntos con `map` y crea un `Marker` por edificio. Al presionar un marcador, se actualiza el edificio seleccionado y se muestra una ficha con sus coordenadas y el botón para gestionar sus puertos. Las coordenadas actuales son de demostración y deben reemplazarse por las coordenadas reales del campus.

### 10. Estilos y diseño

Los estilos se definen con `StyleSheet.create`. Esto centraliza colores, tamaños, sombras, espaciados y estados visuales. Las pantallas utilizan `SafeAreaView` para evitar que el contenido quede debajo del notch o de la barra del sistema.

## Flujo principal de uso

1. Se muestra `LoadingScreen` con el logo VoltU.
2. `ListScreen` carga los puntos iniciales.
3. El usuario puede buscar o filtrar edificios.
4. El botón `+` abre `FormScreen` para crear un punto.
5. Tocar una tarjeta abre `FormScreen` para actualizar el estado general.
6. La pestaña **Mapa** abre `CampusMapScreen`.
7. Tocar un marcador permite abrir `PortMapScreen`.
8. En el plano se pueden añadir, habilitar, deshabilitar o eliminar puertos.
9. `DeleteModal` solicita confirmación antes de eliminar.

## Consideraciones técnicas pendientes

- Persistir los datos en una API o base de datos.
- Reemplazar las coordenadas de demostración por coordenadas verificadas.
- Incorporar autenticación y permisos para restringir el CRUD administrativo.
- Agregar pruebas unitarias y pruebas de navegación.
- Revisar las vulnerabilidades reportadas por `npm audit` antes de publicar.
