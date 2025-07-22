import React, { useState, useCallback } from 'react';
import { FileData } from '../../types';

interface FileUploadProps {
  onFilesSelected: (files: FileData[]) => void;
  acceptedTypes?: string;
  multiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, acceptedTypes = "application/pdf,image/png,image/jpeg", multiple = true }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      processFiles(Array.from(event.target.files));
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      processFiles(Array.from(event.dataTransfer.files));
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFiles = (files: File[]) => {
    setSelectedFiles(files);
    const filePromises = files.map(file => {
        return new Promise<FileData>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = (e.target?.result as string).split(',')[1];
                resolve({ name: file.name, type: file.type, size: file.size, base64 });
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    });

    Promise.all(filePromises).then(fileDataArray => {
        onFilesSelected(fileDataArray);
    }).catch(error => {
        console.error("Error reading files:", error);
    });
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-300 ${isDragging ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-violet-400'}`}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        accept={acceptedTypes}
        multiple={multiple}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <p className="text-gray-500 dark:text-gray-400">Arrastra y suelta archivos aquí, o haz clic para seleccionar.</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Tipos soportados: PDF, PNG, JPG</p>
      </label>
      {selectedFiles.length > 0 && (
        <div className="mt-4 text-sm text-left">
            <h4 className="font-semibold">Archivos seleccionados:</h4>
            <ul className="list-disc list-inside">
                {selectedFiles.map(file => (
                    <li key={file.name} className="truncate">{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};