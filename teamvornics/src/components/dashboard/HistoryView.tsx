import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, FileText, Calculator, AlertTriangle, Eye, CheckCircle } from 'lucide-react';
import { ProcessedFile } from '../../types/dashboard';
import { format, isValid } from 'date-fns';

interface HistoryViewProps {
  files: ProcessedFile[];
  onFileSelect: (file: ProcessedFile) => void; // For selecting/viewing details
  onCalculateDemurrage: (file: ProcessedFile) => void; // For triggering calculator
}

export function HistoryView({ files, onFileSelect, onCalculateDemurrage }: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'events'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedFiles = files
    .filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.extractedData.vesselInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.extractedData.portInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.processedAt.getTime() - b.processedAt.getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'events':
          comparison = a.eventsExtracted - b.eventsExtracted;
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const downloadFile = (file: ProcessedFile) => {
    const jsonData = JSON.stringify(file.extractedData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_extracted_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAllData = () => {
    const allData = files.map(file => ({
      fileName: file.name,
      processedAt: file.processedAt,
      eventsExtracted: file.eventsExtracted,
      ...file.extractedData
    }));
    
    const jsonData = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const currentDate = new Date();
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    a.download = `sof_extraction_history_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Processing History</h3>
          
          {files.length > 0 && (
            <button
              onClick={exportAllData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export All
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by filename, vessel, or port..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'events')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="events">Sort by Events</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>

        {filteredAndSortedFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {files.length === 0 ? 'No processing history yet' : 'No files match your search'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {files.length === 0 
                ? 'Process some files to see them here' 
                : 'Try adjusting your search terms'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">File Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Vessel</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Port</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Events</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Processed</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">{file.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {file.extractedData.vesselInfo?.name || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {file.extractedData.portInfo?.name || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {file.eventsExtracted} events
                      </span>
                      {file.extractedData.events.some(event => event.anomalies && event.anomalies.length > 0) ? (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3 mr-1" /> 
                          {file.extractedData.events.filter(event => event.anomalies && event.anomalies.length > 0).length} Anomalies
                        </span>
                      ) : (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" /> Clean
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {isValid(file.processedAt) ? format(file.processedAt, 'MMM dd, HH:mm') : 'Recently'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {(file.originalSize / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadFile(file)}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onCalculateDemurrage(file)} // Explicit button for calculator
                          className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                          title="Calculate Demurrage"
                        >
                          <Calculator className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onFileSelect(file)} // Explicit button for viewing details
                          className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="font-medium text-gray-900 mb-4">Summary Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{files.length}</p>
              <p className="text-sm text-gray-600">Total Files Processed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {files.reduce((sum, file) => sum + file.eventsExtracted, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Events Extracted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {(files.reduce((sum, file) => sum + file.originalSize, 0) / 1024 / 1024).toFixed(1)} MB
              </p>
              <p className="text-sm text-gray-600">Total Data Processed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {Math.round(files.reduce((sum, file) => sum + file.eventsExtracted, 0) / files.length)}
              </p>
              <p className="text-sm text-gray-600">Avg Events per File</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
