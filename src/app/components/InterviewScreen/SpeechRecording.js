import React, { useState, useRef, useEffect, useCallback } from 'react';

export const useFullTranscriptSpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [fullTranscript, setFullTranscript] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const transcriptBufferRef = useRef('');
  const isRestartingRef = useRef(false);
  const silenceTimeoutRef = useRef(null);
  const lastSpeechTimeRef = useRef(Date.now());

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const createSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    
  
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    
    // Increase timeout values for better continuous recording
    if (recognition.serviceURI) {
      recognition.serviceURI = 'wss://www.google.com/speech-api/full-duplex/v1/up';
    }

    return recognition;
  }, []);

  // Handle speech results with buffer management
  const handleResults = useCallback((event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    // Process all results
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;

      if (result.isFinal) {
        finalTranscript += transcript + ' ';
        lastSpeechTimeRef.current = Date.now();
      } else {
        interimTranscript += transcript;
      }
    }

    // Update transcripts
    if (finalTranscript) {
      transcriptBufferRef.current += finalTranscript;
      setFullTranscript(prev => prev + finalTranscript);
    }

    setCurrentTranscript(interimTranscript);

    // Reset silence timeout when speech is detected
    if (finalTranscript || interimTranscript) {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      
      // Set a new silence timeout
      silenceTimeoutRef.current = setTimeout(() => {
        if (isRecording && recognitionRef.current) {
          console.log('Restarting due to silence...');
          restartRecognition();
        }
      }, 3000); // Restart after 3 seconds of silence
    }
  }, [isRecording]);

  // Restart recognition to prevent timeouts
  const restartRecognition = useCallback(() => {
    if (!isRecording || isRestartingRef.current) return;

    isRestartingRef.current = true;
    
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      setTimeout(() => {
        if (isRecording) {
          startRecognition();
        }
        isRestartingRef.current = false;
      }, 100);
    } catch (error) {
      console.error('Error restarting recognition:', error);
      isRestartingRef.current = false;
    }
  }, [isRecording]);

  
  const startRecognition = useCallback(() => {
    const recognition = createSpeechRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;

    recognition.onresult = handleResults;

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      
      switch (event.error) {
        case 'no-speech':
          // Restart on no speech
          if (isRecording && !isRestartingRef.current) {
            setTimeout(() => restartRecognition(), 100);
          }
          break;
        case 'audio-capture':
          setError('Microphone not accessible. Please check permissions.');
          break;
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone access.');
          break;
        case 'network':
          setError('Network error. Please check your connection.');
          if (isRecording && !isRestartingRef.current) {
            setTimeout(() => restartRecognition(), 1000);
          }
          break;
        default:
          if (isRecording && !isRestartingRef.current) {
            setTimeout(() => restartRecognition(), 500);
          }
      }
    };

    recognition.onend = () => {
      console.log('Recognition ended');
      if (isRecording && !isRestartingRef.current) {
        // Auto-restart to maintain continuous recording
        setTimeout(() => restartRecognition(), 100);
      }
    };

    recognition.onstart = () => {
      console.log('Recognition started');
      setError(null);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setError('Failed to start speech recognition');
    }
  }, [createSpeechRecognition, handleResults, isRecording, restartRecognition]);


  const startRecording = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition not supported');
      return;
    }

    setIsRecording(true);
    setError(null);
    setFullTranscript('');
    setCurrentTranscript('');
    transcriptBufferRef.current = '';
    lastSpeechTimeRef.current = Date.now();

    startRecognition();

    // Set up periodic restart to prevent timeouts
    restartTimeoutRef.current = setInterval(() => {
      if (Date.now() - lastSpeechTimeRef.current > 10000) { 
        console.log('Periodic restart...');
        restartRecognition();
      }
    }, 15000); // Check every 15 seconds
  }, [isSupported, startRecognition, restartRecognition]);

  
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    isRestartingRef.current = false;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (restartTimeoutRef.current) {
      clearInterval(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    
    setFullTranscript(prev => {
      const finalText = prev + transcriptBufferRef.current;
      transcriptBufferRef.current = '';
      return finalText;
    });
  }, []);


  const clearTranscript = useCallback(() => {
    setFullTranscript('');
    setCurrentTranscript('');
    transcriptBufferRef.current = '';
  }, []);

  
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (restartTimeoutRef.current) {
        clearInterval(restartTimeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  return {
    isRecording,
    fullTranscript,
    currentTranscript: currentTranscript,
    error,
    isSupported,
    startRecording,
    stopRecording,
    clearTranscript
  };
};

// Alternative: Chunked Recording with MediaRecorder for Server Processing
export const useChunkedAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const chunkIntervalRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1
        }
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          
          // Send chunk to server for transcription
          const audioBlob = new Blob([event.data], { type: 'audio/webm' });
          await sendAudioChunkForTranscription(audioBlob);
        }
      };

      mediaRecorder.start(2000); // Collect data every 2 seconds
      setIsRecording(true);
      setError(null);

    } catch (err) {
      setError('Failed to access microphone: ' + err.message);
    }
  }, []);

  const sendAudioChunkForTranscription = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/transcribe-chunk', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.transcript) {
        setTranscript(prev => prev + result.transcript + ' ');
      }
    } catch (error) {
      console.error('Error transcribing chunk:', error);
    }
  };

  const stopRecording = useCallback(() => {
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (chunkIntervalRef.current) {
      clearInterval(chunkIntervalRef.current);
    }
  }, []);

  return {
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    clearTranscript: () => setTranscript('')
  };
};

// Enhanced Voice Recorder Component
export const EnhancedVoiceRecorder = ({ onTranscriptChange, disabled }) => {
  const {
    isRecording,
    fullTranscript,
    currentTranscript,
    error,
    isSupported,
    startRecording,
    stopRecording,
    clearTranscript
  } = useFullTranscriptSpeechToText();

  // Notify parent of transcript changes
  useEffect(() => {
    if (onTranscriptChange) {
      onTranscriptChange(fullTranscript);
    }
  }, [fullTranscript, onTranscriptChange]);

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium">Speech recognition not supported</p>
        <p className="text-red-500 text-sm">Please use Chrome, Edge, or Safari for voice recording</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex justify-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={disabled}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            Stop Recording
          </button>
        )}
        
        {fullTranscript && (
          <button
            onClick={clearTranscript}
            className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Error:</p>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Recording Status */}
      {isRecording && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-700 font-medium">Recording in progress...</span>
          </div>
        </div>
      )}

      {/* Live Transcript Display */}
      {currentTranscript && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-600 font-medium mb-1">Currently speaking:</div>
          <div className="text-blue-800 italic">{currentTranscript}</div>
        </div>
      )}

      {/* Final Transcript Display */}
      {fullTranscript && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-green-600 font-medium">Complete Transcript:</div>
            <div className="text-xs text-green-500">
              {fullTranscript.split(' ').length} words
            </div>
          </div>
          <div className="text-green-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
            {fullTranscript}
          </div>
        </div>
      )}
    </div>
  );
};