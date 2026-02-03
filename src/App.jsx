import { useState } from 'react';
import './index.css';

// URL del Web App de Google Apps Script (Principal).
const GOOGLE_SCRIPT_URL_PRINCIPAL = import.meta.env.VITE_UPLOAD_URL || '';
// URL de Respaldo (Backup) por si la primera falla o está llena.
const GOOGLE_SCRIPT_URL_BACKUP = import.meta.env.VITE_UPLOAD_URL_BACKUP || '';

function App() {
  // --- ESTADOS ---
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [vistaPreviaUrl, setVistaPreviaUrl] = useState(null);
  const [estadoSubida, setEstadoSubida] = useState('idle');
  const [mensajeUsuario, setMensajeUsuario] = useState('');

  // --- FUNCIONES AUXILIARES ---

  const alCambiarArchivo = (evento) => {
    const archivo = evento.target.files[0];
    if (archivo) {
      if (!archivo.type.startsWith('image/')) {
        setEstadoSubida('error');
        setMensajeUsuario('Por favor selecciona solo imágenes.');
        return;
      }
      setArchivoSeleccionado(archivo);
      setVistaPreviaUrl(URL.createObjectURL(archivo));
      setEstadoSubida('idle');
      setMensajeUsuario('');
    }
  };

  const convertirArchivoABase64 = (archivo) => new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.readAsDataURL(archivo);
    lector.onload = () => resolve(lector.result.split(',')[1]);
    lector.onerror = error => reject(error);
  });

  /**
   * Función interna para intentar subir a una URL específica.
   */
  const intentarSubida = async (url, archivoBase64) => {
    const respuesta = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        nombreArchivo: archivoSeleccionado.name,
        tipoMime: archivoSeleccionado.type,
        archivoBase64: archivoBase64
      })
    });
    const resultado = await respuesta.json();
    if (resultado.status !== 'success') {
      throw new Error(resultado.message || 'Error en el servidor');
    }
    return resultado;
  };

  /**
   * Función principal que coordina la subida con respaldo (Failover).
   */
  const alSubirImagen = async () => {
    if (!archivoSeleccionado) return;

    if (!GOOGLE_SCRIPT_URL_PRINCIPAL) {
      setEstadoSubida('error');
      setMensajeUsuario('Falta configuración: VITE_UPLOAD_URL no está definida.');
      return;
    }

    setEstadoSubida('uploading');
    setMensajeUsuario('');

    try {
      // 1. Convertimos la imagen una sola vez
      const archivoEnBase64 = await convertirArchivoABase64(archivoSeleccionado);

      try {
        // 2. Intentamos subir al servidor PRINCIPAL
        await intentarSubida(GOOGLE_SCRIPT_URL_PRINCIPAL, archivoEnBase64);

        // Si llegamos aquí, funcionó
        exitoSubida();

      } catch (errorPrincipal) {
        console.warn("Fallo el servidor principal:", errorPrincipal);

        console.log("Intentando backup con URL:", GOOGLE_SCRIPT_URL_BACKUP); // DEBUG

        // 3. Si falla y tenemos servidor de RESPALDO, intentamos ahí
        if (GOOGLE_SCRIPT_URL_BACKUP) {
          setMensajeUsuario('El servidor principal está ocupado, intentando con el respaldo...');
          try {
            await intentarSubida(GOOGLE_SCRIPT_URL_BACKUP, archivoEnBase64);
            exitoSubida();
          } catch (errorBackup) {
            console.error("Fallo el servidor de respaldo:", errorBackup); // DEBUG
            throw new Error("Fallaron ambos servidores. Intenta más tarde.");
          }
        } else {
          // Si no hay backup, lanzamos el error original
          throw errorPrincipal;
        }
      }

    } catch (error) {
      console.error("Error final:", error); // DEBUG
      setEstadoSubida('error');
      setMensajeUsuario('No se pudo subir la foto. Posiblemente el Drive esté lleno o haya un error de red.');
    }
  };

  const exitoSubida = () => {
    setEstadoSubida('success');
    setMensajeUsuario('¡Foto subida con éxito! Gracias por compartir.');
    setArchivoSeleccionado(null);
    setVistaPreviaUrl(null);
  };


  // --- INTERFAZ (Lo que se ve en pantalla) ---
  return (
    <div className="container">
      <div className="upload-card">
        <h1>Boda de G y A 💍</h1>
        <p className="subtitle">Comparte tus momentos de la boda con nosotros.<br />Sube tus fotos directamente a nuestro Google Drive.</p>

        <div className="input-group">
          {/* 
             El label actúa como botón gigante. 
             Si hay vista previa, mostramos la imagen. Si no, el icono de cámara.
          */}
          <label className={`file-label ${vistaPreviaUrl ? 'has-file' : ''}`}>
            <input
              type="file"
              accept="image/*"
              onChange={alCambiarArchivo}
            />
            {vistaPreviaUrl ? (
              <>
                <img src={vistaPreviaUrl} alt="Vista previa" className="preview-image" />
                <div className="change-photo-text">Clic para cambiar</div>
              </>
            ) : (
              <>
                <span className="icon">📷</span>
                <span className="upload-text">Toca para seleccionar fotos</span>
                <span style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                  Desde tu celular o PC
                </span>
              </>
            )}
          </label>
        </div>

        <button
          className="submit-btn"
          onClick={alSubirImagen}
          // Deshabilitamos el botón si no hay archivo o si ya se está subiendo
          disabled={!archivoSeleccionado || estadoSubida === 'uploading'}
        >
          {estadoSubida === 'uploading' ? (
            <>
              <span className="loading-spinner"></span>
              Subiendo...
            </>
          ) : 'Enviar Foto'}
        </button>

        {/* Mostramos mensajes de éxito o error si los hay */}
        {mensajeUsuario && (
          <div className={`status ${estadoSubida}`}>
            {mensajeUsuario}
          </div>
        )}
      </div>

      <footer className="footer">
        Desarrollado por <a href="https://sozasystems.vercel.app/" target="_blank" rel="noopener noreferrer">Soza Systems</a>
      </footer>
    </div>
  );
}

export default App;
