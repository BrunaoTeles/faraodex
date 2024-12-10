"use client";

import { useState } from "react";

const MangaReader = ({ pages }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleZoomIn = () => {
    if (zoom < 3) {
      setZoom(zoom + 0.25);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 1) {
      setZoom(zoom - 0.25);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center relative">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        {/* Zoom controls */}
        <div className="text-white flex space-x-2">
          <button
            onClick={handleZoomIn}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            -
          </button>
        </div>

        {/* Page number display */}
        <div className="text-white text-xl">
          {currentPage + 1} / {pages.length}
        </div>
      </div>

      <div className="relative flex justify-center items-center w-full max-w-screen-md">
        <div
          className="overflow-hidden"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
        >
          <img
            src={pages[currentPage]}
            alt={`Page ${currentPage + 1}`}
            className="transition-transform duration-300"
            style={{ maxWidth: "100%", maxHeight: "100vh" }}
          />
        </div>
      </div>

      {/* Navigation controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="bg-gray-700 hover:bg-gray-800 text-white p-3 rounded disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === pages.length - 1}
          className="bg-gray-700 hover:bg-gray-800 text-white p-3 rounded disabled:opacity-50"
        >
          Avançar
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 h-1 z-10">
        <div
          className="bg-blue-600 h-full"
          style={{
            width: `${((currentPage + 1) / pages.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default MangaReader;
