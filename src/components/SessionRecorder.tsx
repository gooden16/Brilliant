import { useState, useRef, useEffect } from 'react';
import {
  Save,
  ArrowLeft,
  Pencil,
  Trash2,
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
  Check,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { UserItem, FeatureItem, MetricItem } from '../types';
import { useSupabase } from '../contexts/SupabaseContext';
import ClientOnboarding from './onboarding/ClientOnboarding';

interface SessionRecorderProps {
  onBack?: () => void;
}

interface EditingState {
  id: string | null;
  type: 'metric' | 'feature' | 'user' | null;
  name: string;
  icon?: string;
  graphType?: 'bar' | 'line' | 'pie';
}

export default function SessionRecorder({ onBack }: SessionRecorderProps) {
  const { session } = useSupabase();
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [transcriptSegments, setTranscriptSegments] = useState<string[]>([]);
  const [editing, setEditing] = useState<EditingState>({
    id: null,
    type: null,
    name: '',
    icon: undefined,
    graphType: undefined
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        
        if (event.results[last].isFinal) {
          setTranscriptSegments(prev => [...prev, transcript]);
          setCurrentTranscript('');
        } else {
          setCurrentTranscript(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        if (isRecording) {
          try {
            recognition.start();
          } catch (e) {
            console.error('Failed to restart recognition:', e);
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

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      if (isRecording) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
      setIsRecording(!isRecording);
    } catch (e) {
      console.error('Failed to toggle recording:', e);
      setIsRecording(false);
    }
  };

  const handleDelete = (id: string, type: 'metric' | 'feature' | 'user') => {
    switch (type) {
      case 'metric':
        setMetrics(prev => prev.filter(metric => metric.id !== id));
        break;
      case 'feature':
        setFeatures(prev => prev.filter(feature => feature.id !== id));
        break;
      case 'user':
        setUsers(prev => prev.filter(user => user.id !== id));
        break;
    }
  };

  const handleAdd = (type: 'metric' | 'feature' | 'user') => {
    const id = self.crypto.randomUUID();
    switch (type) {
      case 'metric':
        setMetrics(prev => [...prev, { id, name: 'New Metric', graphType: 'line' }]);
        setEditing({ id, type, name: 'New Metric', graphType: 'line' });
        break;
      case 'feature':
        setFeatures(prev => [...prev, { id, name: 'New Feature', icon: 'settings' }]);
        setEditing({ id, type, name: 'New Feature', icon: 'settings' });
        break;
      case 'user':
        setUsers(prev => [...prev, { id, name: 'New User Type', icon: 'user-circle' }]);
        setEditing({ id, type, name: 'New User Type', icon: 'user-circle' });
        break;
    }
  };

  const handleEdit = (item: MetricItem | FeatureItem | UserItem, type: 'metric' | 'feature' | 'user') => {
    setEditing({
      id: item.id,
      type,
      name: item.name,
      icon: 'icon' in item ? item.icon : undefined,
      graphType: 'graphType' in item ? item.graphType : undefined
    });
  };

  const handleSaveEdit = () => {
    if (!editing.id || !editing.type) return;

    switch (editing.type) {
      case 'metric':
        setMetrics(prev => prev.map(metric => 
          metric.id === editing.id 
            ? { ...metric, name: editing.name, graphType: editing.graphType as 'bar' | 'line' | 'pie' }
            : metric
        ));
        break;
      case 'feature':
        setFeatures(prev => prev.map(feature =>
          feature.id === editing.id
            ? { ...feature, name: editing.name, icon: editing.icon as string }
            : feature
        ));
        break;
      case 'user':
        setUsers(prev => prev.map(user =>
          user.id === editing.id
            ? { ...user, name: editing.name, icon: editing.icon as string }
            : user
        ));
        break;
    }

    setEditing({ id: null, type: null, name: '', icon: undefined, graphType: undefined });
  };

  const handleCancelEdit = () => {
    setEditing({ id: null, type: null, name: '', icon: undefined, graphType: undefined });
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'user-circle': <UserCircle className="w-5 h-5" />,
      'building-2': <Building2 className="w-5 h-5" />,
      'users': <Users className="w-5 h-5" />,
      'wallet': <Wallet className="w-5 h-5" />,
      'activity': <Activity className="w-5 h-5" />,
      'trending-up': <TrendingUp className="w-5 h-5" />
    };
    return icons[iconName] || <Settings className="w-5 h-5" />;
  };

  const getGraphIcon = (type: 'bar' | 'line' | 'pie') => {
    const icons = {
      'bar': <BarChart3 className="w-5 h-5" />,
      'line': <LineChart className="w-5 h-5" />,
      'pie': <PieChart className="w-5 h-5" />
    };
    return icons[type];
  };

  const renderEditableItem = (
    item: MetricItem | FeatureItem | UserItem,
    type: 'metric' | 'feature' | 'user'
  ) => {
    const isEditing = editing.id === item.id;

    if (isEditing) {
      return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-grow">
            {type === 'metric' ? (
              <select
                value={editing.graphType}
                onChange={(e) => setEditing(prev => ({ ...prev, graphType: e.target.value as 'bar' | 'line' | 'pie' }))}
                className="bg-white/10 text-cream border-none rounded p-1"
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            ) : (
              <select
                value={editing.icon}
                onChange={(e) => setEditing(prev => ({ ...prev, icon: e.target.value }))}
                className="bg-white/10 text-cream border-none rounded p-1"
              >
                <option value="user-circle">User</option>
                <option value="users">Users</option>
                <option value="building-2">Building</option>
                <option value="wallet">Wallet</option>
                <option value="activity">Activity</option>
                <option value="trending-up">Trending</option>
                <option value="settings">Settings</option>
              </select>
            )}
            <input
              type="text"
              value={editing.name}
              onChange={(e) => setEditing(prev => ({ ...prev, name: e.target.value }))}
              className="bg-white/10 text-cream border-none rounded px-2 py-1 flex-grow"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveEdit}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-cream/60 hover:text-cream"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-cream/60 hover:text-cream"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between group">
        <div className="flex items-center gap-3">
          {type === 'metric' 
            ? getGraphIcon((item as MetricItem).graphType)
            : getIconComponent((item as FeatureItem | UserItem).icon)
          }
          <p className="text-sm">{item.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(item, type)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-cream/60 hover:text-cream"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(item.id, type)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-cream/60 hover:text-cream"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const handleSave = async () => {
    if (!session?.user) {
      alert('You must be logged in to save a canvas');
      return;
    }

    const canvasName = `Canvas ${new Date().toLocaleDateString()}`;
    const canvasId = self.crypto.randomUUID();

    try {
      const { error } = await supabase
        .from('canvases')
        .insert([
          {
            id: canvasId,
            name: canvasName,
            type: 'property',
            key_metrics: metrics.map(m => m.name),
            features: features.map(f => f.name),
            users: users.map(u => u.name),
            transcription: transcriptSegments.join('\n'),
            status: 'draft',
            user_id: session.user.id
          }
        ]);

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
            <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-playfair">Financial Advisory Canvas</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-montserrat font-medium">Key Metrics</h4>
                    <button 
                      onClick={() => handleAdd('metric')}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {metrics.map((metric) => renderEditableItem(metric, 'metric'))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-montserrat font-medium">Features</h4>
                    <button 
                      onClick={() => handleAdd('feature')}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {features.map((feature) => renderEditableItem(feature, 'feature'))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-montserrat font-medium">Users</h4>
                    <button 
                      onClick={() => handleAdd('user')}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {users.map((user) => renderEditableItem(user, 'user'))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Transcript Section */}
          <div className="bg-navy/50 rounded-xl p-6 backdrop-blur-sm border border-white/5">
            <h3 className="text-xl font-playfair mb-6">Live Transcript</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
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
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-light-blue text-navy font-medium py-4 px-12 rounded-xl hover:bg-opacity-90 transition-colors flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Confirm Canvas
        </button>
      </div>
    </div>
  );
}