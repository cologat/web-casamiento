/**
 * BACKEND - GOOGLE APPS SCRIPT
 * 
 * Este código debe desplegarse en un proyecto de Google Apps Script.
 * Consulte el archivo README.md del proyecto para obtener instrucciones detalladas 
 * sobre la configuración, despliegue y permisos requeridos.
 */

// ID de la carpeta de Google Drive donde se guardarán las fotos.
// EJEMPLO: Si tu URL es: https://drive.google.com/drive/folders/1ABC_XYZ-123456789
// Entonces el ID que debes poner abajo es: '1ABC_XYZ-123456789'
const ID_DE_LA_CARPETA = 'PONER_AQUI_EL_ID_DE_LA_CARPETA';

/**
 * Función principal que recibe los datos desde la página web (Método POST).
 * 'evento' contiene los datos enviados por la web (nombre, tipo, archivo).
 */
function doPost(evento) {
    try {
        // 1. Convertimos los datos que vienen en texto a un objeto JSON usable
        const datosRecibidos = JSON.parse(evento.postData.contents);

        // 2. Extraemos la información individual
        const nombreArchivo = datosRecibidos.nombreArchivo || datosRecibidos.filename; // Aceptamos ambos nombres por compatibilidad
        const tipoMime = datosRecibidos.tipoMime || datosRecibidos.mimeType;
        const datosBase64 = datosRecibidos.archivoBase64 || datosRecibidos.file;

        // 3. Conectamos con la carpeta de Drive
        const carpetaDestino = DriveApp.getFolderById(ID_DE_LA_CARPETA);

        // 4. Decodificamos el archivo (que viene en Base64) a un "Blob" (archivo binario real)
        const archivoBinario = Utilities.newBlob(Utilities.base64Decode(datosBase64), tipoMime, nombreArchivo);

        // 5. Creamos el archivo en la carpeta
        const archivoCreado = carpetaDestino.createFile(archivoBinario);

        // 6. Preparamos la respuesta de éxito para enviar de vuelta a la web
        const respuestaExito = ContentService.createTextOutput(JSON.stringify({
            status: 'success', // Indicamos que salió bien
            fileUrl: archivoCreado.getUrl() // Devolvemos la URL del archivo creado
        }));

        respuestaExito.setMimeType(ContentService.MimeType.JSON);
        return respuestaExito;

    } catch (error) {
        // Si algo falla, devolvemos el error a la web
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Función para manejar peticiones "OPTIONS".
 * Esto es necesario para el protocolo CORS (Cross-Origin Resource Sharing).
 * Básicamente le dice al navegador web que es seguro enviar datos aquí.
 */
function doOptions(evento) {
    var headers = {
        "Access-Control-Allow-Origin": "*", // Permitir acceso desde cualquier web
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS", // Métodos permitidos
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400" // Recordar esta configuración por 1 día
    };
    return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT);
}
