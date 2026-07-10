# Páginas Web de Diseño 🎨

Este repositorio contiene una colección de aplicaciones web interactivas diseñadas con una estética visual moderna, limpia y premium, utilizando tecnologías web estándar (HTML, CSS y JavaScript).

---

## 🚀 Proyectos Incluidos

### 1. 🎮 GameVault - Gestor de Videojuegos Multiplataforma
Una aplicación web interactiva para catalogar, gestionar y organizar tu colección personal de videojuegos de diversas plataformas.
*   **Características:**
    *   Interfaz moderna y futurista con efectos de iluminación (*glowing orbs*).
    *   Gestión dinámica de colecciones (añadir, editar, filtrar y eliminar juegos).
    *   Selector aleatorio para decidir a qué jugar cuando no te decides.
    *   Diseño totalmente adaptable (*responsive*).
*   **Tecnologías:** HTML5, CSS3 personalizado y JavaScript (ES6+).
*   **Ubicación:** [`Gestor_Videojuegos/`](./Gestor_Videojuegos)

### 2. 🚗 Matrículas 360 - Identificador de Matrículas de España
Una herramienta avanzada para analizar e identificar matrículas de vehículos españoles de distintas épocas.
*   **Características:**
    *   **Historial Completo:** Identificación de matrículas del sistema moderno (tres letras), provincial alfanumérico y numérico clásico.
    *   **Soporte Multilingüe:** Disponible en Español (ES), Inglés (EN), Catalán (CA), Gallego (GL) y Euskera (EU).
    *   **Tipos de Vehículos:** Soporta coches, motos, ciclomotores y remolques.
    *   **Estética Premium:** Fondo dinámico con orbes brillantes y diseño adaptado a múltiples pantallas.
*   **Tecnologías:** HTML5, CSS3 avanzado (animaciones, variables CSS) y JavaScript para el motor de traducción y lógica de parseo de matrículas.
*   **Ubicación:** [`identificacion_matriculas_ano/`](./identificacion_matriculas_ano)

### 3. 🪐 Nebula 3D - Tienda Holográfica de Videojuegos y Suscripciones
Una tienda virtual inmersiva y tridimensional que simula un escaparate de videojuegos y planes de suscripción con estética cyberpunk.
*   **Características:**
    *   **Carrusel 3D Interactivo:** Escaparate circular con soporte para arrastre con el ratón, zoom de cámara y navegación por teclado.
    *   **Modelos 3D Procedurales:** Generación matemática en tiempo real de geometrías (naves espaciales, espadas, coches, castillos, etc.) sin usar modelos externos.
    *   **Texturas Dinámicas:** Renderizado 2D en tiempo real sobre lienzos (canvas) mapeados como materiales de textura en los bloques 3D.
    *   **Audio Sintetizado:** Efectos acústicos y sonido ambiental generados procedimentalmente con la Web Audio API.
    *   **Descuentos Dinámicos:** Carrito integrado que recalcula los precios automáticamente según el nivel de suscripción del usuario.
*   **Tecnologías:** HTML5, CSS3, JavaScript (ES Modules), Three.js, GSAP y Web Audio API.
*   **Ubicación:** [`Creacion_de_pagina_3d/`](./Creacion_de_pagina_3d)

### 4. 💻 Proyectos C++ - Colección de Códigos C++ y Web 3D
Una colección de desarrollos en C++ y aplicaciones interactivas duales.
*   **Características:**
    *   **Calculadora Pro C++ & 3D Web:** Aplicación dual que cuenta con una versión de consola orientada a objetos en C++11 y una recreación interactiva en 3D (Three.js) con interfaz LCD dinámica y cinta de papel deslizable.
*   **Tecnologías:** C++11 (OOP), HTML5, CSS3 y JavaScript (Three.js).
*   **Ubicación:** [`Proyectos_C++/`](./Proyectos_C++)

---

## 🛠️ Tecnologías y Estándares de Diseño

*   **HTML5 Semántico:** Estructuración limpia y accesible para SEO y lectores de pantalla.
*   **CSS3 Custom (Sin frameworks):** Diseños premium personalizados, uso de variables de CSS para fácil mantenimiento, gradientes suaves y micro-animaciones en botones y tarjetas para una excelente experiencia de usuario (UX).
*   **JavaScript (Vanilla JS / ES Modules):** Lógica nativa de alto rendimiento y uso de módulos ES modernos, integrando librerías especializadas en renderizado 3D y control de animaciones cuando es necesario.

---

## 📂 Estructura del Proyecto

```text
Paginas_web_diseño/
├── .gitignore                   # Archivos y carpetas excluidos de Git
├── README.md                    # Documentación del proyecto (este archivo)
│
├── Creacion_de_pagina_3d/       # Proyecto Nebula 3D (WebGL / Three.js)
│   ├── index.html               # Estructura principal del HUD
│   ├── package.json             # Dependencias npm y scripts de Vite
│   ├── src/                     # Código fuente (Three.js, GSAP, Audio, UI)
│   └── README.md                # Detalle técnico del proyecto 3D
│
├── Gestor_Videojuegos/          # Proyecto GameVault
│   ├── index.html               # Estructura principal de la app
│   ├── style.css                # Diseño visual y responsive
│   └── app.js                   # Lógica de gestión de videojuegos
│
├── identificacion_matriculas_ano/ # Proyecto Matrículas 360
│   ├── index.html               # Estructura principal
│   ├── style.css                # Estilos visuales y adaptabilidad
│   └── app.js                   # Lógica e internacionalización de matrículas
│
└── Proyectos_C++/               # Proyectos de C++ y Web
    ├── README.md                # Detalle del contenido C++
    └── calculadora/             # Proyecto Calculadora Dual (C++ / 3D Web)
```

---

## 💻 Ejecución Local

Para visualizar y probar cualquiera de los proyectos localmente:

### Proyectos Estáticos (GameVault / Matrículas 360)
1. Navega a la carpeta del proyecto (`Gestor_Videojuegos` o `identificacion_matriculas_ano`).
2. Abre el archivo `index.html` directamente en tu navegador web de preferencia, o bien utiliza una extensión como **Live Server** en tu editor de código.

### Proyectos con Servidor de Desarrollo (Nebula 3D)
1. Navega a la carpeta del proyecto (`Creacion_de_pagina_3d`).
2. Instala las dependencias necesarias y arranca el servidor de desarrollo de Vite:
   ```bash
   npm install
   npm run dev
   ```
3. Abre en tu navegador la dirección local indicada por la consola (normalmente `http://localhost:5173/`).

