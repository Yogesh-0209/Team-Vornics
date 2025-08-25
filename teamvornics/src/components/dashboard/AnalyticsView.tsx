import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ProcessedFile } from '../../types/dashboard';
import { format, subDays, eachDayOfInterval, isValid } from 'date-fns';

interface AnalyticsViewProps {
  files: ProcessedFile[];
}

export function AnalyticsView({ files }: AnalyticsViewProps) {
  // Event type distribution
  const eventTypeData = files.reduce((acc, file) => {
    file.extractedData.events.forEach(event => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const eventTypeChartData = Object.entries(eventTypeData).map(([type, count]) => ({
    name: type,
    value: count
  }));

  // Processing timeline (last 7 days)
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const timelineData = last7Days.map(day => {
    const dayFiles = files.filter(file => {
      const fileDate = new Date(file.processedAt);
      return isValid(fileDate) && format(fileDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    
    return {
      date: format(day, 'MMM dd'),
      files: dayFiles.length,
      events: dayFiles.reduce((sum, file) => sum + file.eventsExtracted, 0)
    };
  });

  // File size distribution
  const fileSizeData = files.map(file => ({
    name: file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name,
    size: Number((file.originalSize / 1024 / 1024).toFixed(2)),
    events: file.eventsExtracted
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const totalFiles = files.length;
  const totalEvents = files.reduce((sum, file) => sum + file.eventsExtracted, 0);
  const totalSize = files.reduce((sum, file) => sum + file.originalSize, 0);
  const avgEventsPerFile = totalFiles > 0 ? Math.round(totalEvents / totalFiles) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-blue-600">{totalFiles}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📄</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-green-600">{totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">⚡</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Processed</p>
              <p className="text-2xl font-bold text-purple-600">
                {(totalSize / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">💾</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Events/File</p>
              <p className="text-2xl font-bold text-amber-600">{avgEventsPerFile}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-amber-600 text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
          <p className="text-gray-500">Process some SoF documents to see analytics and insights here.</p>
        </div>
      ) : (
        <>
          {/* Processing Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Activity (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="files" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Files Processed"
                />
                <Line 
                  type="monotone" 
                  dataKey="events" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Events Extracted"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Type Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Type Distribution</h3>
              {eventTypeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={eventTypeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {eventTypeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  No event data available
                </div>
              )}
            </div>

            {/* File Size vs Events */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">File Size vs Events Extracted</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fileSizeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="events" fill="#3B82F6" name="Events" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performing Files */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Files by Events Extracted</h3>
            <div className="space-y-3">
              {files
                .sort((a, b) => b.eventsExtracted - a.eventsExtracted)
                .slice(0, 5)
                .map((file, index) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          Processed {isValid(new Date(file.processedAt)) ? format(new Date(file.processedAt), 'MMM dd, yyyy') : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{file.eventsExtracted} events</p>
                      <p className="text-sm text-gray-500">
                        {(file.originalSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
