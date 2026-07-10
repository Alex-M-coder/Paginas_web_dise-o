# 🪐 NEBULA 3D — Tienda Holográfica de Videojuegos y Suscripciones

¡Bienvenido a **Nebula 3D**! Este proyecto es una aplicación web interactiva que simula un escaparate de videojuegos y planes de suscripción espaciales en una interfaz holográfica y tridimensional basada en la estética *cyberpunk* y *retro-futurista*. 

La aplicación utiliza la potencia de **Three.js** para renderizar gráficos en 3D en tiempo real directamente en el navegador, **GSAP** para gestionar las transiciones y micro-animaciones físicas de los componentes, y la **Web Audio API** para sintetizar efectos de sonido de forma procedimental (sin archivos de audio externos).

---

## 🚀 Características Principales

*   **Carrusel 3D Interactivo**: Un escaparate circular de tarjetas holográficas en órbita que el usuario puede rotar libremente arrastrando el ratón (*drag & drop*), usando las flechas de dirección (`←` / `→`, `A` / `D`), o mediante los controles del HUD 2D.
*   **Modelos 3D Procedurales**: Los modelos que flotan en el visualizador derecho se generan dinámicamente mediante código en tiempo real (naves espaciales, espadas del destino, coches retro, castillos vóxel, coronas VIP, etc.), optimizando el peso de carga a prácticamente cero al no requerir archivos `.gltf` o `.obj` externos.
*   **Texturas Dinámicas en Canvas 2D**: Las portadas y reversos de las tarjetas de videojuegos y planes de suscripción se dibujan dinámicamente sobre un elemento `canvas` 2D en tiempo real y se mapean como materiales de tipo `CanvasTexture` en los bloques 3D de Three.js.
*   **Sintetizador de Audio Procedimental (Web Audio API)**: Generación por software de un sonido de fondo ambiental tipo "motor de nave" modulado por LFO, efectos acústicos para eventos de navegación (*hover*), selección (*click*), adición de ítems al carrito (arpegios ascendentes) y simulación metálica de caja registradora al comprar.
*   **Gestor de Carrito de Compras Estático**: Almacenamiento persistente en `localStorage` con funciones para sumar, restar y eliminar unidades del catálogo de videojuegos.
*   **Sistema de Suscripciones y Descuentos**: Simulación de inicio de sesión con cuentas integradas de diferentes niveles de suscripción (Free, Pro, Premium, VIP). Dependiendo del plan activo del usuario, la interfaz aplica un porcentaje de descuento dinámico en tiempo real sobre los precios de los videojuegos agregados al carrito de compras.
*   **Diseño HUD Glassmorphic**: Interfaz superpuesta de ciencia ficción con efectos de desenfoque de fondo (*backdrop-filter*), textos brillantes con sombra de neón, barra de búsqueda reactiva y filtros automáticos por categorías (Sci-Fi, RPG, Deportes, Carreras, Planes).

---

## 🛠️ Pila Tecnológica

La aplicación se ha desarrollado sin *frameworks* pesados, priorizando el rendimiento bruto y la compatibilidad moderna:

1.  **Motor Gráfico**: [Three.js](https://threejs.org/) (v0.185.1) para la configuración de la escena WebGL, luces, cámara en perspectiva y renderizado de mallas procedurales.
2.  **Motor de Animación**: [GSAP - GreenSock](https://gsap.com/) (v3.15.0) para interpolación de posiciones de cámara, rotaciones y transiciones fluidas de las mallas.
3.  **Generación de Audio**: [Web Audio API](https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API) integrada en el navegador para la síntesis FM y sustractiva de ondas acústicas.
4.  **Entorno de Desarrollo y Construcción**: [Vite](https://vite.dev/) (v8.1.1) como empaquetador ultrarrápido y servidor de desarrollo ES modules.
5.  **Estilizado**: CSS3 puro bajo arquitectura *responsive layout* usando CSS Grid, Flexbox y Variables CSS personalizadas para cambiar los temas de iluminación neón.

---

## 📁 Estructura del Proyecto

A continuación se detalla la organización lógica del código fuente del proyecto:

```text
Creacion_de_pagina_3d/
├── dist/                     # Directorio de distribución para producción (generado por Vite)
├── public/                   # Archivos estáticos públicos (imágenes de catálogo, iconos)
├── src/
│   ├── assets/               # Recursos de assets estáticos
│   ├── core/
│   │   ├── audioController.js# Controlador y sintetizador procedural Web Audio API
│   │   ├── cart.js           # Lógica del carrito de compras y control de localStorage
│   │   └── gamesData.js      # Base de datos local (Mock) de videojuegos, planes y usuarios
│   ├── generators/
│   │   ├── cardCanvas.js     # Renderizador 2D de texturas dinámicas sobre las tarjetas 3D
│   │   └── proceduralModels.js# Generador algorítmico de geometrías 3D de Three.js
│   ├── scene/
│   │   └── storeScene.js     # Inicialización, bucle de animación e interacción WebGL 3D
│   ├── ui/
│   │   ├── cartDrawer.js     # Gestor del panel lateral desplegable de la cesta de compras
│   │   ├── detailsPanel.js   # Controlador del panel de detalles inferior del juego/plan activo
│   │   └── loginManager.js   # Manejador del modal de autenticación y vinculación de perfiles
│   ├── counter.js            # Componente auxiliar de estado
│   ├── main.js               # Punto de entrada principal y registro de eventos globales del HUD
│   └── style.css             # Hoja de estilos principal con temática Sci-Fi
├── index.html                # Estructura del HUD y contenedor principal del Canvas
├── package.json              # Definición de dependencias npm y scripts del proyecto
├── package-lock.json         # Bloqueo de versiones de dependencias instaladas
└── README.md                 # Documentación técnica del proyecto (este archivo)
```

---

## ⚙️ Explicación de Módulos Críticos

### 1. `src/scene/storeScene.js`
Este módulo es el núcleo tridimensional del sistema. Inicializa el ciclo de vida de WebGL:
*   **Escena y Niebla**: Configura una escena espacial profunda con niebla exponencial (`THREE.FogExp2`) para difuminar las tarjetas lejanas.
*   **Iluminación de Neón**: Combina luces direccionales de color cian (`0x00f2fe`) y púrpura (`0x9d4edd`) con focos cenitales de luz blanca para realzar el brillo metálico de los elementos procedimentales.
*   **Raycasting & Hitboxes**: Emplea hitboxes invisibles ligeramente más gruesas que las tarjetas físicas para capturar el puntero del ratón con precisión y activar efectos de enfoque (*hover* y *click*) de forma fluida.
*   **Espacio Estelar**: Genera un búfer de geometrías con 1,500 estrellas de colores dispersas matemáticamente en una esfera de gran radio alrededor de la escena.

### 2. `src/generators/proceduralModels.js`
Evita el uso de archivos de modelado pesados. Utiliza combinaciones algebraicas de geometrías básicas de Three.js:
*   *Espada del Destino*: Generada uniendo una caja estirada con emisión luminosa (hoja), cajas grises metálicas (guardia) y cilindros con texturas de baja rugosidad (mango).
*   *Nave Espacial*: Creada mediante un cono principal, una esfera escalada para la cabina holográfica, cajas planas para las alas y un cilindro con cono de color emisivo simulando el propulsor trasero.
*   *Anillos de Órbita*: Diseñados usando geometrías toroidales anidadas que rotan en sentidos opuestos alrededor de una esfera central.

### 3. `src/core/audioController.js`
Configura un sintetizador en tiempo real basado en osciladores nativos del navegador:
*   *Dron de Fondo*: Combina un oscilador senoidal suave a 110 Hz, un filtro pasa-bajos fijado a 200 Hz y un LFO que oscila a 0.2 Hz modulando la frecuencia de corte para simular la pulsación ambiental de una nave espacial.
*   *Efecto de Compra*: Genera un arpegio ascendente rápido de tipo onda triangular enlazado con un búfer de ruido blanco filtrado con factor de calidad resonante (simula el tintineo de monedas metálicas).

### 4. `src/core/cart.js`
Gestiona el estado comercial de la aplicación:
*   Interpreta la sesión activa del usuario y extrae el plan contratado.
*   Si el usuario añade una suscripción, la activa inmediatamente actualizando el perfil holográfico y aplicando el descuento a la cesta global.
*   Calcula los totales aplicando de forma acumulativa los descuentos asociados al perfil:
    $$\text{Precio con descuento} = \text{Precio base} \times (1 - \text{Descuento de suscripción})$$

---

## 💻 Instalación y Uso Local

Para desplegar el entorno de desarrollo localmente, sigue estos sencillos pasos:

### Prerrequisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada) y `npm` en tu equipo.

### 1. Clonar el repositorio
```bash
git clone <URL_DE_ESTE_REPOSITORIO>
cd Creacion_de_pagina_3d
```

### 2. Instalar dependencias
Instala los paquetes necesarios definidos en el archivo `package.json`:
```bash
npm install
```

### 3. Ejecutar el servidor de desarrollo
Inicia el entorno de desarrollo local con Vite:
```bash
npm run dev
```
Vite levantará el servidor en tu máquina local. Normalmente podrás acceder abriendo tu navegador en:
`http://localhost:5173/`

### 4. Construir para producción
Para compilar y optimizar el proyecto para un servidor web de producción:
```bash
npm run build
```
Esto generará los archivos distribuidos optimizados (HTML minificado, CSS purgado, y bundles de Javascript ofuscados) dentro de la carpeta `/dist`.

### 5. Previsualizar la versión de producción
Puedes validar el comportamiento de producción localmente ejecutando:
```bash
npm run preview
```

---

## 🛡️ Cuentas de Prueba Integradas
Para probar el sistema de inicio de sesión y comprobar la aplicación dinámica de descuentos en el carrito de compras, puedes utilizar cualquiera de los siguientes perfiles de usuario dentro del modal de inicio de sesión del HUD:

*   **Usuario 1**:
    *   *Email*: `juan@email.com`
    *   *Plan Asociado*: **PRO** (20% de descuento automático)
*   **Usuario 2**:
    *   *Email*: `maria@email.com`
    *   *Plan Asociado*: **VIP** (50% de descuento automático)
*   **Usuario 3**:
    *   *Email*: `carlos@email.com`
    *   *Plan Asociado*: **FREE** (Sin descuento)

---

## 📄 Licencia
Este proyecto se distribuye bajo la Licencia **MIT**. Puedes utilizar, modificar y distribuir el código libremente para proyectos comerciales o educativos.
