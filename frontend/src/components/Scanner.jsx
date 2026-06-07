import React, { useState } from 'react';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { QrCode, AlertCircle, Loader } from 'lucide-react';

const Scanner = ({ onScanSuccess, onScanError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Request and check camera permissions
      const permission = await BarcodeScanner.requestPermissions();
      if (permission.camera !== 'granted') {
        throw new Error('Camera permission denied. Please enable camera access in your device settings.');
      }

      // 2. Open Google ML Kit native scanning sheet overlay
      const { barcodes } = await BarcodeScanner.scan();

      // 3. Process the scanned codes
      if (barcodes && barcodes.length > 0) {
        const result = barcodes[0].rawValue;
        if (onScanSuccess) {
          onScanSuccess(result);
        }
      } else {
        throw new Error('No barcode or QR code detected.');
      }
    } catch (err) {
      const errorMessage = err.message || 'Scanning failed';
      setError(errorMessage);
      if (onScanError) {
        onScanError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border border-gray-100 bg-white rounded-2xl shadow-sm max-w-sm mx-auto">
      <div className="bg-indigo-50 p-4 rounded-full mb-4 text-indigo-600">
        <QrCode size={40} className="animate-pulse" />
      </div>
      
      <h3 className="font-bold text-lg text-gray-900 mb-2">QR Code Scanner</h3>
      <p className="text-gray-500 text-sm text-center mb-6">
        Tap the button below to scan student cards, fees invoices, or exams codes.
      </p>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 text-xs px-3 py-2 rounded-lg mb-4 w-full">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleScan}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
      >
        {loading ? (
          <>
            <Loader size={18} className="animate-spin" />
            <span>Opening Camera...</span>
          </>
        ) : (
          <>
            <QrCode size={18} />
            <span>Scan Now</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Scanner;
