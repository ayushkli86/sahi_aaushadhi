import { useState } from "react";
import { QrCode, Shield, ShieldAlert, ShieldCheck, Package, Calendar, Hash, MapPin, Clock, Loader2, AlertTriangle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import QRScanner from "@/components/QRScanner";
import analyticsService from "@/services/analytics.service";

type VerifyStatus = "idle" | "scanning" | "authentic" | "counterfeit" | "expired" | "suspicious" | "error";

interface VerificationResult {
  isValid: boolean;
  status: 'AUTHENTIC' | 'COUNTERFEIT' | 'EXPIRED' | 'SUSPICIOUS' | 'NOT_FOUND';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  medicine?: {
    product_id: string;
    name: string;
    manufacturer: string;
    batch_number: string;
    manufacture_date: string;
    expiry_date: string;
    description?: string;
    blockchain_tx?: string;
  };
  warnings?: string[];
  checks?: {
    databaseFound: boolean;
    blockchainVerified: boolean;
    notExpired: boolean;
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Verify = () => {
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    await handleVerifyWithCode(code);
  };

  const handleReset = () => {
    setStatus("idle");
    setCode("");
    setResult(null);
  };

  const handleScanSuccess = (decodedText: string) => {
    // Close scanner
    setShowScanner(false);
    
    // Extract product ID from QR code
    // QR code might contain JSON, plain text format, or just the product ID
    let productId = decodedText;
    let scannedData = null;
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(decodedText);
      scannedData = parsed;
      productId = parsed.productId || parsed.product_id || parsed.id || decodedText;
    } catch {
      // Check if it's batch format (Batch No: ... Name: ... Manufacturer: ...)
      if (decodedText.includes('Batch No:')) {
        const lines = decodedText.split('\n');
        const batchMatch = lines.find(l => l.startsWith('Batch No:'));
        const nameMatch = lines.find(l => l.startsWith('Name:'));
        const mfgMatch = lines.find(l => l.startsWith('Manufacturer:'));
        const expiryMatch = lines.find(l => l.startsWith('Expiry Date:'));
        
        if (batchMatch) {
          const batchNumber = batchMatch.replace('Batch No:', '').trim();
          // Use batch number as identifier for verification
          productId = batchNumber;
          
          if (nameMatch && mfgMatch) {
            scannedData = {
              batchNumber: batchNumber,
              name: nameMatch.replace('Name:', '').trim(),
              manufacturer: mfgMatch.replace('Manufacturer:', '').trim(),
              expiryDate: expiryMatch ? expiryMatch.replace('Expiry Date:', '').trim() : null
            };
          }
        }
      } 
      // Check if it's Product ID format
      else if (decodedText.includes('Product ID:')) {
        const lines = decodedText.split('\n');
        const idMatch = lines.find(l => l.startsWith('Product ID:'));
        const nameMatch = lines.find(l => l.startsWith('Name:'));
        const mfgMatch = lines.find(l => l.startsWith('Manufacturer:'));
        const expiryMatch = lines.find(l => l.startsWith('Expiry Date:'));
        
        if (idMatch) {
          productId = idMatch.replace('Product ID:', '').trim();
          
          if (nameMatch && mfgMatch) {
            scannedData = {
              name: nameMatch.replace('Name:', '').trim(),
              manufacturer: mfgMatch.replace('Manufacturer:', '').trim(),
              expiryDate: expiryMatch ? expiryMatch.replace('Expiry Date:', '').trim() : null
            };
          }
        }
      } else {
        // If not JSON or plain text format, use the raw text as product ID
        productId = decodedText;
      }
    }
    
    // Set the code and trigger verification
    setCode(productId);
    
    // Show success toast with more details if data available
    if (scannedData) {
      toast({
        title: "✅ Medicine QR Code Scanned",
        description: `${scannedData.name || 'Medicine'} - ${scannedData.manufacturer || 'Unknown'}`,
      });
    } else {
      toast({
        title: "QR Code Scanned",
        description: `Code: ${productId}`,
      });
    }
    
    // Auto-verify after a short delay
    setTimeout(() => {
      handleVerifyWithCode(productId);
    }, 500);
  };

  const handleVerifyWithCode = async (productId: string) => {
    if (!productId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a product ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setStatus("scanning");

    try {
      const response = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: productId.trim() })
      });

      const data: VerificationResult = await response.json();
      setResult(data);

      // Increment scan count in analytics
      analyticsService.incrementScanCount();

      // Map backend status to frontend status
      if (data.status === 'AUTHENTIC') {
        setStatus('authentic');
      } else if (data.status === 'COUNTERFEIT' || data.status === 'NOT_FOUND') {
        setStatus('counterfeit');
      } else if (data.status === 'EXPIRED') {
        setStatus('expired');
      } else if (data.status === 'SUSPICIOUS') {
        setStatus('suspicious');
      }

    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      toast({
        title: "Verification Failed",
        description: "Unable to connect to verification service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-white relative">
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(135deg, #163A2C 0%, #1B4433 35%, #0F2A21 70%, #0B2019 100%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12 max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Verify Your Medicine</h1>
            <p className="text-white/70 text-sm">
              Scan the QR code or enter the unique code to verify authenticity
            </p>
          </div>

        {status === "idle" && (
          <div className="space-y-6 animate-fade-up">
            {/* QR Scanner Button */}
            <div className="relative bg-card rounded-2xl border-2 border-dashed border-primary/30 p-8 flex flex-col items-center gap-4">
              <div className="relative">
                <QrCode className="w-20 h-20 text-primary/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full gradient-hero animate-pulse-glow" />
                </div>
              </div>
              <Button
                onClick={() => setShowScanner(true)}
                className="gradient-hero text-primary-foreground border-0 gap-2"
                size="lg"
              >
                <Camera className="w-5 h-5" />
                Scan QR Code
              </Button>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Click to open camera and scan the QR code on your medicine package
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">or enter code</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="flex gap-2">
              <Input
                placeholder='Enter product ID (e.g., MED-ABC12345)'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                className="flex-1"
              />
              <Button onClick={handleVerify} disabled={!code || loading} className="gradient-hero text-primary-foreground border-0">
                Verify
              </Button>
            </div>
          </div>
        )}

        {status === "scanning" && (
          <div className="bg-card rounded-2xl border p-12 flex flex-col items-center gap-4 animate-fade-up">
            <Loader2 className="w-12 h-12 text-secondary animate-spin" />
            <div className="text-center space-y-2">
              <p className="font-semibold text-foreground">Querying Blockchain...</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>→ Decrypting AES-256 hash...</p>
                <p>→ Validating on immutable ledger...</p>
                <p>→ Cross-referencing batch data...</p>
              </div>
            </div>
          </div>
        )}

        {status === "authentic" && result?.medicine && (
          <div className="space-y-4 animate-fade-up">
            <div className="bg-card rounded-2xl border-2 border-success p-6 glow-green">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full gradient-success flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-success-foreground" />
                </div>
                <div>
                  <p className="font-bold text-lg text-success">✅ Authentic Medicine</p>
                  <p className="text-xs text-muted-foreground">Blockchain verified • {result.confidence} confidence</p>
                </div>
              </div>

              <div className="bg-success/10 rounded-lg p-3 mb-4">
                <p className="text-sm text-success font-medium">{result.message}</p>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Package, label: "Drug Name", value: result.medicine.name },
                  { icon: Shield, label: "Manufacturer", value: result.medicine.manufacturer },
                  { icon: Hash, label: "Batch Number", value: result.medicine.batch_number },
                  { icon: Calendar, label: "Manufacture Date", value: new Date(result.medicine.manufacture_date).toLocaleDateString() },
                  { icon: Calendar, label: "Expiry Date", value: new Date(result.medicine.expiry_date).toLocaleDateString() },
                  { icon: Hash, label: "Product ID", value: result.medicine.product_id },
                  ...(result.medicine.blockchain_tx ? [{ icon: Clock, label: "Blockchain Tx", value: result.medicine.blockchain_tx.substring(0, 20) + '...' }] : []),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                    <item.icon className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground break-all">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {result.checks && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Verification Checks:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-3 h-3 text-success" />
                      <span className="text-muted-foreground">Database: {result.checks.databaseFound ? '✓ Found' : '✗ Not Found'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-3 h-3 text-success" />
                      <span className="text-muted-foreground">Blockchain: {result.checks.blockchainVerified ? '✓ Verified' : '✗ Not Verified'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-3 h-3 text-success" />
                      <span className="text-muted-foreground">Expiry: {result.checks.notExpired ? '✓ Valid' : '✗ Expired'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Verify Another
            </Button>
          </div>
        )}

        {(status === "counterfeit" || status === "expired" || status === "suspicious") && result && (
          <div className="space-y-4 animate-fade-up">
            <div className="bg-card rounded-2xl border-2 border-destructive p-6" style={{ boxShadow: "0 0 40px hsl(6 78% 57% / 0.2)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full gradient-danger flex items-center justify-center">
                  {status === "expired" ? (
                    <AlertTriangle className="w-6 h-6 text-destructive-foreground" />
                  ) : (
                    <ShieldAlert className="w-6 h-6 text-destructive-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg text-destructive">
                    {status === "counterfeit" && "🚨 Counterfeit Alert"}
                    {status === "expired" && "⚠️ Expired Medicine"}
                    {status === "suspicious" && "⚠️ Suspicious Product"}
                  </p>
                  <p className="text-xs text-muted-foreground">{result.confidence} confidence</p>
                </div>
              </div>

              <div className="bg-destructive/10 rounded-xl p-4 space-y-2 mb-4">
                <p className="text-sm font-medium text-destructive">{result.message}</p>
              </div>

              {result.warnings && result.warnings.length > 0 && (
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <p className="text-xs font-medium text-foreground mb-2">⚠️ Warnings:</p>
                  {result.warnings.map((warning, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-destructive text-xs mt-0.5">•</span>
                      <p className="text-xs text-muted-foreground">{warning}</p>
                    </div>
                  ))}
                </div>
              )}

              {result.medicine && (
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Product Information:</p>
                  <div className="space-y-1 text-xs">
                    <p><span className="text-muted-foreground">Name:</span> <span className="font-medium text-foreground">{result.medicine.name}</span></p>
                    <p><span className="text-muted-foreground">Manufacturer:</span> <span className="font-medium text-foreground">{result.medicine.manufacturer}</span></p>
                    <p><span className="text-muted-foreground">Product ID:</span> <span className="font-mono font-medium text-foreground">{result.medicine.product_id}</span></p>
                  </div>
                </div>
              )}

              {result.checks && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Verification Checks:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      {result.checks.databaseFound ? (
                        <ShieldCheck className="w-3 h-3 text-success" />
                      ) : (
                        <ShieldAlert className="w-3 h-3 text-destructive" />
                      )}
                      <span className="text-muted-foreground">Database: {result.checks.databaseFound ? '✓ Found' : '✗ Not Found'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {result.checks.blockchainVerified ? (
                        <ShieldCheck className="w-3 h-3 text-success" />
                      ) : (
                        <ShieldAlert className="w-3 h-3 text-destructive" />
                      )}
                      <span className="text-muted-foreground">Blockchain: {result.checks.blockchainVerified ? '✓ Verified' : '✗ Not Verified'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {result.checks.notExpired ? (
                        <ShieldCheck className="w-3 h-3 text-success" />
                      ) : (
                        <ShieldAlert className="w-3 h-3 text-destructive" />
                      )}
                      <span className="text-muted-foreground">Expiry: {result.checks.notExpired ? '✓ Valid' : '✗ Expired'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
                <p>Report Code: <span className="font-mono font-medium text-foreground">RPT-{Date.now().toString(36).toUpperCase()}</span></p>
                <p className="mt-1">If you believe this is an error, please contact the manufacturer or DDA.</p>
              </div>
            </div>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Verify Another
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 animate-fade-up">
            <div className="bg-card rounded-2xl border-2 border-destructive p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="font-bold text-lg text-destructive">Connection Error</p>
                  <p className="text-xs text-muted-foreground">Unable to verify</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Unable to connect to the verification service. Please check your internet connection and try again.
              </p>
              <Button onClick={handleReset} variant="outline" className="w-full">
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
      </div>
    </div>
  );
};

export default Verify;
