import React, { useState, useRef, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import './QuickPrototypes.css';

const QuickPrototypes = () => {
  const [prompt, setPrompt] = useState('');
  const [codeData, setCodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState(null);
  const editorRef = useRef(null);
  const iframeRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending prompt:', prompt.trim());
      const response = await fetch('http://localhost:5000/api/generate-prototype', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prototype');
      }

      const responseData = await response.json();
      setCodeData(responseData);
    } catch (err) {
      setError('An error occurred while generating the prototype.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  }

  const runCode = () => {
    if (codeData && codeData.code) {
      const iframe = iframeRef.current;
      if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(codeData.code);
        iframeDoc.close();
      }
    }
  };

  useEffect(() => {
    if (codeData && codeData.code) {
      runCode();
    }
  }, [codeData]);

  const getQuote = async () => {
    setQuoteLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/generate-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to get quote');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setQuoteResponse(url);
    } catch (err) {
      setError('An error occurred while getting the quote.');
      console.error(err);
    } finally {
      setTimeout(() => {
        setQuoteLoading(false);
      }, 30000); // 30 seconds loading time
    }
  };

  return (
    <div className="quick-prototypes">
      <div className="main-content">
        <div className="left-section">
          <div className="input-section">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your prototype idea..."
              rows="4"
            />
            <button className="submit-button" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Prototype'}
            </button>
          </div>
          {codeData && (
            <Editor
              height="calc(100% - 150px)"
              language={codeData.languages[0]}
              theme="vs-dark"
              value={codeData.code}
              onMount={handleEditorDidMount}
              options={{ readOnly: true }}
            />
          )}
        </div>
        <div className="right-section">
          {error && <p className="error">{error}</p>}
          {codeData && (
            <>
              {codeData.prelude && (
                <div className="prelude">
                  <h3>Prelude:</h3>
                  <pre>{codeData.prelude}</pre>
                </div>
              )}
              <div className="preview">
                <h3>Prototype Preview:</h3>
                <iframe ref={iframeRef} title="Prototype Preview" />
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Quote Section */}
      <div className="quote-section">
        <h3>Get Quote</h3>
        <button onClick={getQuote} disabled={quoteLoading}>
          {quoteLoading ? 'Loading... This usually takes 30 seconds' : 'Get Quote'}
        </button>
        {quoteLoading && (
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        )}
        {quoteResponse && (
          <div className="quote-response">
            <h4>Quote PDF:</h4>
            <embed src={quoteResponse} type="application/pdf" width="100%" height="600px" />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickPrototypes;