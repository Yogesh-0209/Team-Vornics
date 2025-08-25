import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProcessingJob, ProcessedFile } from '../../types/dashboard';
import { processFile } from '../../services/api';

interface FileUploadProps {
  onJobStart: (job: ProcessingJob) => void;
  onJobUpdate: (jobId: string, updates: Partial<ProcessingJob>) => void;
  onFileProcessed: (file: ProcessedFile) => void;
}

export function FileUpload({ onJobStart, onJobUpdate, onFileProcessed }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                         file.type === 'application/msword';
      
      if (!isValidType) {
        toast.error(`${file.name} is not a supported file type. Please upload PDF or Word documents.`);
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
        return false;
      }
      
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} file(s) uploaded successfully`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setProcessing(true);

    for (const file of uploadedFiles) {
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
        const job: ProcessingJob = {
          id: jobId,
          fileName: file.name,
          status: 'processing',
          progress: 0,
          startTime: new Date(),
          fileSize: file.size
        };

      onJobStart(job);

      try {
        // Simulate processing progress
        const progressInterval = setInterval(() => {
          onJobUpdate(jobId, { 
            progress: Math.min(job.progress + Math.random() * 20, 90) 
          });
        }, 500);

        const result = await processFile(file);
        
        clearInterval(progressInterval);
        
        // Check if result contains error
        if (result.error) {
          throw new Error(result.message || 'Processing failed');
        }
        
        // Check if the result is sample data
        if (result.processingNote && result.processingNote.toLowerCase().includes('sample data')) {
          throw new Error('Backend returned sample data. Real-time extraction failed.');
        }
        
        onJobUpdate(jobId, { 
          status: 'completed', 
          progress: 100,
          endTime: new Date()
        });

        const processedFile: ProcessedFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          originalSize: file.size,
          processedAt: new Date(),
          eventsExtracted: result.events?.length || 0,
          status: 'completed',
          extractedData: result,
          downloadUrl: result.downloadUrl
        };

        onFileProcessed(processedFile);
        toast.success(`${file.name} processed successfully with ${result.events?.length || 0} events extracted`);

      } catch (error) {
        console.error('❌ Error processing file:', error);
        
        // Create a more user-friendly error message
        let errorMessage = 'Processing failed';
        if (error instanceof Error) {
          if (error.message.includes('Backend server is not running')) {
            errorMessage = 'Backend server is not running. Please start the backend server first.';
          } else if (error.message.includes('Processing failed')) {
            errorMessage = 'File processing failed. The document may not contain recognizable maritime events.';
          } else if (error.message.includes('Unsupported file type')) {
            errorMessage = 'Unsupported file type. Please upload PDF, DOC, or DOCX files only.';
          } else if (error.message.includes('File too large')) {
            errorMessage = 'File is too large. Maximum file size is 10MB.';
          } else {
            errorMessage = error.message;
          }
        }
        
        onJobUpdate(jobId, { 
          status: 'failed', 
          progress: 0,
          endTime: new Date(),
          error: errorMessage
        });
        
        toast.error(`Error processing ${file.name}: ${errorMessage}`);
      }
    }

    setProcessing(false);
    setUploadedFiles([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload SoF Documents</h3>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop your SoF documents here, or{' '}
                <span className="text-blue-600 font-medium cursor-pointer">browse</span>
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF and Word documents (max 10MB each)
              </p>
            </div>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Uploaded Files ({uploadedFiles.length})</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    disabled={processing}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={processFiles}
                disabled={processing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Process Files
                  </>
                )}
              </button>
              
              <button
                onClick={() => setUploadedFiles([])}
                disabled={processing}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="font-medium text-gray-900 mb-3">Processing Guidelines</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Supported Formats</p>
              <p className="text-sm text-gray-600">PDF (.pdf) and Word documents (.doc, .docx)</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Template Agnostic</p>
              <p className="text-sm text-gray-600">Works with any SoF format or template</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">File Size Limit</p>
              <p className="text-sm text-gray-600">Maximum 10MB per file</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Batch Processing</p>
              <p className="text-sm text-gray-600">Upload multiple files at once</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
