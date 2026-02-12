import { useState } from 'react';
import { X, Wallet, CreditCard, ArrowRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  PAYMENT_GATEWAYS, 
  KHALTI_BANKS, 
  ESEWA_BANKS, 
  Bank,
  paymentService 
} from '@/services/payment.service';
import { walletService } from '@/services/wallet.service';
import { useToast } from '@/hooks/use-toast';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentBalance: number;
  onSuccess: () => void;
}

type Step = 'amount' | 'gateway' | 'bank' | 'processing' | 'success' | 'failed';

const PRESET_AMOUNTS = [
  { amount: 10, bonus: 0, label: 'NPR 10' },
  { amount: 50, bonus: 5, label: 'NPR 50', badge: '+NPR 5 bonus' },
  { amount: 100, bonus: 15, label: 'NPR 100', badge: '+NPR 15 bonus' },
  { amount: 500, bonus: 100, label: 'NPR 500', badge: '+NPR 100 bonus' },
  { amount: 1000, bonus: 250, label: 'NPR 1,000', badge: '+NPR 250 bonus' }
];

const AddFundsModal = ({ isOpen, onClose, userId, currentBalance, onSuccess }: AddFundsModalProps) => {
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedGateway, setSelectedGateway] = useState<'khalti' | 'esewa' | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [transactionId, setTransactionId] = useState<string>('');
  const { toast } = useToast();

  if (!isOpen) return null;

  const bonus = PRESET_AMOUNTS.find(p => p.amount === amount)?.bonus || 0;
  const totalAmount = amount + bonus;
  const fee = selectedGateway ? paymentService.calculateFee(amount, selectedGateway) : 0;
  const finalAmount = amount + fee;

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= 10) {
      setAmount(parsed);
    }
  };

  const handleGatewaySelect = (gateway: 'khalti' | 'esewa') => {
    setSelectedGateway(gateway);
    setStep('bank');
  };

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
  };

  const handlePayment = async () => {
    if (!selectedGateway || !selectedBank) return;

    setStep('processing');

    try {
      // Initiate payment
      const paymentRequest = {
        amount: finalAmount,
        gateway: selectedGateway,
        bank: selectedBank.id,
        returnUrl: window.location.origin + '/payment/callback',
        userId
      };

      const response = selectedGateway === 'khalti'
        ? await paymentService.initiateKhaltiPayment(paymentRequest)
        : await paymentService.initiateEsewaPayment(paymentRequest);

      if (response.success) {
        setTransactionId(response.transactionId);
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify payment
        const verification = await paymentService.verifyPayment(response.transactionId, selectedGateway);
        
        if (verification.success) {
          // Add funds to wallet
          const added = await walletService.addFunds(userId, totalAmount, response.transactionId, selectedGateway);
          
          if (added) {
            setStep('success');
            onSuccess();
          } else {
            setStep('failed');
          }
        } else {
          setStep('failed');
        }
      } else {
        setStep('failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setStep('failed');
      toast({
        title: 'Payment Failed',
        description: 'Unable to process payment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const resetModal = () => {
    setStep('amount');
    setAmount(100);
    setCustomAmount('');
    setSelectedGateway(null);
    setSelectedBank(null);
    setTransactionId('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a4434]/95 backdrop-blur-xl rounded-2xl border border-emerald-700/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto my-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a4434]/95 backdrop-blur-xl border-b border-emerald-700/30 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Wallet className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Funds</h2>
              <p className="text-sm text-emerald-200/70">Current Balance: NPR {currentBalance.toFixed(2)}</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-emerald-200/70 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Amount Selection */}
          {step === 'amount' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Select Amount</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset.amount}
                      onClick={() => handleAmountSelect(preset.amount)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        amount === preset.amount
                          ? 'border-emerald-500 bg-emerald-500/20'
                          : 'border-emerald-700/50 bg-emerald-900/20 hover:border-emerald-600'
                      }`}
                    >
                      <div className="text-lg font-bold text-white">{preset.label}</div>
                      {preset.bonus > 0 && (
                        <div className="text-xs text-emerald-300 mt-1">{preset.badge}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Custom Amount</label>
                <input
                  type="number"
                  min="10"
                  placeholder="Enter amount (min NPR 10)"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="w-full px-4 py-3 bg-emerald-900/20 border border-emerald-700/50 rounded-xl text-white placeholder:text-emerald-200/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>

              {bonus > 0 && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Bonus: +NPR {bonus.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-emerald-200/70 mt-1">
                    You'll receive NPR {totalAmount.toFixed(2)} in your wallet
                  </p>
                </div>
              )}

              <Button
                onClick={() => setStep('gateway')}
                disabled={amount < 10}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Gateway Selection */}
          {step === 'gateway' && (
            <div className="space-y-6">
              <button
                onClick={() => setStep('amount')}
                className="text-emerald-300 hover:text-emerald-200 text-sm font-medium"
              >
                ← Back to amount
              </button>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>
                <div className="space-y-3">
                  {PAYMENT_GATEWAYS.map((gateway) => (
                    <button
                      key={gateway.id}
                      onClick={() => handleGatewaySelect(gateway.id as 'khalti' | 'esewa')}
                      className="w-full p-4 rounded-xl border-2 border-emerald-700/50 bg-emerald-900/20 hover:border-emerald-600 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{gateway.logo}</span>
                        <div className="text-left">
                          <div className="font-bold text-white">{gateway.name}</div>
                          <div className="text-xs text-emerald-200/70">
                            Fee: {(gateway.fee * 100).toFixed(1)}% • Min: NPR {gateway.minAmount}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-300" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-4">
                <div className="text-sm text-emerald-200/70 space-y-1">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="text-white font-medium">NPR {amount.toFixed(2)}</span>
                  </div>
                  {bonus > 0 && (
                    <div className="flex justify-between text-emerald-300">
                      <span>Bonus:</span>
                      <span className="font-medium">+NPR {bonus.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Bank Selection */}
          {step === 'bank' && selectedGateway && (
            <div className="space-y-6">
              <button
                onClick={() => setStep('gateway')}
                className="text-emerald-300 hover:text-emerald-200 text-sm font-medium"
              >
                ← Back to payment method
              </button>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Select Bank ({selectedGateway === 'khalti' ? 'Khalti' : 'eSewa'})
                </h3>
                
                {/* Mobile Banking */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-emerald-300 mb-3">📱 Mobile Banking</h4>
                  <div className="space-y-2">
                    {(selectedGateway === 'khalti' ? KHALTI_BANKS : ESEWA_BANKS)
                      .filter(b => b.type === 'mobile')
                      .map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => handleBankSelect(bank)}
                          className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                            selectedBank?.id === bank.id
                              ? 'border-emerald-500 bg-emerald-500/20'
                              : 'border-emerald-700/50 bg-emerald-900/20 hover:border-emerald-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{bank.logo}</span>
                            <span className="text-white font-medium text-sm">{bank.name}</span>
                          </div>
                          {selectedBank?.id === bank.id && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                          )}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Internet Banking */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-emerald-300 mb-3">💻 Internet Banking</h4>
                  <div className="space-y-2">
                    {(selectedGateway === 'khalti' ? KHALTI_BANKS : ESEWA_BANKS)
                      .filter(b => b.type === 'internet')
                      .map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => handleBankSelect(bank)}
                          className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                            selectedBank?.id === bank.id
                              ? 'border-emerald-500 bg-emerald-500/20'
                              : 'border-emerald-700/50 bg-emerald-900/20 hover:border-emerald-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{bank.logo}</span>
                            <span className="text-white font-medium text-sm">{bank.name}</span>
                          </div>
                          {selectedBank?.id === bank.id && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                          )}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Direct Payment */}
                <div>
                  <h4 className="text-sm font-semibold text-emerald-300 mb-3">🔗 Direct Payment</h4>
                  <div className="space-y-2">
                    {(selectedGateway === 'khalti' ? KHALTI_BANKS : ESEWA_BANKS)
                      .filter(b => b.type === 'direct')
                      .map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => handleBankSelect(bank)}
                          className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                            selectedBank?.id === bank.id
                              ? 'border-emerald-500 bg-emerald-500/20'
                              : 'border-emerald-700/50 bg-emerald-900/20 hover:border-emerald-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{bank.logo}</span>
                            <span className="text-white font-medium text-sm">{bank.name}</span>
                          </div>
                          {selectedBank?.id === bank.id && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {selectedBank && (
                <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm text-emerald-200/70">
                    <span>Amount:</span>
                    <span className="text-white font-medium">NPR {amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-emerald-200/70">
                    <span>Gateway Fee:</span>
                    <span className="text-white font-medium">NPR {fee.toFixed(2)}</span>
                  </div>
                  {bonus > 0 && (
                    <div className="flex justify-between text-sm text-emerald-300">
                      <span>Bonus:</span>
                      <span className="font-medium">+NPR {bonus.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-emerald-700/30 pt-2 flex justify-between font-bold">
                    <span className="text-white">Total to Pay:</span>
                    <span className="text-emerald-300">NPR {finalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-white">You'll Receive:</span>
                    <span className="text-emerald-300">NPR {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={!selectedBank}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pay NPR {finalAmount.toFixed(2)}
              </Button>
            </div>
          )}

          {/* Step 4: Processing */}
          {step === 'processing' && (
            <div className="py-12 text-center">
              <Loader2 className="w-16 h-16 text-emerald-300 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Processing Payment...</h3>
              <p className="text-emerald-200/70">Please wait while we process your payment</p>
              <p className="text-sm text-emerald-200/50 mt-2">Transaction ID: {transactionId}</p>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 'success' && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
              <p className="text-emerald-200/70 mb-4">NPR {totalAmount.toFixed(2)} has been added to your wallet</p>
              <p className="text-sm text-emerald-200/50 mb-6">Transaction ID: {transactionId}</p>
              <Button
                onClick={handleClose}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold"
              >
                Done
              </Button>
            </div>
          )}

          {/* Step 6: Failed */}
          {step === 'failed' && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-12 h-12 text-red-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Payment Failed</h3>
              <p className="text-emerald-200/70 mb-6">Unable to process your payment. Please try again.</p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={resetModal}
                  variant="outline"
                  className="border-emerald-700/50 text-white hover:bg-emerald-900/20"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleClose}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFundsModal;
