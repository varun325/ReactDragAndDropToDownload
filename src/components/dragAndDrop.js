import { useState } from "react";
const DragAndDrop = ()=>{
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [dataUrl, setDataUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
  
    const handleDragEnter = (e) => {
      e.preventDefault();
      setDragging(true);
    };
  
    const handleDragLeave = (e) => {
      e.preventDefault();
      setDragging(false);
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setDragging(false);
  
      const droppedFile = e.dataTransfer.files[0];
  
      if (droppedFile) {
        const reader = new FileReader();
  
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(progress);
          }
        };
  
        reader.onload = (event) => {
          // Set the data URL in state
          setDataUrl(event.target.result);
          // Set the dropped file in state
          setFile(droppedFile);
        };
  
        reader.readAsDataURL(droppedFile);
      }
    };
  
    const handleDownload = () => {
      if (dataUrl && file) {
        // Create a Blob from the data URL
        const blob = new Blob([dataUrl], { type: file.type });
  
        // Create a Blob URL for download
        const url = URL.createObjectURL(blob);
  
        // Create an <a> element for downloading
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
  
        // Revoke the Blob URL to free up resources
        URL.revokeObjectURL(url);
      }
    };
  
    return (
      <div>
        <div
          className={`file-dropzone ${dragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {dragging ? 'Drop the file here' : 'Drag and drop a file here'}
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        {file && (
          <div>
            <p>File Name: {file.name}</p>
            <button onClick={handleDownload}>Download</button>
          </div>
        )}
      </div>
    );
}

export default DragAndDrop;