from flask import Flask, render_template, request, jsonify, send_file, url_for
from gemini_handler import TutorVirtual
import os
from datetime import datetime
import subprocess
import uuid
import pygame
import re
from threading import Thread
import time
from werkzeug.utils import secure_filename
from flask_cors import CORS
import google.generativeai as genai
import speech_recognition as sr  # Para reconocimiento de voz
from pydub import AudioSegment  # Para conversión de formatos de audio

app = Flask(__name__)

# Inicializar el tutor
tutor = TutorVirtual()
# Configuración de Piper TTS
#Usar tus rutas
PIPER_PATH = r""
MODEL_PATH = r""
AUDIO_FOLDER = os.path.join(app.static_folder, 'audio')
WELCOME_AUDIO_PATH = os.path.join(AUDIO_FOLDER, 'welcome.mp3')

def generate_audio():
    # Crear directorio si no existe
    os.makedirs(AUDIO_FOLDER, exist_ok=True)
    
    # Texto de bienvenida
    welcome_text = "¡Hola, astronauta! Prepárate para un viaje interestelar lleno de diversión y aprendizaje con tus amigos del espacio"
    
    # Generar audio con Piper TTS
    cmd = [
        PIPER_PATH,
        "--model", MODEL_PATH,
        "--output_file", WELCOME_AUDIO_PATH
    ]
    
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE, text=True)
    process.communicate(input=welcome_text)
    print("Audio generado exitosamente")

@app.route('/')
def index():
    # Generar audio en un hilo separado para no bloquear la respuesta
    Thread(target=generate_audio).start()
    return render_template('Matematicas/mapa-matematicas.html')
@app.route('/grados')
def grados():
    return render_template('Grados/grados.html')  # Asegúrate que la estructura de carpetas sea correcta

@app.route('/materias')
def materias():
    return render_template('Materias/materias.html')

@app.route('/Planetas')
def planetas():
    return render_template('Planetas/planetas.html')
@app.route('/Matematicas')
def matematicas():
    return render_template('Matematicas/mapa-matematicas.html')
@app.route('/Vista_Tutor')
def vista_tutor():
    return render_template('Vista_Tutor/index.html')
@app.route('/Vista_Tutor2')
def minijuego():
    return render_template('Vista_Tutor/MiniJuego/MiniJuego.html')
@app.route('/Vista_Tutor3')
def base():
    return render_template('Vista_Tutor/base.html')
@app.route('/numeros_1_al_10')
def numeros_1_al_10():
    # Generar audios básicos en segundo plano
    Thread(target=generar_audios_basicos).start()
    return render_template('Vista_Tutor/MiniJuego/MiniJuego.html')

def generar_audios_basicos():
    """Genera audios para los números del 1 al 10 si no existen"""
    try:
        for numero in range(1, 11):
            audio_filename = f"numero_{numero}.mp3"
            audio_path = os.path.join(AUDIO_FOLDER, audio_filename)
            
            if not os.path.exists(audio_path):
                texto = f"{numero}"
                cmd = [
                    PIPER_PATH,
                    "--model", MODEL_PATH,
                    "--output_file", audio_path
                ]
                process = subprocess.Popen(cmd, stdin=subprocess.PIPE, text=True)
                process.communicate(input=texto)
                
    except Exception as e:
        print(f"Error al generar audios básicos: {str(e)}")
@app.route('/save_audio', methods=['POST'])
def save_audio():
    # Verifica si el archivo de audio está en la solicitud
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    save_path = request.form.get('path', '')
    
    # Construye la ruta completa
    full_path = os.path.join('static', save_path.lstrip('/static/'))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    
    # Guarda el archivo
    audio_file.save(full_path)
    
    return jsonify({'success': True, 'path': save_path})
# Añade esta función para limpiar audios antiguos
def limpiar_audios_antiguos():
    try:
        # Mantener solo los últimos 20 audios generados
        archivos_audio = [f for f in os.listdir(AUDIO_FOLDER) if f.startswith('numero_')]
        
        if len(archivos_audio) > 20:
            # Ordenar por fecha de modificación (más antiguos primero)
            archivos_audio.sort(key=lambda x: os.path.getmtime(os.path.join(AUDIO_FOLDER, x)))
            
            # Eliminar los más antiguos
            for archivo in archivos_audio[:-20]:
                os.remove(os.path.join(AUDIO_FOLDER, archivo))
                
    except Exception as e:
        print(f"Error al limpiar audios antiguos: {str(e)}")

# Ejecutar limpieza al iniciar la aplicación
limpiar_audios_antiguos()
# Nueva ruta para generar y servir audios dinámicamente
# Añade esta ruta específica para números
@app.route('/generar_numero_audio/<int:numero>')
def generar_numero_audio(numero):
    try:
        # Nombre seguro para el archivo (manteniendo tu formato)
        audio_filename = f"numero{numero}.mp3"
        audio_path = os.path.join(AUDIO_FOLDER, audio_filename)
        
        # Si el archivo no existe, generarlo
        if not os.path.exists(audio_path):
            texto = f"Presiona el numero {numero}"
            
            # Limpiar texto para Piper (aunque es solo un número)
            texto_limpio = limpiar_texto_para_piper(texto)
            
            cmd = [
                PIPER_PATH,
                "--model", MODEL_PATH,
                "--output_file", audio_path
            ]
            
            # Ejecutar Piper y esperar a que termine
            process = subprocess.Popen(cmd, stdin=subprocess.PIPE, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = process.communicate(input=texto_limpio)
            
            if process.returncode != 0:
                raise Exception(f"Piper error: {stderr}")
            
            # Verificar que el archivo se creó
            if not os.path.exists(audio_path):
                raise Exception("El archivo de audio no se generó")
        
        return jsonify({
            'status': 'success',
            'audio_path': f'/static/audio/{audio_filename}'
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# Ruta para servir los audios de números
@app.route('/static/audio/numero<int:numero>.mp3')
def servir_audio_numero(numero):
    audio_filename = f"numero{numero}.mp3"
    audio_path = os.path.join(AUDIO_FOLDER, audio_filename)
    
    if not os.path.exists(audio_path):
        # Intenta generar el audio si no existe
        try:
            generar_numero_audio(numero)
        except:
            return "Audio no encontrado", 404
    
    return send_file(audio_path, mimetype='audio/mpeg')

@app.route('/audio/welcome.mp3')
def get_audio():
    # Esperar hasta que el archivo de audio exista (máximo 10 segundos)
    timeout = 10
    start_time = time.time()
    
    while not os.path.exists(WELCOME_AUDIO_PATH):
        if time.time() - start_time > timeout:
            return "Audio no disponible", 404
        time.sleep(0.1)
    
    return send_file(WELCOME_AUDIO_PATH)
@app.route('/enviar_mensaje', methods=['POST'])
def enviar_mensaje():
    try:
        data = request.get_json()
        mensaje = data.get('mensaje', '')
        personalidad = data.get('personalidad', None)  # Obtenemos la personalidad del frontend
        
        if not mensaje:
            return jsonify({'error': 'Mensaje vacío'}), 400
            
        # Obtener el generador de respuestas, pasando la personalidad
        respuesta_generator = tutor.enviar_mensaje(mensaje, personalidad)
        
        # Para la primera respuesta, generamos todo para el audio
        respuesta_completa = "".join(respuesta_generator)
        
        # Guardar la conversación en el historial
        guardar_historial(mensaje, respuesta_completa)
        
        # Generar audio de la respuesta
        return jsonify({
            'respuesta': respuesta_completa,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

def limpiar_texto_para_piper(texto):
    """Limpia el texto conservando caracteres especiales y traduciendo operadores matemáticos"""
    # Reemplazar operadores matemáticos
    reemplazos_operadores = {
        '+': ' más ',
        '-': ' menos ',
        '*': ' por ',
        '/': ' dividido entre ',
        '=': ' igual a ',
        '×': ' por ',
        '÷': ' dividido entre '
    }
    
    for operador, reemplazo in reemplazos_operadores.items():
        texto = texto.replace(operador, reemplazo)
    
    # Conservar caracteres especiales del español
    caracteres_permitidos = r'a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ¿¡\s\.,;:!?()\-"\''
    texto_limpio = re.sub(f'[^{caracteres_permitidos}]', '', texto)
    
    # Reemplazar caracteres especiales
    reemplazos_generales = {
        '“': '"',
        '”': '"',
        '‘': "'",
        '’': "'",
        '…': '...',
        '—': '-'
    }
    
    for original, reemplazo in reemplazos_generales.items():
        texto_limpio = texto_limpio.replace(original, reemplazo)
        
    # Limpiar espacios múltiples
    texto_limpio = re.sub(r'\s+', ' ', texto_limpio).strip()
        
    return texto_limpio

def generar_audio(texto):
    """Genera el audio con Piper TTS y devuelve la ruta del archivo"""
    try:
        texto_limpio = limpiar_texto_para_piper(texto)
        
        # Nombre único y seguro para el archivo
        audio_filename = secure_filename(f"audio_{uuid.uuid4().hex}.wav")
        output_path = os.path.join(AUDIO_FOLDER, audio_filename)
        
        # Comando para generar el audio
        command = [
            PIPER_PATH, 
            "--model", MODEL_PATH,
            "--output_file", output_path
        ]
        
        # Ejecutar Piper con el texto
        with subprocess.Popen(
            command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            creationflags=subprocess.CREATE_NO_WINDOW
        ) as process:
            process.communicate(input=texto_limpio.encode('utf-8'))
        
        # Verificar que el archivo se creó
        if os.path.exists(output_path):
            return output_path
        else:
            print("Error: No se generó el archivo de audio")
            return None
            
    except Exception as e:
        print(f"Error al generar audio: {str(e)}")
        return None

@app.route('/audio/<filename>')
def servir_audio(filename):
    """Sirve archivos de audio desde el directorio static/audio"""
    try:
        safe_filename = secure_filename(filename)
        return send_file(os.path.join(AUDIO_FOLDER, safe_filename))
    except FileNotFoundError:
        return "Archivo no encontrado", 404

def guardar_historial(mensaje, respuesta):
    """Guarda el historial de conversación en un archivo"""
    try:
        if not os.path.exists("historial"):
            os.makedirs("historial")
            
        fecha_actual = datetime.now().strftime("%Y-%m-%d")
        archivo_historial = f"historial/conversacion_{fecha_actual}.txt"
        
        with open(archivo_historial, "a", encoding="utf-8") as f:
            f.write(f"Usuario: {mensaje}\n")
            f.write(f"Raúl: {respuesta}\n\n")
            
    except Exception as e:
        print(f"Error al guardar historial: {str(e)}")
@app.route('/eliminar_audio', methods=['POST'])
def eliminar_audio():
    data = request.get_json()
    ruta_audio = data.get('archivo')  # Por ejemplo: "/static/audio/temp1234.mp3"

    # Asegúrate de convertirlo a ruta absoluta segura
    ruta_absoluta = os.path.join(os.getcwd(), ruta_audio.lstrip('/'))

    try:
        if os.path.exists(ruta_absoluta):
            os.remove(ruta_absoluta)
            return jsonify({'mensaje': 'Archivo eliminado'}), 200
        else:
            return jsonify({'error': 'Archivo no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/generar_audio', methods=['POST'])
def generar_audio_endpoint():
    try:
        data = request.get_json()
        texto = data.get('texto', '')
        nombre_archivo = data.get('nombre_archivo', '')
        
        if not texto or not nombre_archivo:
            return jsonify({'error': 'Texto o nombre de archivo faltante'}), 400
        
        # Limpiar el texto para Piper TTS
        texto_limpio = limpiar_texto_para_piper(texto)
        
        # Asegurar que el directorio de audio existe
        os.makedirs(AUDIO_FOLDER, exist_ok=True)
        
        # Ruta completa del archivo
        audio_path = os.path.join(AUDIO_FOLDER, nombre_archivo)
        
        # Generar el audio con Piper TTS
        cmd = [
            PIPER_PATH,
            "--model", MODEL_PATH,
            "--output_file", audio_path
        ]
        
        process = subprocess.Popen(cmd, stdin=subprocess.PIPE, text=True)
        process.communicate(input=texto_limpio)
        
        return jsonify({
            'status': 'success',
            'audio_path': f'/static/audio/{nombre_archivo}'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5000)