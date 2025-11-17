import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * WHITEBOARD COMPONENT
 * 
 * Enhanced Features:
 * - Multiple drawing tools: Pencil, Highlighter, Marker, Eraser
 * - Undo/Redo functionality (Ctrl+Z, Ctrl+Y)
 * - Drawing presets and templates
 * - Improved color palette
 * - Layer-based drawing history
 */
const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('pencil');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastSave, setLastSave] = useState(null);

  // Drawing tools configuration with distinct visual properties
  const drawingTools = {
    pencil: { 
      baseSize: 1.0, 
      opacity: 1.0, 
      smooth: true, 
      description: 'Thin, precise lines'
    },
    highlighter: { 
      baseSize: 3.0, 
      opacity: 0.3, 
      smooth: false, 
      description: 'Semi-transparent highlight'
    },
    marker: { 
      baseSize: 2.5, 
      opacity: 0.8, 
      smooth: true, 
      description: 'Bold, smooth lines'
    },
    eraser: { 
      baseSize: 4.0, 
      opacity: 1.0, 
      smooth: true, 
      description: 'Erasing drawing'
    }
  };

  // Extended color palette
  const colorPalette = [
    // Basic colors
    '#000000', '#ffffff', '#dc2626', '#2563eb', '#16a34a',
    // Highlight colors
    '#fef08a', '#93c5fd', '#86efac', '#fca5a5',
    // Additional colors
    '#eab308', '#7c3aed', '#ea580c', '#6b7280',
    '#f97316', '#8b5cf6', '#06b6d4', '#84cc16'
  ];

  // Initialize canvas
  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set default background to white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Load saved drawing from localStorage
    const saved = localStorage.getItem('whiteboard');
    if (saved) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        saveToHistory(); // Save initial loaded state
      };
      img.src = saved;
    } else {
      saveToHistory(); // Save initial blank state
    }
  }, []);

  useEffect(() => {
    initializeCanvas();

    const handleResize = () => {
      const currentState = canvasRef.current.toDataURL();
      initializeCanvas();
      
      if (currentState) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current.getContext('2d');
          ctx.drawImage(img, 0, 0);
        };
        img.src = currentState;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeCanvas]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, drawingHistory]);

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasRef.current) {
        autoSave();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const saveToHistory = () => {
    if (canvasRef.current) {
      const currentState = canvasRef.current.toDataURL();
      setDrawingHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        return newHistory.slice(-50); // Keep last 50 states
      });
      setHistoryIndex(prev => Math.min(prev + 1, 49));
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousState = drawingHistory[newIndex];
      loadStateFromDataURL(previousState);
    }
  };

  const handleRedo = () => {
    if (historyIndex < drawingHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextState = drawingHistory[newIndex];
      loadStateFromDataURL(nextState);
    }
  };

  const loadStateFromDataURL = (dataURL) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataURL;
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.type.includes('touch')) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (e) => {
    e.preventDefault();
    
    // Save state BEFORE starting to draw (so undo works immediately)
    saveToHistory();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoordinates(e);
    
    const currentTool = drawingTools[tool];
    
    // Set drawing styles - these only affect new strokes
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize * currentTool.baseSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = currentTool.opacity;
    
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoordinates(e);
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    autoSave();
  };

  const autoSave = () => {
    if (canvasRef.current) {
      try {
        const dataURL = canvasRef.current.toDataURL();
        localStorage.setItem('whiteboard', dataURL);
        setLastSave(new Date());
      } catch (error) {
        console.log('Auto-save failed:', error);
      }
    }
  };

  const clearCanvas = () => {
    // Save current state to history BEFORE clearing
    saveToHistory();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Save the current context state
    ctx.save();
    
    // Reset all context properties to defaults for clearing
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    
    // Completely clear the canvas to white using fillRect
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Restore the previous context state
    ctx.restore();
    
    // Clear localStorage
    localStorage.removeItem('whiteboard');
    
    // Auto-save the cleared state
    autoSave();
  };

  const saveAsImage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `study-hub-whiteboard-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataURL;
    link.click();
  };

  const addGrid = () => {
    saveToHistory(); // Save state before adding grid
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    autoSave();
  };

  const addTemplate = (templateType) => {
    saveToHistory(); // Save state before adding template
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.font = '24px VT323';
    ctx.fillStyle = '#6b7280';
    
    switch (templateType) {
      case 'mindmap':
        // Simple mind map center
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillText('Main Idea', canvas.width / 2 - 40, canvas.height / 2 - 40);
        break;
        
      case 'cornell':
        // Cornell notes template
        ctx.beginPath();
        // Main content area
        ctx.rect(50, 50, canvas.width - 100, canvas.height - 150);
        // Cue column
        ctx.rect(50, 50, 100, canvas.height - 150);
        // Summary area
        ctx.rect(50, canvas.height - 80, canvas.width - 100, 30);
        ctx.stroke();
        break;
        
      case 'kanban':
        // Simple Kanban board
        const columnWidth = (canvas.width - 100) / 3;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          ctx.rect(50 + i * columnWidth, 50, columnWidth - 20, canvas.height - 100);
        }
        ctx.stroke();
        ctx.fillText('To Do', 50 + columnWidth * 0.5 - 20, 30);
        ctx.fillText('Doing', 50 + columnWidth * 1.5 - 20, 30);
        ctx.fillText('Done', 50 + columnWidth * 2.5 - 20, 30);
        break;
    }
    
    autoSave();
  };

  const getCurrentToolSize = () => {
    const currentTool = drawingTools[tool];
    return Math.round(brushSize * currentTool.baseSize);
  };

  return (
    <div className="min-h-screen p-6 whiteboard-container">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-['VT323'] text-amber-900 mb-2">WHITEBOARD</h1>
          <p className="font-['VT323'] text-amber-700 text-xl">Draw, plan, and brainstorm your ideas</p>
        </div>

        {/* Main Toolbar */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-amber-100 rounded-2xl shadow-lg items-center justify-center toolbar">
          {/* Tool Selection */}
          <div className="flex flex-col items-center">
            <label className="font-['VT323'] text-amber-900 text-sm mb-1">Tool</label>
            <select 
              value={tool} 
              onChange={(e) => setTool(e.target.value)}
              className="px-3 py-2 border border-amber-300 rounded-lg font-['VT323'] text-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="pencil">✏️ Pencil</option>
              <option value="highlighter">🖍️ Highlighter</option>
              <option value="marker">🖊️ Marker</option>
              <option value="eraser">🧽 Eraser</option>
            </select>
            <div className="text-xs text-amber-600 mt-1 max-w-24 text-center">
              {drawingTools[tool].description}
            </div>
          </div>

          {/* Color Picker */}
          <div className="flex flex-col items-center">
            <label className="font-['VT323'] text-amber-900 text-sm mb-1">Color</label>
            <div className="relative">
              <button 
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-12 h-12 border-2 border-amber-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                style={{ backgroundColor: tool === 'eraser' ? '#ffffff' : color }}
                title="Select color"
              />
              {showColorPicker && (
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-xl shadow-xl z-20 border border-amber-200">
                  <div className="grid grid-cols-4 gap-2 mb-2 max-w-48">
                    {colorPalette.map((c) => (
                      <button
                        key={c}
                        className={`w-8 h-8 rounded border-2 ${
                          c === '#ffffff' ? 'border-gray-300' : 'border-transparent'
                        } hover:scale-110 transition-transform`}
                        style={{ backgroundColor: c }}
                        onClick={() => {
                          setColor(c);
                          setShowColorPicker(false);
                          if (tool === 'eraser') setTool('pencil');
                        }}
                        title={c === '#ffffff' ? 'White' : c}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                      if (tool === 'eraser') setTool('pencil');
                    }}
                    className="w-full h-8 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Brush Size */}
          <div className="flex flex-col items-center">
            <label className="font-['VT323'] text-amber-900 text-sm mb-1">Base Size</label>
            <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-amber-300">
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={brushSize} 
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-24 accent-amber-500"
              />
              <span className="font-['VT323'] w-8 text-center text-amber-900">{brushSize}</span>
            </div>
            <div className="text-xs text-amber-600 mt-1">
              Actual: {getCurrentToolSize()}px
            </div>
          </div>

          {/* History Controls */}
          <div className="flex flex-col items-center">
            <label className="font-['VT323'] text-amber-900 text-sm mb-1">History</label>
            <div className="flex gap-2">
              <button 
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-['VT323'] text-lg hover:bg-blue-600 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                ↩️ Undo
              </button>
              <button 
                onClick={handleRedo}
                disabled={historyIndex >= drawingHistory.length - 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-['VT323'] text-lg hover:bg-blue-600 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Y)"
              >
                ↪️ Redo
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center">
            <label className="font-['VT323'] text-amber-900 text-sm mb-1">Actions</label>
            <div className="flex gap-2">
              <button 
                onClick={clearCanvas} 
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-['VT323'] text-lg hover:bg-red-600 transition-colors shadow-md"
                title="Clear canvas (can be undone)"
              >
                🗑️ Clear All
              </button>
              
              <button 
                onClick={saveAsImage}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-['VT323'] text-lg hover:bg-green-600 transition-colors shadow-md"
                title="Save as image"
              >
                💾 Save
              </button>
            </div>
          </div>
        </div>

        {/* Templates & Tools Bar */}
        <div className="flex flex-wrap gap-3 mb-6 p-4 bg-amber-50 rounded-2xl shadow-lg items-center justify-center">
          <span className="font-['VT323'] text-amber-900 text-lg">Templates:</span>
          
          <button 
            onClick={addGrid}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg font-['VT323'] text-lg hover:bg-purple-600 transition-colors shadow-md"
            title="Add grid"
          >
            📊 Grid
          </button>
          
          <button 
            onClick={() => addTemplate('mindmap')}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-['VT323'] text-lg hover:bg-indigo-600 transition-colors shadow-md"
            title="Add mind map template"
          >
            🧠 Mind Map
          </button>
          
          <button 
            onClick={() => addTemplate('cornell')}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-['VT323'] text-lg hover:bg-emerald-600 transition-colors shadow-md"
            title="Add Cornell notes template"
          >
            📝 Cornell Notes
          </button>
          
          <button 
            onClick={() => addTemplate('kanban')}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg font-['VT323'] text-lg hover:bg-rose-600 transition-colors shadow-md"
            title="Add Kanban board template"
          >
            📋 Kanban Board
          </button>
        </div>

        {/* Canvas Container */}
        <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-amber-200">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-96 sm:h-[500px] md:h-[600px] cursor-crosshair bg-white rounded-lg border-2 border-amber-100"
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* Status Bar */}
        <div className="mt-4 flex justify-between items-center text-sm text-amber-700 font-['VT323']">
          <div>
            Tool: <span className="font-bold">{tool.charAt(0).toUpperCase() + tool.slice(1)}</span> • 
            Size: <span className="font-bold">{getCurrentToolSize()}px</span> • 
            Color: <span className="font-bold" style={{ color: tool === 'eraser' ? '#ffffff' : color }}>
              {tool === 'eraser' ? 'Eraser' : color}
            </span>
          </div>
          <div>
            History: <span className="font-bold">{historyIndex + 1}</span> / <span className="font-bold">{drawingHistory.length}</span>
            {lastSave && (
              <span className="ml-4">
                Last saved: <span className="font-bold">{lastSave.toLocaleTimeString()}</span>
              </span>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <div className="bg-amber-50 inline-block px-6 py-3 rounded-2xl border border-amber-200">
            <p className="font-['VT323'] text-amber-700 text-lg">
              💡 <strong>Tips:</strong> 
              Draw with mouse/touch • 
              <strong>Ctrl+Z</strong> to undo • 
              <strong>Ctrl+Y</strong> to redo • 
              Clear can be undone • 
              Auto-saves every 3 seconds
            </p>
          </div>
        </div>
      </div>

      {/* Close color picker when clicking outside */}
      {showColorPicker && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowColorPicker(false)}
        />
      )}
    </div>
  );
};

export default Whiteboard;