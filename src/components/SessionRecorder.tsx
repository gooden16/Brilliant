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
import type { BlockTemplate, BlockGroup } from '../types';
import { useSupabase } from '../contexts/SupabaseContext';
import ClientOnboarding from './onboarding/ClientOnboarding';

interface SessionRecorderProps {
  onBack?: () => void;
}

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

export default function SessionRecorder({ onBack }: SessionRecorderProps) {
  const { session } = useSupabase();
  const [isRecording, setIsRecording] = useState(false);
  const [canvasName, setCanvasName] = useState('Your Canvas');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [transcriptSegments, setTranscriptSegments] = useState<string[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<BlockTemplate[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<BlockTemplate | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  const [blockGroups, setBlockGroups] = useState<BlockGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<BlockTemplate[]>([]);
  const [showSuggestionTooltip, setShowSuggestionTooltip] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    blockId: string;
  } | null>(null);

  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [blockSettings, setBlockSettings] = useState<Record<string, any>>({});
  const recognitionRef = useRef<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isInitializingRecording, setIsInitializingRecording] = useState(false);

  const handleSave = async () => {
    if (!session?.user) {
      alert('You must be logged in to save a canvas');
      return;
    }

    try {
      logger.info('Saving canvas', { 
        name: canvasName,
        blockCount: selectedBlocks.length 
      });

      const canvasId = crypto.randomUUID();
      const { error } = await supabase
        .from('canvases')
        .insert([{
          id: canvasId,
          name: canvasName,
          type: 'property',
          key_metrics: selectedBlocks
            .filter(b => b.type === 'metric')
            .map(m => m.name),
          features: selectedBlocks
            .filter(b => b.type === 'feature')
            .map(f => f.name),
          users: selectedBlocks
            .filter(b => b.type === 'user')
            .map(u => u.name),
          transcription: transcriptSegments.join('\n'),
          status: 'draft',
          user_id: session.user.id
        }]);

      if (error) throw error;
      
      logger.info('Canvas saved successfully', { canvasId });
      setShowOnboarding(true);
    } catch (error) {
      logger.error('Failed to save canvas', { error });
      alert('Failed to save canvas. Please try again.');
    }
  };

  const handleContextMenu = (e: React.MouseEvent, blockId: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      blockId
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);

    if (dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      setGhostPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // Rest of the code remains the same as the original file, with the modifications from the diff
    }
  }, [isRecording]);

  const toggleRecording = async () => {
    if (isInitializingRecording) return;
    
    if (!recognitionRef.current) {
      logger.warn('Speech recognition not supported');
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      setIsInitializingRecording(true);
      logger.info('Toggling recording state', { currentState: isRecording });
      
      if (isRecording) {
        recognitionRef.current.stop();
      } else {
        await recognitionRef.current.start();
      }
      
      setIsRecording(!isRecording);
    } catch (e) {
      logger.error('Failed to toggle recording', { error: e });
      setIsRecording(false);
    } finally {
      setIsInitializingRecording(false);
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, block: BlockTemplate) => {
    setDraggedBlock(block);
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'move';

    // Create a drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.5';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);

    // Remove the drag image after it's no longer needed
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (draggedBlock && !selectedBlocks.find(b => b.id === draggedBlock.id)) {
      const newBlock = { ...draggedBlock };
      setSelectedBlocks(prev => {
        const newBlocks = [...prev, newBlock];
        // Sort blocks by type: metrics first, then features, then users
        return newBlocks.sort((a, b) => {
          const typeOrder = { metric: 0, feature: 1, user: 2 };
          return typeOrder[a.type] - typeOrder[b.type];
        });
      });
    }
    setDraggedBlock(null);
  };

  const handleRemoveBlock = (blockId: string) => {
    setSelectedBlocks(prev => prev.filter(b => b.id !== blockId));
  };

  // Render method modifications
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
            <h2 className="text-2xl font-playfair">Canvas Builder</h2>
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

        <div className="grid grid-cols-2 gap-6">
          {/* Canvas Section */}
          <div className="space-y-6">
            <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5 max-h-[800px] overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={canvasName}
                    onChange={(e) => setCanvasName(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                    autoFocus
                    className="text-xl font-playfair bg-transparent border-b border-dusty-pink focus:outline-none"
                  />
                ) : (
                  <h3 
                    className="text-xl font-playfair cursor-pointer hover:text-dusty-pink transition-colors"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {canvasName}
                  </h3>
                )}
              </div>

              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`h-[700px] overflow-y-auto border-2 border-dashed rounded-xl p-4 transition-all duration-300 canvas-grid ${
                  selectedBlocks.length === 0 
                    ? isDraggingOver 
                      ? 'border-dusty-pink bg-white/5 scale-[1.02]'
                      : 'border-white/20 empty-canvas'
                    : isDraggingOver
                      ? 'border-dusty-pink bg-white/5 scale-[1.02]'
                      : 'border-white/10'
                }`}
              >
                {selectedBlocks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-cream/40 gap-6 animate-float">
                    <div className="relative">
                      <div className="absolute inset-0 bg-dusty-pink/20 rounded-full blur-xl animate-pulseGlow"></div>
                      <Plus className="w-12 h-12 relative" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-medium">Start Building Your Canvas</p>
                      <p className="text-sm">Drag blocks from the right to add them to your canvas</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedBlocks.map((block) => (
                      <div
                        key={block.id}
                        onContextMenu={(e) => handleContextMenu(e, block.id)}
                        className={`p-4 rounded-xl flex items-center justify-between group animate-fadeIn ${
                          block.type === 'metric' ? 'bg-dusty-pink/10 border border-dusty-pink/20 hover:bg-dusty-pink/20' :
                          block.type === 'feature' ? 'bg-gold/10 border border-gold/20 hover:bg-gold/20' :
                          'bg-light-blue/10 border border-light-blue/20 hover:bg-light-blue/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {block.type === 'metric' ? (
                            block.graphType === 'line' ? <LineChart className="w-4 h-4 text-dusty-pink" /> :
                            block.graphType === 'bar' ? <BarChart3 className="w-4 h-4 text-dusty-pink" /> :
                            <PieChart className="w-4 h-4 text-dusty-pink" />
                          ) : (
                            block.icon === 'settings' ? <Settings className="w-4 h-4 text-gold" /> :
                            block.icon === 'users' ? <Users className="w-4 h-4 text-gold" /> :
                            block.icon === 'wallet' ? <Wallet className="w-4 h-4 text-gold" /> :
                            block.icon === 'building-2' ? <Building2 className="w-4 h-4 text-gold" /> :
                            block.icon === 'user-circle' ? <UserCircle className="w-4 h-4 text-gold" /> :
                            block.icon === 'credit-card' ? <CreditCard className="w-4 h-4 text-gold" /> :
                            block.icon === 'smartphone' ? <Smartphone className="w-4 h-4 text-gold" /> :
                            block.icon === 'shield' ? <Shield className="w-4 h-4 text-gold" /> :
                            <Activity className="w-4 h-4 text-gold" />
                          )}
                          <div>
                            <p className="text-sm font-semibold tracking-wide">{block.name}</p>
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
          </div>

          {/* Available Blocks Section */}
          <div className="space-y-6 h-[800px] flex flex-col">
            <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5 max-h-[600px] overflow-y-auto">
              <h3 className="text-xl font-playfair mb-6">Available Blocks</h3>
              <div className="space-y-6">
                {/* Metrics Section */}
                <div>
                  <h4 className="font-montserrat font-medium mb-3">Key Metrics</h4>
                  <div className="space-y-2">
                    {blockTemplates.filter(block => block.type === 'metric').map(block => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, block)}
                        className="block-drag bg-dusty-pink/10 p-3 rounded-lg border border-dusty-pink/20 flex items-center gap-2 cursor-move hover:bg-dusty-pink/20 transition-all group relative animate-slideIn"
                      >
                        <GripHorizontal className="w-3 h-3 text-cream/40 group-hover:text-cream/60" />
                        {block.graphType === 'line' ? <LineChart className="w-4 h-4 text-dusty-pink" /> :
                         block.graphType === 'bar' ? <BarChart3 className="w-4 h-4 text-dusty-pink" /> :
                         <PieChart className="w-4 h-4 text-dusty-pink" />}
                        <div>
                          <p className="text-sm">{block.name}</p>
                          <p className="text-xs text-cream/60">{block.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Section */}
                <div>
                  <h4 className="font-montserrat font-medium mb-3">Features</h4>
                  <div className="space-y-2">
                    {blockTemplates.filter(block => block.type === 'feature').map(block => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, block)}
                        className="block-drag bg-gold/10 p-3 rounded-lg border border-gold/20 flex items-center gap-2 cursor-move hover:bg-gold/20 transition-all group relative animate-slideIn"
                      >
                        <GripHorizontal className="w-3 h-3 text-cream/40 group-hover:text-cream/60" />
                        {block.icon === 'settings' ? <Settings className="w-4 h-4 text-gold" /> :
                         block.icon === 'users' ? <Users className="w-4 h-4 text-gold" /> :
                         block.icon === 'wallet' ? <Wallet className="w-4 h-4 text-gold" /> :
                         block.icon === 'building-2' ? <Building2 className="w-4 h-4 text-gold" /> :
                         block.icon === 'credit-card' ? <CreditCard className="w-4 h-4 text-gold" /> :
                         block.icon === 'smartphone' ? <Smartphone className="w-4 h-4 text-gold" /> :
                         block.icon === 'shield' ? <Shield className="w-4 h-4 text-gold" /> :
                         <Activity className="w-4 h-4 text-gold" />}
                        <div>
                          <p className="text-sm">{block.name}</p>
                          <p className="text-xs text-cream/60">{block.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Users Section */}
                <div>
                  <h4 className="font-montserrat font-medium mb-3">Users</h4>
                  <div className="space-y-2">
                    {blockTemplates.filter(block => block.type === 'user').map(block => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, block)}
                        className="block-drag bg-light-blue/10 p-3 rounded-lg border border-light-blue/20 flex items-center gap-2 cursor-move hover:bg-light-blue/20 transition-all group relative animate-slideIn"
                      >
                        <GripHorizontal className="w-3 h-3 text-cream/40 group-hover:text-cream/60" />
                        <UserCircle className="w-4 h-4 text-light-blue" />
                        <div>
                          <p className="text-sm">{block.name}</p>
                          <p className="text-xs text-cream/60">{block.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Live Transcript Section */}
            <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5 flex-grow">
              <h3 className="text-xl font-playfair mb-6">Live Transcript</h3>
              <div className="space-y-4 h-[calc(100%-4rem)] overflow-y-auto">
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

            {/* Rest of the code remains the same */}
          </div>
        </div>
        
        {/* Confirm Canvas Button */}
        <button
          onClick={handleSave}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-light-blue text-navy font-medium py-4 px-12 rounded-xl hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Save className="w-5 h-5" />
          Confirm Canvas
        </button>
      </div>
    </div>
  );
}