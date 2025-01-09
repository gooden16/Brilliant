import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Save } from 'lucide-react';
import type { TranscriptionSegment } from '../types';

export default function SessionRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptionSegment[]>([]);
  const [canvas, setCanvas] = useState({
    keyMetrics: [] as string[],
    features: [] as string[],
    users: [] as string[],
  });

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setTranscriptSegments(prev => [
        ...prev,
        { text: transcript, timestamp: Date.now() }
      ]);
      
      const words = transcript.toLowerCase().split(' ');
      if (words.includes('metric') || words.includes('kpi')) {
        setCanvas(prev => ({
          ...prev,
          keyMetrics: [...prev.keyMetrics, transcript]
        }));
      }
      if (words.includes('feature') || words.includes('functionality')) {
        setCanvas(prev => ({
          ...prev,
          features: [...prev.features, transcript]
        }));
      }
      if (words.includes('user') || words.includes('customer')) {
        setCanvas(prev => ({
          ...prev,
          users: [...prev.users, transcript]
        }));
      }
      
      resetTranscript();
    }
  }, [transcript]);

  const toggleRecording = () => {
    if (isRecording) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsRecording(!isRecording);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-center py-12">
        <p className="text-burgundy font-montserrat">Browser doesn't support speech recognition.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-playfair font-bold mb-8 text-navy">Session Recording</h2>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-playfair font-bold text-navy">Transcription</h3>
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-full transition-colors ${
                isRecording 
                  ? 'bg-burgundy text-white' 
                  : 'bg-light-grey text-navy hover:bg-light-medium-grey'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>

          <div className="h-[600px] overflow-y-auto bg-cream rounded-lg p-4">
            {transcriptSegments.map((segment, index) => (
              <div key={index} className="mb-3">
                <span className="text-gold text-sm font-montserrat">
                  {new Date(segment.timestamp).toLocaleTimeString()}:
                </span>
                <p className="ml-2 text-navy font-montserrat">{segment.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h3 className="text-xl font-playfair font-bold text-navy">Canvas</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-montserrat font-medium text-navy mb-2">Key Metrics</h4>
              <ul className="bg-cream p-4 rounded-lg min-h-[120px] space-y-2">
                {canvas.keyMetrics.map((metric, index) => (
                  <li key={index} className="text-navy font-montserrat p-2 bg-white rounded shadow-sm">
                    {metric}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-montserrat font-medium text-navy mb-2">Features</h4>
              <ul className="bg-cream p-4 rounded-lg min-h-[120px] space-y-2">
                {canvas.features.map((feature, index) => (
                  <li key={index} className="text-navy font-montserrat p-2 bg-white rounded shadow-sm">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-montserrat font-medium text-navy mb-2">Users</h4>
              <ul className="bg-cream p-4 rounded-lg min-h-[120px] space-y-2">
                {canvas.users.map((user, index) => (
                  <li key={index} className="text-navy font-montserrat p-2 bg-white rounded shadow-sm">
                    {user}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 bg-deep-olive text-white font-montserrat font-medium py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}