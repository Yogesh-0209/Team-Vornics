import React from 'react';
import { Download, Eye, Calendar, FileText, Clock, Ship, AlertTriangle, Calculator, CheckCircle } from 'lucide-react';
import { ProcessedFile } from '../../types/dashboard';
import { format, isValid } from 'date-fns';

interface ResultsViewProps {
  files: ProcessedFile[];
  selectedFile: ProcessedFile | null;
  onFileSelect: (file: ProcessedFile) => void;
  onCalculateDemurrage: (file: ProcessedFile) => void;
}

export function ResultsView({ files, selectedFile, onFileSelect, onCalculateDemurrage }: ResultsViewProps) {
  console.log('🔍 ResultsView Debug:', {
    filesLength: files?.length || 0,
    selectedFileName: selectedFile?.name || 'none',
    firstFileName: files?.[0]?.name || 'none'
  });

  // Simple fallback if no files
  if (!files || files.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Files Processed Yet</h3>
          <p className="text-gray-600 mb-6">Upload and process SoF documents to see results here.</p>
          <button 
            onClick={() => window.location.hash = 'upload'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Documents
          </button>
        </div>
      </div>
    );
  }

  // Use first file if none selected
  const displayFile = selectedFile || files[0];

  const downloadJSON = (file: ProcessedFile) => {
    const jsonData = JSON.stringify(file.extractedData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (file: ProcessedFile) => {
    const events = file.extractedData.events || [];
    const csvHeader = 'Event Type,Start Time,End Time,Duration (hrs),Location,Description,Anomalies\n';
    const csvRows = events.map(event => 
      `"${event.eventType || ''}","${event.startTime || ''}","${event.endTime || ''}","${event.duration || 0}","${event.location || ''}","${event.description || ''}","${event.anomalies ? event.anomalies.join('; ') : ''}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_events.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Files List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Processed Files ({files.length})
        </h3>
        
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                displayFile?.id === file.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onFileSelect(file)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{file.name}</h4>
                    <p className="text-sm text-gray-500">
                      {file.eventsExtracted} events • {(file.originalSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileSelect(file);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      displayFile?.id === file.id 
                        ? 'text-blue-600 bg-blue-100' 
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadJSON(file);
                    }}
                    className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                    title="Download JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Details */}
      {displayFile && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          {displayFile.extractedData.processingNote && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Processing Note</p>
                  <p className="text-yellow-700">{displayFile.extractedData.processingNote}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              File Details: {displayFile.name}
            </h3>
            
            <div className="flex gap-2">
              <button
                onClick={() => downloadJSON(displayFile)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              
              <button
                onClick={() => downloadCSV(displayFile)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              
              <button
                onClick={() => onCalculateDemurrage(displayFile)}
                className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 flex items-center gap-2 transition-colors"
              >
                <Calculator className="w-4 h-4" />
                Calculate Demurrage
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Ship className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Vessel</span>
              </div>
              <p className="text-lg font-bold text-blue-900">
                {displayFile.extractedData?.vesselInfo?.name || 'N/A'}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Events</span>
              </div>
              <p className="text-lg font-bold text-green-900">
                {displayFile.eventsExtracted}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Total Time</span>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {displayFile.extractedData?.totalLaytime || 'N/A'}
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">Port</span>
              </div>
              <p className="text-lg font-bold text-amber-900">
                {displayFile.extractedData?.portInfo?.name || 'N/A'}
              </p>
            </div>
          </div>

          {/* Events Table */}
          {displayFile.extractedData?.events && displayFile.extractedData.events.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Event Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Start Time</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">End Time</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Duration (hrs)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Location</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Anomalies</th>
                  </tr>
                </thead>
                <tbody>
                  {displayFile.extractedData.events.map((event, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {event.eventType || '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {event.startTime || '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {event.endTime || '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {event.duration || 0}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {event.location || '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {event.description || '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {event.anomalies && event.anomalies.length > 0 ? (
                          <div className="text-amber-600">
                            <div className="flex items-center gap-1 mb-1">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="font-semibold text-xs">
                                {event.anomalies.length} issue{event.anomalies.length === 1 ? '' : 's'}
                              </span>
                            </div>
                            <ul className="list-disc list-inside text-xs space-y-1">
                              {event.anomalies.map((anomaly, aIndex) => (
                                <li key={aIndex} className="text-amber-700">{anomaly}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <span className="text-green-600 text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Clean
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <p className="text-gray-500">No events found in this file</p>
              <p className="text-sm text-gray-400 mt-1">The document may not contain recognizable maritime events</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
