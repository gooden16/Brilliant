import { useState, useRef, useEffect, DragEvent } from 'react';
import {
  Save,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Shield,
  Users,
  UserCircle,
  Building2,
  BarChart3,
  LineChart,
  PieChart,
  Settings,
  Wallet,
  Activity,
  TrendingUp,
  Mic,
  MicOff,
  Plus,
  GripHorizontal,
  X,
  Trash2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import type { UserItem, FeatureItem, MetricItem } from '../types';
import { useSupabase } from '../contexts/SupabaseContext';
import ClientOnboarding from './onboarding/ClientOnboarding';

interface SessionRecorderProps {
  onBack?: () => void;
}

interface BlockTemplate {
  id: string;
  type: 'metric' | 'feature' | 'user';
  name: string;
  icon?: string;
  graphType?: 'bar' | 'line' | 'pie';
  description: string;
}

export default function SessionRecorder({ onBack }: SessionRecorderProps) {
  const { session } = useSupabase();
  const [isRecording, setIsRecording] = useState(false);
  const [canvasName, setCanvasName] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [transcriptSegments, setTranscriptSegments] = useState<string[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<BlockTemplate[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<BlockTemplate | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const blockTemplates: BlockTemplate[] = [
    {
      id: 'balance',
      type: 'metric',
      name: 'Balance',
      graphType: 'line',
      description: 'Track account balance over time'
    },
    {
      id: 'return-rate',
      type: 'metric',
      name: 'Rate of Return',
      graphType: 'line',
      description: 'Monitor investment performance'
    },
    {
      id: 'operating-account',
      type: 'feature',
      name: 'Operating Account',
      icon: 'building',
      description: 'Primary business account'
    },
    {
      id: 'reserve-account',
      type: 'feature',
      name: 'Reserve Account',
      icon: 'wallet',
      description: 'Savings and emergency funds'
    },
    {
      id: 'ach-payments',
      type: 'feature',
      name: 'Payments - ACH',
      icon: 'wallet',
      description: 'Bank transfer payments'
    },
    {
      id: 'wire-payments',
      type: 'feature',
      name: 'Payments - Wire',
      icon: 'wallet',
      description: 'Wire transfer payments'
    },
    {
      id: 'check-payments',
      type: 'feature',
      name: 'Payments - Checks',
      icon: 'wallet',
      description: 'Check payment processing'
    },
    {
      id: 'physical-card',
      type: 'feature',
      name: 'Physical Payment Card',
      icon: 'credit-card',
      description: 'Physical debit/credit card'
    },
    {
      id: 'virtual-card',
      type: 'feature',
      name: 'Virtual Payment Card',
      icon: 'smartphone',
      description: 'Virtual card for online payments'
    },
    {
      id: 'credit-line',
      type: 'feature',
      name: 'Credit Line with Float',
      icon: 'trending-up',
      description: 'Flexible credit line facility'
    },
    {
      id: 'secured-loan',
      type: 'feature',
      name: 'Secured Loan',
      icon: 'shield',
      description: 'Asset-backed lending'
    },
    {
      id: 'accept-payments',
      type: 'feature',
      name: 'Accept Payments',
      icon: 'wallet',
      description: 'Receive customer payments'
    },
    {
      id: 'vendor-portal',
      type: 'feature',
      name: 'Vendor Portal',
      icon: 'building-2',
      description: 'Manage vendor relationships'
    },
    {
      id: 'client-portal',
      type: 'feature',
      name: 'Client Portal',
      icon: 'users',
      description: 'Client self-service portal'
    },
    {
      id: 'spouse',
      type: 'user',
      name: 'Spouse',
      icon: 'user-circle',
      description: 'Spouse access and permissions'
    },
    {
      id: 'child',
      type: 'user',
      name: 'Child',
      icon: 'user-circle',
      description: 'Child access and permissions'
    },
    {
      id: 'operator',
      type: 'user',
      name: 'Operator',
      icon: 'user-circle',
      description: 'Day-to-day operations access'
    },
    {
      id: 'manager',
      type: 'user',
      name: 'Manager',
      icon: 'user-circle',
      description: 'Management level access'
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        logger.info('Speech recognition result received', { 
          isFinal: event.results[last].isFinal,
          confidence: event.results[last][0].confidence 
        });
        
        if (event.results[last].isFinal) {
          setTranscriptSegments(prev => [...prev, transcript]);
          setCurrentTranscript('');
        } else {
          setCurrentTranscript(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        logger.error('Speech recognition error', { 
          error: event.error,
          message: event.message 
        });
        setIsRecording(false);
      };

      recognition.onend = () => {
        logger.info('Speech recognition ended', { wasRecording: isRecording });
        if (isRecording) {
          try {
            recognition.start();
          } catch (e) {
            logger.error('Failed to restart recognition', { error: e });
            setIsRecording(false);
          }
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, block: BlockTemplate) => {
    setDraggedBlock(block);
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'copy';

    // Create a drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 20);

    // Remove the drag image after it's no longer needed
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (draggedBlock && !selectedBlocks.find(b => b.id === draggedBlock.id)) {
      setSelectedBlocks(prev => [...prev, draggedBlock]);
    }
    setDraggedBlock(null);
  };

  const handleRemoveBlock = (blockId: string) => {
    setSelectedBlocks(prev => prev.filter(b => b.id !== blockId));
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      logger.warn('Speech recognition not supported');
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      logger.info('Toggling recording state', { currentState: isRecording });
      if (isRecording) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
      setIsRecording(!isRecording);
    } catch (e) {
      logger.error('Failed to toggle recording', { error: e });
      setIsRecording(false);
    }
  };

  const handleSave = async () => {
    if (!session?.user) {
      alert('You must be logged in to save a canvas');
      return;
    }

    const canvasId = self.crypto.randomUUID();

    try {
      const { error } = await supabase
        .from('canvases')
        .insert([{
          id: canvasId,
          name: canvasName,
          type: 'property',
          key_metrics: selectedBlocks.filter(b => b.type === 'metric').map(m => m.name),
          features: selectedBlocks.filter(b => b.type === 'feature').map(f => f.name),
          users: selectedBlocks.filter(b => b.type === 'user').map(u => u.name),
          transcription: transcriptSegments.join('\n'),
          status: 'draft',
          user_id: session.user.id
        }]);

      if (error) throw error;
      setShowOnboarding(true);
    } catch (error) {
      console.error('Error saving canvas:', error);
      alert('Failed to save canvas');
    }
  };

  if (showOnboarding) {
    return <ClientOnboarding />;
  }

  const BlockList = ({ type, title }: { type: 'metric' | 'feature' | 'user', title: string }) => (
    <div>
      <h4 className="font-montserrat font-medium mb-3">{title}</h4>
      <div className="space-y-2">
        {blockTemplates.filter(block => block.type === type).map(block => (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => handleDragStart(e, block)}
            className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center gap-2 cursor-move hover:bg-white/10 transition-colors group relative"
          >
            <GripHorizontal className="w-3 h-3 text-cream/40 group-hover:text-cream/60" />
            {block.type === 'metric' ? (
              block.graphType === 'line' ? <LineChart className="w-4 h-4 text-dusty-pink" /> :
              block.graphType === 'bar' ? <BarChart3 className="w-4 h-4 text-dusty-pink" /> :
              <PieChart className="w-4 h-4 text-dusty-pink" />
            ) : (
              block.icon === 'settings' ? <Settings className="w-4 h-4 text-dusty-pink" /> :
              block.icon === 'users' ? <Users className="w-4 h-4 text-dusty-pink" /> :
              block.icon === 'wallet' ? <Wallet className="w-4 h-4 text-dusty-pink" /> :
              block.icon === 'building-2' ? <Building2 className="w-4 h-4 text-dusty-pink" /> :
              block.icon === 'user-circle' ? <UserCircle className="w-4 h-4 text-dusty-pink" /> :
              <Activity className="w-4 h-4 text-dusty-pink" />
            )}
            <div>
              <p className="text-sm">{block.name}</p>
              <p className="text-xs text-cream/60">{block.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy text-cream">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-playfair">Canvas Builder</h2>
              <input
                type="text"
                value={canvasName}
                onChange={(e) => setCanvasName(e.target.value)}
                placeholder="Enter canvas name"
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors w-64"
              />
            </div>
          </div>
          <button
            onClick={toggleRecording}
            className={`p-4 rounded-full transition-colors ${
              isRecording 
                ? 'bg-gold text-navy' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Canvas Section */}
            <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5 relative">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`min-h-[400px] border-2 border-dashed rounded-xl p-4 ${
                  selectedBlocks.length === 0 
                    ? isDraggingOver 
                      ? 'border-dusty-pink border-white/40 bg-white/5'
                      : 'border-white/20'
                    : isDraggingOver
                      ? 'border-dusty-pink border-white/40 bg-white/5'
                      : 'border-white/10'
                }`}
              >
                {selectedBlocks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-cream/40 gap-4">
                    <Plus className="w-8 h-8" />
                    <p>Drag blocks here to build your canvas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedBlocks.map((block) => (
                      <div
                        key={block.id}
                        className="bg-white/10 p-4 rounded-xl flex items-center justify-between group animate-fadeIn"
                      >
                        <div className="flex items-center gap-3">
                          {block.type === 'metric' ? (
                            block.graphType === 'line' ? <LineChart className="w-4 h-4 text-dusty-pink" /> :
                            block.graphType === 'bar' ? <BarChart3 className="w-4 h-4 text-dusty-pink" /> :
                            <PieChart className="w-4 h-4 text-dusty-pink" />
                          ) : (
                            block.icon === 'settings' ? <Settings className="w-4 h-4 text-dusty-pink" /> :
                            block.icon === 'users' ? <Users className="w-4 h-4 text-dusty-pink" /> :
                            block.icon === 'wallet' ? <Wallet className="w-4 h-4 text-dusty-pink" /> :
                            block.icon === 'building-2' ? <Building2 className="w-4 h-4 text-dusty-pink" /> :
                            block.icon === 'user-circle' ? <UserCircle className="w-4 h-4 text-dusty-pink" /> :
                            block.icon === 'credit-card' ? <CreditCard className="w-4 h-4 text-dusty-pink" /> :
                            block.icon === 'smartphone' ? <Smartphone className="w-4 h-4 text-dusty-pink" /> :
                            block.icon === 'shield' ? <Shield className="w-4 h-4 text-dusty-pink" /> :
                            <Activity className="w-4 h-4 text-dusty-pink" />
                          )}
                          <div>
                            <p className="text-sm">{block.name}</p>
                            <p className="text-xs text-cream/60">{block.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveBlock(block.id)}
                          className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3 h-3 text-burgundy" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Available Blocks Section */}
            <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
              <h3 className="text-xl font-playfair mb-6">Available Blocks</h3>
              <div className="space-y-6">
                <BlockList type="metric" title="Key Metrics" />
                <BlockList type="feature" title="Features" />
                <BlockList type="user" title="Users" />
              </div>
            </div>
          </div>

          {/* Live Transcript Section */}
          <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
            <h3 className="text-xl font-playfair mb-6">Live Transcript</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {transcriptSegments.map((text, index) => (
                  <div
                    key={index}
                    className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-xl ${
                        index % 2 === 0
                          ? 'bg-dusty-pink text-navy ml-auto'
                          : 'bg-white/5 text-cream mr-auto border border-white/5'
                      }`}
                    >
                      <p className="text-sm">{text}</p>
                    </div>
                  </div>
                ))}
                {currentTranscript && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-4 rounded-xl bg-white/5 text-cream/50 mr-auto border border-white/5">
                      <p className="text-sm">{currentTranscript}</p>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!canvasName.trim()}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-light-blue text-navy font-medium py-4 px-12 rounded-xl hover:bg-opacity-90 transition-colors flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Confirm Canvas
        </button>
      </div>
    </div>
  );
}