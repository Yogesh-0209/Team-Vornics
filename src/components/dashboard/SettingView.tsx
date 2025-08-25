import React, { useState } from 'react';
import { Save, Download, Upload, Trash2, Settings, Bell, Shield, Database } from 'lucide-react';
import toast from 'react-hot-toast';

export function SettingsView() {
  const [settings, setSettings] = useState({
    autoDownload: false,
    emailNotifications: true,
    retentionDays: 30,
    maxFileSize: 10,
    outputFormat: 'json',
    language: 'en',
    timezone: 'UTC'
  });

  const handleSave = () => {
    localStorage.setItem('sofExtractorSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };

  const handleExportData = () => {
    const processedFiles = localStorage.getItem('processedFiles');
    if (processedFiles) {
      const blob = new Blob([processedFiles], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sof_extractor_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } else {
      toast.error('No data to export');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          localStorage.setItem('processedFiles', JSON.stringify(data));
          toast.success('Data imported successfully');
          window.location.reload();
        } catch (error) {
          toast.error('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all processed data? This action cannot be undone.')) {
      localStorage.removeItem('processedFiles');
      toast.success('All data cleared');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Application Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Processing Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-gray-600" />
              Processing Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum File Size (MB)
                </label>
                <input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Output Format
                </label>
                <select
                  value={settings.outputFormat}
                  onChange={(e) => setSettings({...settings, outputFormat: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="xml">XML</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Singapore">Singapore</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-600" />
              Notifications
            </h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Email notifications for completed processing
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.autoDownload}
                  onChange={(e) => setSettings({...settings, autoDownload: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Automatically download processed files
                </span>
              </label>
            </div>
          </div>

          {/* Data Retention */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-600" />
              Data Retention
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keep processed files for (days)
              </label>
              <input
                type="number"
                value={settings.retentionDays}
                onChange={(e) => setSettings({...settings, retentionDays: parseInt(e.target.value)})}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="365"
              />
              <p className="text-sm text-gray-500 mt-1">
                Files older than this will be automatically removed from history
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Data Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleExportData}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2"
          >
            <Download className="w-8 h-8 text-blue-600" />
            <span className="font-medium text-gray-900">Export Data</span>
            <span className="text-sm text-gray-500 text-center">
              Download all processed files and settings
            </span>
          </button>

          <label className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2 cursor-pointer">
            <Upload className="w-8 h-8 text-green-600" />
            <span className="font-medium text-gray-900">Import Data</span>
            <span className="text-sm text-gray-500 text-center">
              Restore from a previous export
            </span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>

          <button
            onClick={handleClearData}
            className="p-4 border border-red-300 rounded-lg hover:bg-red-50 flex flex-col items-center gap-2"
          >
            <Trash2 className="w-8 h-8 text-red-600" />
            <span className="font-medium text-red-900">Clear All Data</span>
            <span className="text-sm text-red-600 text-center">
              Remove all processed files permanently
            </span>
          </button>
        </div>
      </div>

      {/* API Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Information</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Backend Endpoint:</strong> http://localhost:8000
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Supported Formats:</strong> PDF, DOC, DOCX
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Max File Size:</strong> {settings.maxFileSize} MB
          </p>
          <p className="text-sm text-gray-600">
            <strong>Processing Engine:</strong> Python + AI/ML Models
          </p>
        </div>
      </div>
    </div>
  );
}
