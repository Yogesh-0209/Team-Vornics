import React from 'react';
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  Clock, 
  Ship, 
  BarChart3,
  ArrowRight,
  Zap,
  CheckCircle,
  AlertCircle,
  Activity,
  DollarSign
} from 'lucide-react';
import { ProcessedFile, ProcessingJob } from '../../types/dashboard';

interface DashboardOverviewProps {
  processedFiles: ProcessedFile[];
  processingJobs: ProcessingJob[];
  onNavigate: (view: string) => void;
}

export function DashboardOverview({ processedFiles, processingJobs, onNavigate }: DashboardOverviewProps) {
  const totalEvents = processedFiles.reduce((sum, file) => sum + file.eventsExtracted, 0);
  const activeJobs = processingJobs.filter(job => job.status === 'processing').length;
  const completedJobs = processingJobs.filter(job => job.status === 'completed').length;
  const recentFiles = processedFiles.slice(-3).reverse();

  const stats = [
    {
      title: 'Total Files Processed',
      value: processedFiles.length.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'blue',
      description: 'Documents analyzed this month'
    },
    {
      title: 'Events Extracted',
      value: totalEvents.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: Zap,
      color: 'emerald',
      description: 'Maritime events identified'
    },
    {
      title: 'Processing Jobs',
      value: activeJobs.toString(),
      change: activeJobs > 0 ? 'Active' : 'Idle',
      changeType: activeJobs > 0 ? 'neutral' : 'positive' as const,
      icon: Clock,
      color: 'amber',
      description: 'Currently being processed'
    },
    {
      title: 'Success Rate',
      value: '98.5%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'green',
      description: 'Successful extractions'
    }
  ];

  const quickActions = [
    {
      title: 'Upload New Document',
      description: 'Process a new SoF document',
      icon: Upload,
      color: 'blue',
      action: () => onNavigate('upload')
    },
    {
      title: 'View Analytics',
      description: 'Analyze processing trends',
      icon: BarChart3,
      color: 'purple',
      action: () => onNavigate('analytics')
    },
    {
      title: 'Browse Results',
      description: 'Review extracted data',
      icon: FileText,
      color: 'emerald',
      action: () => onNavigate('results')
    },
    {
      title: 'Demurrage Calculator', // New quick action
      description: 'Calculate laytime charges',
      icon: DollarSign,
      color: 'orange',
      action: () => onNavigate('demurrage-calculator')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to SoF Extractor</h1>
            <p className="text-blue-100 text-lg">
              AI-powered maritime document processing at your fingertips
            </p>
          </div>
          <div className="hidden md:block">
            <Ship className="w-16 h-16 text-blue-200" />
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={() => onNavigate('upload')}
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Document
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors flex items-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            View Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-500 text-blue-100',
            emerald: 'bg-emerald-500 text-emerald-100',
            amber: 'bg-amber-500 text-amber-100',
            green: 'bg-green-500 text-green-100',
            purple: 'bg-purple-500 text-purple-100',
            orange: 'bg-orange-500 text-orange-100'
          };

          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${colorClasses[stat.color]} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'text-green-700 bg-green-100' 
                    : stat.changeType === 'negative'
                    ? 'text-red-700 bg-red-100'
                    : 'text-gray-700 bg-gray-100'
                }`}>
                  {stat.change}
                </span>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 font-medium mb-1">{stat.title}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
              purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
              emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
              orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
            };

            return (
              <button
                key={index}
                onClick={action.action}
                className={`p-4 rounded-lg transition-all duration-200 text-left group ${colorClasses[action.color]}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-6 h-6" />
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm opacity-75">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Files */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Files</h2>
            <button
              onClick={() => onNavigate('history')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {recentFiles.length > 0 ? (
            <div className="space-y-4">
              {recentFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-48">{file.name}</p>
                      <p className="text-sm text-gray-500">{file.eventsExtracted} events extracted</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No files processed yet</p>
              <button
                onClick={() => onNavigate('upload')}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Upload your first document
              </button>
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">API Server</p>
                  <p className="text-sm text-green-700">All systems operational</p>
                </div>
              </div>
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Processing Engine</p>
                  <p className="text-sm text-blue-700">Ready for new documents</p>
                </div>
              </div>
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">AI Models</p>
                  <p className="text-sm text-purple-700">Event extraction ready</p>
                </div>
              </div>
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
            </div>

            {activeJobs > 0 && (
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-900">Active Jobs</p>
                    <p className="text-sm text-amber-700">{activeJobs} document(s) processing</p>
                  </div>
                </div>
                <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => onNavigate('settings')}
              className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              System Settings & Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
