import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { FileUpload } from './FileUploader';
import { ProcessingStatus } from './ProcessingStatus';
import { ResultsView } from './ResultsView';
import { HistoryView } from './HistoryView';
import { SettingsView } from './SettingView';
import { AnalyticsView } from './AnalyticsView';
import { DashboardOverview } from './DashboardOverview';
import { DemurrageCalculator } from './DemurrageCalculator';
import { TestResultsView } from './TestResultsView';
import { Chatbot } from '../Chatbot/Chatbot';
import { ProcessedFile, ProcessingJob } from '../../types/dashboard';
import { ActionCommand } from '../Chatbot/ChatbotService';
import toast from 'react-hot-toast';

export function Dashboard() {
  const [activeView, setActiveView] = useState<string>('overview');
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([]);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ProcessedFile | null>(null); // State to hold selected file for calculator
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    // Load processed files from localStorage on component mount
    try {
      const savedFiles = localStorage.getItem('processedFiles');
      console.log('Loading saved files:', savedFiles);
      
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        // Convert date strings back to Date objects
        const filesWithDates = parsedFiles.map((file: any) => ({
          ...file,
          processedAt: new Date(file.processedAt)
        }));
        console.log('Loaded files:', filesWithDates);
        setProcessedFiles(filesWithDates);
      } else {
        console.log('No saved files found');
        setProcessedFiles([]);
      }
    } catch (error) {
      console.error('Error loading processed files:', error);
      setProcessedFiles([]);
    }
  }, []);

  const addProcessingJob = (job: ProcessingJob) => {
    setProcessingJobs(prev => [...prev, job]);
  };

  const updateProcessingJob = (jobId: string, updates: Partial<ProcessingJob>) => {
    setProcessingJobs(prev => 
      prev.map(job => job.id === jobId ? { ...job, ...updates } : job)
    );
  };

  const addProcessedFile = (file: ProcessedFile) => {
    console.log('Adding processed file:', file.name);
    // Check if the file has valid extracted data
    if (!file.extractedData || !file.extractedData.events) {
      console.warn('File has no valid extracted data:', file.name);
      // Update the file status to failed if no events were extracted
      file.status = 'failed';
      file.extractedData = file.extractedData || { events: [] };
    }
    
    // Check if the data is sample data
    if (file.extractedData && file.extractedData.processingNote && 
        file.extractedData.processingNote.toLowerCase().includes('sample data')) {
      console.warn('File contains sample data:', file.name);
      file.status = 'failed';
      toast.error(`Processing failed: ${file.extractedData.processingNote}`);
    }
    
    const updatedFiles = [...processedFiles, file];
    setProcessedFiles(updatedFiles);
    try {
      localStorage.setItem('processedFiles', JSON.stringify(updatedFiles));
      console.log('Saved files to localStorage:', updatedFiles.length);
    } catch (error) {
      console.error('Error saving processed files:', error);
    }
  };

  const handleChatbotAction = useCallback((action: ActionCommand) => {
    console.log('Chatbot action received:', action);
    switch (action.type) {
      case 'NAVIGATE':
        if (action.payload) {
          setActiveView(action.payload);
          setChatbotOpen(false); // Close chatbot after navigation
        }
        break;
      case 'CALCULATE_DEMURRAGE_FROM_FILE':
        // This action would typically come with a file ID or name
        // For now, we'll just navigate to the calculator and assume user selects file
        setActiveView('demurrage-calculator');
        setChatbotOpen(false);
        break;
      default:
        console.warn('Unknown chatbot action type:', action.type);
    }
  }, []);

  const handleFileSelect = useCallback((file: ProcessedFile) => {
    console.log('Selecting file:', file.name);
    setSelectedFile(file);
    toast.success(`Selected file: ${file.name}`);
  }, []);

  const handleCalculateDemurrage = useCallback((file: ProcessedFile) => {
    setSelectedFile(file);
    setActiveView('demurrage-calculator');
    setChatbotOpen(false); // Close chatbot if open
    toast.success(`Calculating demurrage for "${file.name}"`);
  }, []);

  const renderActiveView = () => {
    console.log('Rendering view:', activeView, 'Files count:', processedFiles.length);
    
    try {
      switch (activeView) {
        case 'overview':
          return (
            <DashboardOverview 
              processedFiles={processedFiles}
              processingJobs={processingJobs}
              onNavigate={setActiveView}
            />
          );
        case 'upload':
          return (
            <FileUpload 
              onJobStart={addProcessingJob}
              onJobUpdate={updateProcessingJob}
              onFileProcessed={addProcessedFile}
            />
          );
        case 'processing':
          return <ProcessingStatus jobs={processingJobs} />;
        case 'results':
          console.log('🎯 Rendering Results view with files:', processedFiles?.length || 0);
          
          // Temporary: Use test component to verify rendering works
          if (processedFiles?.length === 0) {
            return <TestResultsView />;
          }
          
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Processing Results</h1>
                <p className="text-gray-600">{processedFiles?.length || 0} files processed</p>
              </div>
              <ResultsView 
                files={processedFiles || []}
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                onCalculateDemurrage={handleCalculateDemurrage}
              />
            </div>
          );
        case 'history':
          return (
            <HistoryView 
              files={processedFiles || []} 
              onFileSelect={handleFileSelect}
              onCalculateDemurrage={handleCalculateDemurrage}
            />
          );
        case 'analytics':
          return <AnalyticsView files={processedFiles || []} />;
        case 'settings':
          return <SettingsView />;
        case 'demurrage-calculator':
          return <DemurrageCalculator selectedFile={selectedFile} />;
        default:
          return (
            <DashboardOverview 
              processedFiles={processedFiles}
              processingJobs={processingJobs}
              onNavigate={setActiveView}
            />
          );
      }
    } catch (error) {
      console.error('Error rendering view:', error);
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading View</h2>
          <p className="text-gray-600 mb-4">There was an error loading the {activeView} view.</p>
          <button 
            onClick={() => setActiveView('overview')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Overview
          </button>
          <pre className="mt-4 p-4 bg-gray-100 text-left text-sm overflow-auto">
            {error.toString()}
          </pre>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-0'
      }`}>
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="animate-fade-in">
              {renderActiveView()}
            </div>
          </div>
        </main>
      </div>

      {/* Chatbot */}
      <Chatbot 
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen(!chatbotOpen)}
        onAction={handleChatbotAction}
      />
    </div>
  );
}
