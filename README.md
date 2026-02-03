# 💍 Web Boda - Servicio de Subida de Imágenes

Aplicación web desarrollada con React y Vite que permite la subida de imágenes directamente a una carpeta de Google Drive sin requerir autenticación por parte del usuario final.

---

## 🏗️ Arquitectura del Proyecto

El sistema utiliza una arquitectura **Serverless** dividida en dos componentes:

1.  **Frontend (Cliente)**: Aplicación React alojada en cualquier servicio estático (ej. Vercel). Se encarga de la interfaz de usuario, compresión de imágenes y conversión a Base64.
2.  **Backend (Google Apps Script)**: Script alojado en los servidores de Google que actúa como middleware. Recibe las peticiones HTTP desde el frontend y utiliza la API de Google Drive para guardar los archivos.

---

## ⚙️ Configuración e Instalación

### 1. Preparar Google Drive (Paso Cero)

Antes de tocar código, necesitas el lugar donde se guardarán las fotos.

1.  Ve a tu **Google Drive**.
2.  Crea una nueva carpeta (ej: "Fotos Boda").
3.  (Opcional pero recomendado) Haz clic derecho en la carpeta -> **Compartir** -> Cambia a "Cualquier persona con el enlace puede ver" (para que los novios puedan ver las fotos fácilmente).
4.  Copia el **ID de la carpeta** desde la URL del navegador (lo que está después de `folders/`). *Guardalo, lo usarás en el siguiente paso.*

### 2. Configuración del Backend (Google Apps Script)

Para que la aplicación funcione, es necesario desplegar el script de backend que actuará como intermediario con Google Drive.
**Nota:** Este script corre en los servidores de Google, por lo que no puede leer el archivo `.env` local. Debes configurar el ID manualmente en el código.

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
        - *Ejecutar como*: **"Yo"** (El propietario de la carpeta/cuenta).
        - *Quién tiene acceso*: **"Cualquiera" (Anyone)**. *Esto es crítico para permitir subidas anónimas.*
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

---

Hecho por **Jsoza**