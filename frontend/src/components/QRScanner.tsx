import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const QRScanner = ({ onScanSuccess, onClose }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startScanner = async () => {
      try {
        setIsScanning(true);
        setError('');

        // Initialize scanner
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        // Request camera permission and start scanning
        await scanner.start(
          { facingMode: 'environment' }, // Use back camera on mobile
          {
            fps: 10, // Frames per second
            qrbox: { width: 250, height: 250 }, // Scanning box size
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Success callback
            console.log('QR Code detected:', decodedText);
            handleScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Error callback (can be ignored for continuous scanning)
            // console.log('Scan error:', errorMessage);
          }
        );

        setIsScanning(false);
      } catch (err: any) {
        console.error('Scanner initialization error:', err);
        setIsScanning(false);
        
        // Handle specific errors
        if (err.name === 'NotAllowedError') {
          setError('Camera permission denied. Please allow camera access and try again.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else if (err.name === 'NotReadableError') {
          setError('Camera is already in use by another application.');
        } else {
          setError('Failed to start camera. Please try again.');
        }
      }
    };

    startScanner();

    // Cleanup function
    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        const scanner = scannerRef.current;
        if (scanner.isScanning) {
          await scanner.stop();
        }
        await scanner.clear();
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    // Stop scanner immediately after successful scan
    await stopScanner();
    
    // Call parent callback with scanned data
    onScanSuccess(decodedText);
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="container mx-auto px-4 py-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Scan QR Code
            </h2>
            <p className="text-sm text-muted-foreground">
              Position the QR code within the frame
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scanner Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {isScanning && (
              <div className="flex flex-col items-center gap-4 mb-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Starting camera...</p>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-4">
                <p className="text-sm text-destructive font-medium mb-2">Camera Error</p>
                <p className="text-xs text-muted-foreground">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="mt-3 w-full"
                >
                  Close Scanner
                </Button>
              </div>
            )}

            {/* QR Reader Container */}
            <div className="relative">
              <div
                id="qr-reader"
                className="rounded-lg overflow-hidden border-2 border-primary/30"
                style={{ width: '100%' }}
              />
              
              {/* Scanning overlay */}
              {!isScanning && !error && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-2 border-primary/50 rounded-lg">
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            {!error && (
              <div className="mt-4 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  📱 Hold your device steady
                </p>
                <p className="text-xs text-muted-foreground">
                  The camera will automatically scan when a QR code is detected
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cancel Button */}
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full"
          >
            Cancel Scanning
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
