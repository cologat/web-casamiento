# 💍 Web Boda - Servicio de Subida de Imágenes

> **Aplicación web segura y anónima para recopilar los mejores momentos de la boda directamente en Google Drive.**

---

## 📖 Descripción

Este proyecto es una **Aplicación Web** diseñada para centralizar la recolección de fotografías del evento. Evita la pérdida de calidad asociada a plataformas de mensajería instantánea, asegurando que las imágenes se almacenen directamente en la nube en su resolución original.

El sistema utiliza una arquitectura **Serverless** dividida en dos componentes:
*   **Frontend:** Interfaz moderna y responsiva para los invitados.
*   **Backend:** Script en Google Apps Script que gestiona la seguridad y el almacenamiento en Drive.

### Características Principales y Técnicas:
*   ✅ **Subida Directa:** Integración transparente con Google Drive API.
*   ✅ **Privacidad Total:** No requiere registro ni inicio de sesión para los invitados (Funciona como "buzón").
*   ✅ **Optimización:** Compresión inteligente de imágenes en el cliente antes de la subida.
*   ✅ **Alta Performance:** Construido con Vite para una carga instantánea.
*   ✅ **Feedback Visual:** Indicadores de progreso y notificaciones de estado (toast).
*   ✅ **Arquitectura Serverless:** Sin servidores que mantener, alojado en Google Cloud.

---

## 🛠️ Tecnologías Utilizadas

*   React
*   Vite
*   JavaScript (ES6+)
*   Google Apps Script
*   Google Drive API
*   CSS3
*   HTML5

---

## 📂 Estructura del Proyecto

```bash
web-boda/
├── 📄 SERVER_SCRIPT.js  # Script de Backend (Google Apps Script)
├── 📂 public/           # Archivos estáticos
├── 📂 src/
│   ├── 📂 assets/       # Imágenes y recursos
│   ├── 📄 App.jsx       # Componente principal y lógica de subida
│   ├── 📄 App.css       # Estilos del componente
│   ├── 📄 index.css     # Estilos globales y variables
│   └── 📄 main.jsx      # Punto de entrada de React
├── 📄 .env.example      # Plantilla de variables de entorno
└── 📄 vite.config.js    # Configuración del empaquetador
```

---

## ⚙️ Configuración e Instalación

### 1. Configuración de Google Drive (Requisito Previo)

Es necesario configurar el repositorio de almacenamiento en Google Drive antes de iniciar la implementación.

1.  Acceda a **Google Drive**.
2.  Cree una nueva carpeta para el proyecto (ej: "Fotos Boda").
3.  (Opcional pero recomendado) Configure los permisos de la carpeta: Clic derecho -> **Compartir** -> Seleccione "Cualquier persona con el enlace puede ver" (para facilitar el acceso de visualización a los administradores).
4.  Identifique y copie el **ID de la carpeta** desde la URL del navegador (la cadena de caracteres ubicada después de `folders/`). *Conserve este identificador para la configuración del backend.*

### 2. Configuración del Backend (Google Apps Script)

Para asegurar el funcionamiento de la aplicación, es necesario desplegar el script de backend que actuará como middleware con Google Drive.
**Nota:** Este script se ejecuta en los servidores de Google; por lo tanto, no tiene acceso a las variables de entorno locales (`.env`). El ID de la carpeta debe configurarse manualmente en el código fuente.

1.  Acceder a [Google Apps Script](https://script.google.com/) y crear un **"Nuevo proyecto"**.
2.  Copiar el contenido del archivo `SERVER_SCRIPT.js` de este repositorio.
3.  **Configurar el ID de la Carpeta**:
    - En el editor de Google, busca la línea: `const ID_DE_LA_CARPETA = '...'`
    - Pega ahí el ID que copiaste en el Paso 1.
4.  **Desplegar el Script** (Deploy):
    - Clic en el botón **"Implementar"** > **"Nueva implementación"**.
    - **Seleccionar tipo**: Icono de engranaje > **Aplicación web**.
    - **Configuración requerida**:
        - *Descripción*: "Servicio de Subida".
        - *Ejecutar como*: **"Yo"** (Propietario de la cuenta).
        - *Quién tiene acceso*: **"Cualquiera" (Anyone)**. *Este paso es fundamental para permitir cargas anónimas sin autenticación.*
    - Clic en **"Implementar"**.
5.  Copiar la **URL de la aplicación web** generada.

### 3. Configuración del Frontend

1.  Clonar el repositorio.
2.  Copiar el archivo de ejemplo de variables de entorno:
    ```bash
    cp .env.example .env
    ```
3.  Editar el archivo `.env` recién creado y pegar la URL del script que obtuviste en el paso anterior:
    ```env
    VITE_UPLOAD_URL=https://script.google.com/macros/s/TU_URL_DEL_SCRIPT/exec
    ```
    *(Asegúrate de que este archivo `.env` esté en el `.gitignore` para no subirlo al repositorio).*
4.  Instalar dependencias:
    ```bash
    npm install
    ```
5.  Iniciar desarrollo:
    ```bash
    npm run dev

---

## 🔗 Visitar Sitio
Puedes ver el proyecto en funcionamiento aquí:
👉 **[casamiento-fotos.vercel.app](https://casamiento-fotos.vercel.app/)**

---

Desarrollado por **Jsoza**