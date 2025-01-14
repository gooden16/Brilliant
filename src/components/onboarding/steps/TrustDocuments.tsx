import { useState } from 'react';
import { Upload, X, FileCheck, Plus, User } from 'lucide-react';
import type { Individual } from '../../../types';

interface TrustDocumentsProps {
  onComplete: (documents: string[], trustees: Partial<Individual>[]) => void;
}

interface Trustee {
  firstName: string;
  lastName: string;
  email: string;
}

export default function TrustDocuments({ onComplete }: TrustDocumentsProps) {
  const [documents, setDocuments] = useState<string[]>([]);
  const [trustees, setTrustees] = useState<Trustee[]>([{ firstName: '', lastName: '', email: '' }]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentSection, setCurrentSection] = useState<'documents' | 'trustees'>('documents');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // In a real implementation, you would handle file upload here
    // For now, we'll just simulate it
    setDocuments(prev => [...prev, 'Trust_Document.pdf']);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      // In a real implementation, you would handle file upload here
      // For now, we'll just simulate it
      setDocuments(prev => [...prev, e.target.files![0].name]);
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTrustee = () => {
    setTrustees(prev => [...prev, { firstName: '', lastName: '', email: '' }]);
  };

  const handleRemoveTrustee = (index: number) => {
    setTrustees(prev => prev.filter((_, i) => i !== index));
  };

  const handleTrusteeChange = (index: number, field: keyof Trustee, value: string) => {
    setTrustees(prev => prev.map((trustee, i) => 
      i === index ? { ...trustee, [field]: value } : trustee
    ));
  };

  const handleSubmit = () => {
    // Convert trustees to Individual type
    const trusteeIndividuals = trustees.map(trustee => ({
      firstName: trustee.firstName,
      lastName: trustee.lastName,
      email: trustee.email,
      kycStatus: 'pending' as const
    }));

    onComplete(documents, trusteeIndividuals);
  };

  const renderDocumentsSection = () => (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-8 transition-colors ${
          isDragging ? 'border-dusty-pink bg-white/5' : 'border-white/20'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-cream/60" />
        <p className="text-lg mb-2">Drag and drop your trust documents here</p>
        <p className="text-sm text-cream/60 mb-4">or</p>
        <label className="inline-block bg-dusty-pink text-navy font-medium py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer">
          Browse Files
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
          />
        </label>
      </div>

      {documents.length > 0 && (
        <div className="space-y-4 mb-8">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white/5 rounded-lg p-4"
            >
              <div className="flex items-center">
                <FileCheck className="w-5 h-5 mr-3 text-dusty-pink" />
                <span>{doc}</span>
              </div>
              <button
                onClick={() => handleRemoveDocument(index)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTrusteesSection = () => (
    <div className="space-y-6">
      {trustees.map((trustee, index) => (
        <div key={index} className="bg-white/5 rounded-xl p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center">
              <User className="w-5 h-5 mr-2" />
              Trustee {index + 1}
            </h4>
            {trustees.length > 1 && (
              <button
                onClick={() => handleRemoveTrustee(index)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={trustee.firstName}
                onChange={(e) => handleTrusteeChange(index, 'firstName', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={trustee.lastName}
                onChange={(e) => handleTrusteeChange(index, 'lastName', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-cream/80 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={trustee.email}
              onChange={(e) => handleTrusteeChange(index, 'email', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-cream placeholder-cream/30 focus:ring-2 focus:ring-dusty-pink focus:border-transparent transition-colors"
            />
          </div>
        </div>
      ))}

      <button
        onClick={handleAddTrustee}
        className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl text-cream/60 hover:text-cream hover:border-white/40 transition-colors flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Another Trustee
      </button>
    </div>
  );

  const isDocumentsValid = documents.length > 0;
  const isTrusteesValid = trustees.every(t => 
    t.firstName.trim() && t.lastName.trim() && t.email.trim()
  );

  return (
    <div>
      <h3 className="text-2xl font-playfair mb-6">Trust Documentation</h3>
      
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setCurrentSection('documents')}
          className={`flex-1 pb-4 text-center border-b-2 transition-colors ${
            currentSection === 'documents'
              ? 'border-dusty-pink text-cream'
              : 'border-white/10 text-cream/40'
          }`}
        >
          Trust Documents
        </button>
        <button
          onClick={() => setCurrentSection('trustees')}
          className={`flex-1 pb-4 text-center border-b-2 transition-colors ${
            currentSection === 'trustees'
              ? 'border-dusty-pink text-cream'
              : 'border-white/10 text-cream/40'
          }`}
        >
          Trustees
        </button>
      </div>

      {currentSection === 'documents' && renderDocumentsSection()}
      {currentSection === 'trustees' && renderTrusteesSection()}

      <div className="flex justify-between mt-8">
        {currentSection === 'documents' ? (
          <button
            onClick={() => setCurrentSection('trustees')}
            disabled={!isDocumentsValid}
            className="w-full bg-dusty-pink text-navy font-medium py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Trustees
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isDocumentsValid || !isTrusteesValid}
            className="w-full bg-dusty-pink text-navy font-medium py-4 px-6 rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}