import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Upload, FileUp, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import "./certificateUpload.css";

const CertificateUpload = () => {
  const [files, setFiles] = useState([]); // Array to store multiple files
  const [results, setResults] = useState([]); // Array to store results for each file
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const uploadedFiles = Array.from(event.dataTransfer.files);
    if (uploadedFiles.length > 0) {
      setFiles(uploadedFiles);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
    }
  };

  const fileToGenerativePart = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve({
          inlineData: {
            data: base64String,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select one or more certificates to upload.");
      return;
    }

    setLoading(true);
    const resultsArray = [];

    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      for (const file of files) {
        const promptText = `You are an AI that analyzes certificate images. Extract and return the following details:

        These are the important things that is to be remembered while extraction:
        If the student name is unknown, the certificate should be printed as invalid.
        - Student Name
        - Event Name (National Initiatives, Sports & Games, Cultural Activities, Professional Self Initiatives, Entrepreneurship and Innovation, Leadership & Management)
        - Points based on the event category and participation level
        The points are assigned as follows:
        1. Category=National Initiatives:
            Events={NCC / NSS Participation – 60 points (Minimum 1 Year)
            NCC "C" Certificate / Outstanding Performance – 80 points}
        2. Category=Sports & Games:
           Events={ General Participation – 29 points
            Winning First Prize – 14 points
            Winning Second Prize – 11 points
            Winning Third Prize – 8 points
            Maximum Points Limit for Winners: 80 points (For National/International Levels)}
        3. Category=Cultural Activities:
            Events={Participation in Music, Performing Arts, Literary Arts – 28 points
            Winning First Prize – 14 points
            Winning Second Prize – 11 points
            Winning Third Prize – 8 points
            Maximum Points Limit for Winners: 80 points}
        4. Category=Professional Self Initiatives:
            Events={Tech Fest / Tech Quiz Participation – 30 points
            MOOC with Final Assessment Certificate – 50 points
            Competitions by Professional Societies – 23 points
            Attending Full-time Conference/Seminar/Exhibition/Workshop at IITs/NITs – 40 points
            Paper Presentation/Publication at IITs/NITs – 40 points (+10 points for recognition)
            Poster Presentation at IITs/NITs – 30 points (+10 points for recognition)
            Industrial Training/Internship (Min. 5 Days) – 20 points
            Industrial / Exhibition Visit – 8 points
            Foreign Language Certification – 50 points}
        5. Category=Entrepreneurship and Innovation:
           Events={ Registered Startup Company – 60 points
            Patent Filed – 45 points
            Patent Published – 48 points
            Patent Approved – 55 points
            Patent Licensed – 80 points
            Prototype Developed & Tested – 60 points
            Awards for Product Development – 60 points
            Innovative Technology Used by Industry – 60 points
            Venture Capital Funding – 80 points
            Startup Employment – 80 points
            Societal Innovations – 50 points}
        6. Category=Leadership & Management:
            Events={Student Professional Societies:
            Core Coordinator – 15 points
            Sub Coordinator – 10 points
            Volunteer – 5 points
            Elected Student Representatives:
            Chairman – 30 points
            Secretary – 25 points
            Other Council Members – 15 points}
        Each certificate should only be in a single category.
        Category should never be unknown. If the category is unknown, the certificate is invalid.`;

        const imagePart = await fileToGenerativePart(file);
        const result = await model.generateContent([promptText, imagePart]);
        const response = await result.response;
        const text = response.text();

        const lines = text.split("\n");
        let extractedName = "Unknown";
        let extractedEvent = "Unknown";
        let detectedCategory = "Unknown";
        let detectedPoints = "Unknown";

        lines.forEach((line) => {
          if (line.toLowerCase().includes("student name:")) {
            extractedName = line.split(":")[1].trim();
          } else if (line.toLowerCase().includes("event name:")) {
            extractedEvent = line.split(":")[1].trim();
          } else if (line.toLowerCase().includes("category:")) {
            detectedCategory = line.split(":")[1].trim();
          } else if (line.toLowerCase().includes("points:")) {
            detectedPoints = line.split(":")[1].trim();
          }
        });

        resultsArray.push({
          fileName: file.name,
          studentName: extractedName,
          eventName: extractedEvent,
          category: detectedCategory,
          points: detectedPoints,
        });
      }

      setResults(resultsArray); // Store results for all files
    } catch (error) {
      console.error("Error categorizing certificates:", error);
      alert("Failed to categorize certificates.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="upload-card">
        <div className="header">
          <Upload className="upload-icon" />
          <h2>Certificate Upload</h2>
          <p>Upload your certificates for automatic analysis</p>
        </div>

        <div
          className={`drag-drop-area ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileUp className="file-icon" />
          <p>
            Drag & drop your certificates here, or{" "}
            <label className="browse-label">
              browse
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                multiple // Allow multiple file selection
              />
            </label>
          </p>
          {files.length > 0 && (
            <div className="file-list">
              <p>Selected Files:</p>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading || files.length === 0}
          className={`upload-button ${loading || files.length === 0 ? "disabled" : ""}`}
        >
          {loading ? (
            <>
              <Loader2 className="spinner" />
              Processing...
            </>
          ) : (
            "Analyze Certificates"
          )}
        </button>

        {results.length > 0 && (
          <div className="results-container">
            {results.map((result, index) => (
              <div key={index} className="result-container">
                <h3>Result for: {result.fileName}</h3>
                {result.studentName === "Unknown" ? (
                  <div className="invalid-result">
                    <AlertCircle />
                    <p>Certificate is Invalid</p>
                  </div>
                ) : (
                  <div className="valid-result">
                    <div className="success-header">
                      <CheckCircle />
                      <p>Certificate Validated</p>
                    </div>
                    <div className="result-grid">
                      <div className="result-item">
                        <p className="label">Student Name</p>
                        <p className="value">{result.studentName}</p>
                      </div>
                      <div className="result-item">
                        <p className="label">Event Name</p>
                        <p className="value">{result.eventName}</p>
                      </div>
                      <div className="result-item">
                        <p className="label">Category</p>
                        <p className="value">{result.category}</p>
                      </div>
                      <div className="result-item">
                        <p className="label">Points Awarded</p>
                        <p className="value">{result.points}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateUpload;