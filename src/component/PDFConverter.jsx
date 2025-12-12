import { useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import '../App.css'; // Ensure styles are imported if not globally

// Renamed and stylized component
export default function PDFConverter() {
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- Core Logic (Unchanged) ---
    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files).filter(f => f.type === "application/pdf");
        setSelectedFiles(files);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert("Please select at least one PDF file to convert!");
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("pdfs", file));

        try {
            setLoading(true);

            // Use environment variable or fallback to localhost
            const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

            const response = await fetch(`${backendURL}/convert`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const contentType = response.headers.get("content-type");
            console.log("Response Status:", response.status);
            console.log("Content-Type:", contentType);

            // Check response status
            if (!response.ok) {
                // Try to parse as JSON for error message
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    console.error("Backend Error:", errorData);
                    alert(`Error: ${errorData.error || "Conversion failed!"}`);
                } else {
                    alert(`Server Error: ${response.statusText}`);
                }
                return;
            }

            // Check if response is JSON (could be error or success response)
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();

                // Check if it's an error response
                if (!data.success) {
                    console.error("Conversion Error:", data);
                    alert(`Conversion failed: ${data.error || "Unknown error"}`);
                    return;
                }

                // If success with file data, try to get the file
                // Otherwise show success message
                alert("Conversion successful!");
                setSelectedFiles([]);
                return;
            }

            // Otherwise it's Excel file → Download it
            const blob = await response.blob();

            if (blob.size === 0) {
                alert("Error: Received empty file from server");
                return;
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `converted_excel_${Date.now()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            // Clean up the object URL
            window.URL.revokeObjectURL(url);

            // Clear selected files on successful download
            setSelectedFiles([]);
            alert("File downloaded successfully!");

        } catch (err) {
            console.error("Error:", err);
            alert(`Error converting PDFs: ${err.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };
    // --- End Core Logic ---

    return (
        <div className="converter-card">
            <div className="card-header">
                <div className="icon-wrapper">
                    <FileText className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="card-title">PDF to Excel Converter</h2>
                <p className="card-subtitle">Convert your PDF tables into editable Excel spreadsheets quickly and accurately.</p>
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="application/pdf"
                className="hidden-input"
                onChange={handleFileChange}
            />

            <div className="upload-area" onClick={handleClick}>
                <div className="upload-icon-container">
                    <UploadCloud className="upload-icon" />
                </div>
                <p className="upload-text">Click to browse your files</p>
                <p className="upload-subtext">Supports PDF format</p>
            </div>

            {/* File List */}
            {selectedFiles.length > 0 && !loading && (
                <div className="file-list-container">
                    <div className="list-header-row">
                        <p className="list-header">Selected Files ({selectedFiles.length})</p>
                    </div>
                    <ul className="file-list">
                        {selectedFiles.map((f, i) => (
                            <li key={i} className="file-item">
                                <FileText size={18} className="file-item-icon" />
                                <span className="file-name">{f.name}</span>
                                <CheckCircle size={18} className="file-status-icon success" />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Loading Spinner */}
            {loading && (
                <div className="loading-state">
                    <Loader2 className="spinner-icon" />
                    <p className="loading-message">
                        Converting PDFs... <span className="highlight">Please wait</span>
                    </p>
                    <p className="loading-subtext">This can take a moment for large files!</p>
                </div>
            )}

            {/* Actions */}
            <div className="action-buttons">
                <button
                    onClick={handleUpload}
                    disabled={loading || selectedFiles.length === 0}
                    className={`btn btn-convert ${loading || selectedFiles.length === 0 ? 'disabled' : ''}`}
                >
                    {loading ? (
                        <>Processing...</>
                    ) : (
                        <>Convert into Excel</>
                    )}
                </button>
            </div>

        </div>
    );
}
