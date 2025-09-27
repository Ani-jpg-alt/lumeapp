import React, { useState } from 'react';

export default function CloudinaryUpload({ onImageUpload }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const uploadImage = async (file) => {
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageUpload(data.secure_url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    } else {
      alert('Please drop a valid image file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  if (!cloudName || !uploadPreset) {
    return (
      <div className="upload-error">
        <p>⚠️ Cloudinary not configured. Please set up:</p>
        <ul>
          <li>REACT_APP_CLOUDINARY_CLOUD_NAME</li>
          <li>REACT_APP_CLOUDINARY_UPLOAD_PRESET</li>
        </ul>
        <p>You can manually enter image URLs for now.</p>
      </div>
    );
  }

  return (
    <div
      className={`upload-area ${dragOver ? 'dragover' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById('file-input').click()}
    >
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {uploading ? (
        <div className="uploading">
          <div className="spinner"></div>
          <p>Uploading image...</p>
        </div>
      ) : (
        <div className="upload-content">
          <div className="upload-icon">📷</div>
          <p>Click to select an image or drag & drop</p>
          <p className="upload-note">Supports: JPG, PNG, GIF (Max 10MB)</p>
        </div>
      )}
    </div>
  );
}