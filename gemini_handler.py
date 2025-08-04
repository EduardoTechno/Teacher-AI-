import google.generativeai as genai
import os
import json  # <-- Esta es la línea que faltaba
from datetime import datetime

class TutorVirtual:
    def __init__(self):
        """Inicializa el modelo Gemini con manejo de errores"""
        try:
            # Configura tu API Key aquí
            self.API_KEY = os.getenv('GEMINI_API_KEY') or "API KEY"
            if not self.API_KEY or self.API_KEY == "TU_API_KEY_AQUI":
                raise ValueError("Por favor configura tu API Key de Gemini en la variable de entorno GEMINI_API_KEY")
                
            genai.configure(api_key=self.API_KEY)
            
            # Configuración del modelo
            generation_config = {
                "temperature": 0.7,
                "top_p": 1,
                "top_k": 32,
                "max_output_tokens": 2000,
            }
            
            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
            
            self.modelo = genai.GenerativeModel(
                model_name="gemini-2.0-flash",
                generation_config=generation_config,
                safety_settings=safety_settings
            )
            
            self.chat = self.modelo.start_chat(history=[])
            
        except Exception as e:
            raise Exception(f"Error al iniciar Gemini: {str(e)}")

    def establecer_personalidad(self, personalidad=None):
        """Define el comportamiento del tutor con la personalidad proporcionada"""
        try:
            
            # Solo establecer personalidad si se proporciona una
            if personalidad:
                self.chat.history.append({
                    'role': 'user',
                    'parts': [personalidad]
                })
            
        except Exception as e:
            raise Exception(f"Error al establecer personalidad: {str(e)}")

    def enviar_mensaje(self, mensaje, personalidad=None):
        """Envía mensaje al modelo con streaming pero manteniendo el historial"""
        try:
            # Establecer la personalidad proporcionada
            self.establecer_personalidad(personalidad)
                
            response = self.chat.send_message(mensaje, stream=True)
            for chunk in response:
                yield self._procesar_respuesta(chunk.text)
        except Exception as e:
            yield f"Error al enviar mensaje: {str(e)}"

    def _procesar_respuesta(self, texto):
        """Procesa la respuesta para hacerla más adecuada para TTS"""
        # Eliminar caracteres especiales que podrían causar problemas
        texto = texto.replace('*', '').replace('_', '')
        
        # Reemplazar puntos suspensivos
        texto = texto.replace('...', '…')
        
        # Limitar múltiples saltos de línea
        texto = '\n'.join([line.strip() for line in texto.split('\n') if line.strip()])
        
        return texto

    def reiniciar_chat(self):
        """Reinicia la conversación"""
        try:
            self.chat.history.clear()
            self.establecer_personalidad()
            return "Conversación reiniciada. ¿En qué puedo ayudarte hoy?"
        except Exception as e:
            raise Exception(f"Error al reiniciar chat: {str(e)}")

    def guardar_historial(self):
        """Guarda el historial de conversación en formato JSON"""
        try:
            if not os.path.exists("historial"):
                os.makedirs("historial")
                
            historial = []
            for msg in self.chat.history:
                historial.append({
                    'role': msg.role,
                    'parts': [part.text for part in msg.parts if hasattr(part, 'text')],
                    'timestamp': datetime.now().isoformat()
                })
                
            archivo_historial = f"historial/conversacion_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            with open(archivo_historial, "w", encoding='utf-8') as f:
                json.dump(historial, f, ensure_ascii=False, indent=2)
                
            return archivo_historial
        except Exception as e:
            raise Exception(f"Error al guardar historial: {str(e)}")
    
