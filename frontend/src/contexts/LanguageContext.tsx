import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<string, Record<Language, string>> = {
  // Navbar
  'nav.home': { en: 'Home', ne: 'गृहपृष्ठ' },
  'nav.verify': { en: 'Verify Medicine', ne: 'औषधि प्रमाणित गर्नुहोस्' },
  'nav.dashboard': { en: 'Dashboard', ne: 'ड्यासबोर्ड' },
  'nav.dda': { en: 'DDA View', ne: 'DDA दृश्य' },
  'nav.wallet': { en: 'Wallet Balance', ne: 'वालेट ब्यालेन्स' },
  'nav.addFunds': { en: 'Add Funds', ne: 'रकम थप्नुहोस्' },
  'nav.perScan': { en: 'per scan', ne: 'प्रति स्क्यान' },
  'nav.accountStatus': { en: 'Account Status', ne: 'खाता स्थिति' },
  'nav.active': { en: 'Active', ne: 'सक्रिय' },
  'nav.role': { en: 'Role', ne: 'भूमिका' },
  'nav.user': { en: 'User', ne: 'प्रयोगकर्ता' },
  'nav.upgradePlan': { en: 'Upgrade Plan', ne: 'योजना अपग्रेड गर्नुहोस्' },
  'nav.logout': { en: 'Logout', ne: 'लगआउट' },
  'nav.status': { en: 'Status', ne: 'स्थिति' },

  // Landing Page
  'landing.title': { en: 'Sahi Aaushadi', ne: 'सही औषधि' },
  'landing.subtitle': { en: 'Verify Authentic Medicines with Blockchain Technology', ne: 'ब्लकचेन प्रविधिसँग प्रामाणिक औषधि प्रमाणित गर्नुहोस्' },
  'landing.description': { en: 'Protect yourself and your loved ones from counterfeit medicines. Scan QR codes to instantly verify authenticity through our secure blockchain system.', ne: 'नक्कली औषधिबाट आफू र आफ्ना प्रियजनहरूलाई सुरक्षित राख्नुहोस्। हाम्रो सुरक्षित ब्लकचेन प्रणाली मार्फत प्रामाणिकता तुरुन्तै प्रमाणित गर्न QR कोड स्क्यान गर्नुहोस्।' },
  'landing.getStarted': { en: 'Get Started', ne: 'सुरु गर्नुहोस्' },
  'landing.learnMore': { en: 'Learn More', ne: 'थप जान्नुहोस्' },
  'landing.quickActions': { en: 'Quick Actions', ne: 'द्रुत कार्यहरू' },
  'landing.verifyMedicine': { en: 'Verify Medicine', ne: 'औषधि प्रमाणित गर्नुहोस्' },
  'landing.verifyDesc': { en: 'Scan QR code to check authenticity', ne: 'प्रामाणिकता जाँच गर्न QR कोड स्क्यान गर्नुहोस्' },
  'landing.findPharmacy': { en: 'Find Pharmacy', ne: 'फार्मेसी खोज्नुहोस्' },
  'landing.findDesc': { en: 'Locate verified pharmacies near you', ne: 'तपाईंको नजिकका प्रमाणित फार्मेसीहरू फेला पार्नुहोस्' },
  'landing.emergencyAlerts': { en: 'Emergency Alerts', ne: 'आपतकालीन सतर्कता' },
  'landing.emergencyDesc': { en: 'Get notified about medicine recalls', ne: 'औषधि फिर्ताको बारेमा सूचित हुनुहोस्' },
  'landing.howItWorks': { en: 'How It Works', ne: 'यो कसरी काम गर्छ' },
  'landing.scanQR': { en: 'Scan QR Code', ne: 'QR कोड स्क्यान गर्नुहोस्' },
  'landing.scanDesc': { en: 'Use your phone camera to scan the QR code on medicine packaging', ne: 'औषधि प्याकेजिङमा रहेको QR कोड स्क्यान गर्न आफ्नो फोन क्यामेरा प्रयोग गर्नुहोस्' },
  'landing.instantVerify': { en: 'Instant Verification', ne: 'तत्काल प्रमाणीकरण' },
  'landing.instantDesc': { en: 'Our blockchain system verifies authenticity in seconds', ne: 'हाम्रो ब्लकचेन प्रणालीले सेकेन्डमा प्रामाणिकता प्रमाणित गर्छ' },
  'landing.detailedInfo': { en: 'Detailed Information', ne: 'विस्तृत जानकारी' },
  'landing.detailedDesc': { en: 'View complete medicine details, manufacturer info, and expiry dates', ne: 'पूर्ण औषधि विवरण, निर्माता जानकारी, र म्याद समाप्ति मिति हेर्नुहोस्' },
  'landing.whyChoose': { en: 'Why Choose Sahi Aaushadi?', ne: 'किन सही औषधि छनौट गर्ने?' },
  'landing.blockchainSecurity': { en: 'Blockchain Security', ne: 'ब्लकचेन सुरक्षा' },
  'landing.blockchainDesc': { en: 'Immutable records ensure medicine authenticity cannot be faked', ne: 'अपरिवर्तनीय रेकर्डहरूले औषधि प्रामाणिकता नक्कली हुन सक्दैन भनेर सुनिश्चित गर्दछ' },
  'landing.instantResults': { en: 'Instant Results', ne: 'तत्काल परिणाम' },
  'landing.instantResultsDesc': { en: 'Get verification results in real-time, anywhere, anytime', ne: 'जुनसुकै बेला, जहाँसुकै, वास्तविक समयमा प्रमाणीकरण परिणाम प्राप्त गर्नुहोस्' },
  'landing.govApproved': { en: 'Government Approved', ne: 'सरकार अनुमोदित' },
  'landing.govDesc': { en: 'Certified by Department of Drug Administration, Nepal', ne: 'औषधि व्यवस्था विभाग, नेपाल द्वारा प्रमाणित' },
  'landing.userFriendly': { en: 'User Friendly', ne: 'प्रयोगकर्ता मैत्री' },
  'landing.userDesc': { en: 'Simple interface designed for everyone to use easily', ne: 'सबैले सजिलै प्रयोग गर्न डिजाइन गरिएको सरल इन्टरफेस' },
  'landing.footer': { en: 'Official DDA Nepal Approved Platform', ne: 'आधिकारिक DDA नेपाल अनुमोदित प्लेटफर्म' },
  'landing.rights': { en: 'All rights reserved', ne: 'सर्वाधिकार सुरक्षित' },

  // Verify Page
  'verify.title': { en: 'Verify Medicine', ne: 'औषधि प्रमाणित गर्नुहोस्' },
  'verify.subtitle': { en: 'Scan QR code or enter medicine ID to verify authenticity', ne: 'प्रामाणिकता प्रमाणित गर्न QR कोड स्क्यान गर्नुहोस् वा औषधि ID प्रविष्ट गर्नुहोस्' },
  'verify.scannerPortal': { en: 'Scanner Portal', ne: 'स्क्यानर पोर्टल' },
  'verify.scanQR': { en: 'Scan QR Code', ne: 'QR कोड स्क्यान गर्नुहोस्' },
  'verify.orEnter': { en: 'Or Enter Medicine ID', ne: 'वा औषधि ID प्रविष्ट गर्नुहोस्' },
  'verify.medicineId': { en: 'Medicine ID', ne: 'औषधि ID' },
  'verify.enterPlaceholder': { en: 'Enter medicine ID (e.g., MED001)', ne: 'औषधि ID प्रविष्ट गर्नुहोस् (जस्तै, MED001)' },
  'verify.verifyButton': { en: 'Verify Medicine', ne: 'औषधि प्रमाणित गर्नुहोस्' },
  'verify.scanningHelp': { en: 'Scanning Help', ne: 'स्क्यानिङ सहायता' },
  'verify.helpTitle': { en: 'How to Scan', ne: 'कसरी स्क्यान गर्ने' },
  'verify.helpStep1': { en: 'Position QR code in center', ne: 'QR कोड केन्द्रमा राख्नुहोस्' },
  'verify.helpStep2': { en: 'Ensure good lighting', ne: 'राम्रो प्रकाश सुनिश्चित गर्नुहोस्' },
  'verify.helpStep3': { en: 'Hold camera steady', ne: 'क्यामेरा स्थिर राख्नुहोस्' },
  'verify.helpStep4': { en: 'Wait for auto-scan', ne: 'स्वत: स्क्यानको लागि पर्खनुहोस्' },

  // Dashboard
  'dashboard.title': { en: 'Dashboard', ne: 'ड्यासबोर्ड' },
  'dashboard.overview': { en: 'Overview', ne: 'सारांश' },
  'dashboard.analytics': { en: 'Analytics', ne: 'विश्लेषण' },
  'dashboard.history': { en: 'History', ne: 'इतिहास' },
  'dashboard.totalScans': { en: 'Total Scans', ne: 'कुल स्क्यानहरू' },
  'dashboard.verified': { en: 'Verified', ne: 'प्रमाणित' },
  'dashboard.suspicious': { en: 'Suspicious', ne: 'संदिग्ध' },
  'dashboard.recentActivity': { en: 'Recent Activity', ne: 'हालको गतिविधि' },

  // Subscription Modal
  'sub.title': { en: 'Choose Your Plan', ne: 'आफ्नो योजना छनौट गर्नुहोस्' },
  'sub.subtitle': { en: 'Upgrade for unlimited scans', ne: 'असीमित स्क्यानको लागि अपग्रेड गर्नुहोस्' },
  'sub.monthly': { en: 'Monthly', ne: 'मासिक' },
  'sub.yearly': { en: 'Yearly', ne: 'वार्षिक' },
  'sub.save20': { en: 'Save 20%', ne: '20% बचत गर्नुहोस्' },
  'sub.basic': { en: 'Basic', ne: 'आधारभूत' },
  'sub.pro': { en: 'Pro', ne: 'प्रो' },
  'sub.mostPopular': { en: '⭐ Most Popular', ne: '⭐ सबैभन्दा लोकप्रिय' },
  'sub.perMonth': { en: '/mo', ne: '/महिना' },
  'sub.perYear': { en: '/yr', ne: '/वर्ष' },
  'sub.savePerYear': { en: 'Save Rs {amount} per year', ne: 'प्रति वर्ष रु {amount} बचत गर्नुहोस्' },
  'sub.scansMonth': { en: '10 scans/month', ne: '10 स्क्यान/महिना' },
  'sub.unlimitedScans': { en: 'Unlimited scans', ne: 'असीमित स्क्यान' },
  'sub.subscribeNow': { en: 'Subscribe Now', ne: 'अहिले सदस्यता लिनुहोस्' },
  'sub.backToPlans': { en: '← Back to plans', ne: '← योजनाहरूमा फर्कनुहोस्' },
  'sub.plan': { en: 'Plan', ne: 'योजना' },
  'sub.selectPayment': { en: 'Select Payment Method', ne: 'भुक्तानी विधि चयन गर्नुहोस्' },
  'sub.payWithKhalti': { en: 'Pay with Khalti', ne: 'खल्तीबाट भुक्तानी गर्नुहोस्' },
  'sub.payWithEsewa': { en: 'Pay with eSewa', ne: 'ईसेवाबाट भुक्तानी गर्नुहोस्' },
  'sub.digitalWallet': { en: 'Digital wallet payment', ne: 'डिजिटल वालेट भुक्तानी' },
  'sub.backToPayment': { en: '← Back to payment method', ne: '← भुक्तानी विधिमा फर्कनुहोस्' },
  'sub.khaltiPayment': { en: 'Khalti Payment', ne: 'खल्ती भुक्तानी' },
  'sub.esewaPayment': { en: 'eSewa Payment', ne: 'ईसेवा भुक्तानी' },
  'sub.demoMode': { en: 'Demo Mode - For Testing', ne: 'डेमो मोड - परीक्षणको लागि' },
  'sub.billing': { en: 'Billing', ne: 'बिलिङ' },
  'sub.totalAmount': { en: 'Total Amount', ne: 'कुल रकम' },
  'sub.phoneNumber': { en: 'Phone Number', ne: 'फोन नम्बर' },
  'sub.phonePlaceholder': { en: '98XXXXXXXX', ne: '98XXXXXXXX' },
  'sub.mpin': { en: 'MPIN', ne: 'MPIN' },
  'sub.mpinPlaceholder': { en: '****', ne: '****' },
  'sub.payDemo': { en: 'Pay Rs {amount} (Demo)', ne: 'रु {amount} भुक्तानी गर्नुहोस् (डेमो)' },
  'sub.demoNote': { en: '🔒 This is a demo payment. No real money will be charged.', ne: '🔒 यो डेमो भुक्तानी हो। कुनै वास्तविक पैसा चार्ज गरिने छैन।' },
  'sub.processing': { en: 'Processing Payment...', ne: 'भुक्तानी प्रशोधन गर्दै...' },
  'sub.processingWait': { en: 'Please wait while we activate your subscription', ne: 'कृपया हामीले तपाईंको सदस्यता सक्रिय गर्दा पर्खनुहोस्' },
  'sub.activated': { en: 'Subscription Activated!', ne: 'सदस्यता सक्रिय भयो!' },
  'sub.planActive': { en: 'Your {plan} plan is now active', ne: 'तपाईंको {plan} योजना अब सक्रिय छ' },
  'sub.enjoyFeatures': { en: 'Enjoy {scans} and all premium features', ne: '{scans} र सबै प्रिमियम सुविधाहरूको आनन्द लिनुहोस्' },

  // Add Funds Modal
  'funds.title': { en: 'Add Funds', ne: 'रकम थप्नुहोस्' },
  'funds.currentBalance': { en: 'Current Balance', ne: 'हालको ब्यालेन्स' },
  'funds.selectAmount': { en: 'Select Amount', ne: 'रकम चयन गर्नुहोस्' },
  'funds.bonus': { en: 'bonus', ne: 'बोनस' },
  'funds.customAmount': { en: 'Custom Amount', ne: 'अनुकूलित रकम' },
  'funds.customPlaceholder': { en: 'Enter amount (min NPR 10)', ne: 'रकम प्रविष्ट गर्नुहोस् (न्यूनतम NPR 10)' },
  'funds.bonusReceive': { en: 'You\'ll receive NPR {amount} in your wallet', ne: 'तपाईंले आफ्नो वालेटमा NPR {amount} प्राप्त गर्नुहुनेछ' },
  'funds.continue': { en: 'Continue', ne: 'जारी राख्नुहोस्' },
  'funds.backToAmount': { en: '← Back to amount', ne: '← रकममा फर्कनुहोस्' },
  'funds.amount': { en: 'Amount', ne: 'रकम' },
  'funds.gatewayFee': { en: 'Gateway Fee', ne: 'गेटवे शुल्क' },
  'funds.totalToPay': { en: 'Total to Pay', ne: 'भुक्तानी गर्नुपर्ने कुल' },
  'funds.youllReceive': { en: 'You\'ll Receive', ne: 'तपाईंले प्राप्त गर्नुहुनेछ' },
  'funds.pay': { en: 'Pay NPR {amount}', ne: 'NPR {amount} भुक्तानी गर्नुहोस्' },
  'funds.processingPayment': { en: 'Processing Payment...', ne: 'भुक्तानी प्रशोधन गर्दै...' },
  'funds.processingWait': { en: 'Please wait while we process your payment', ne: 'कृपया हामीले तपाईंको भुक्तानी प्रशोधन गर्दा पर्खनुहोस्' },
  'funds.transactionId': { en: 'Transaction ID', ne: 'लेनदेन ID' },
  'funds.success': { en: 'Payment Successful!', ne: 'भुक्तानी सफल!' },
  'funds.addedToWallet': { en: 'NPR {amount} has been added to your wallet', ne: 'NPR {amount} तपाईंको वालेटमा थपिएको छ' },
  'funds.done': { en: 'Done', ne: 'सम्पन्न' },
  'funds.failed': { en: 'Payment Failed', ne: 'भुक्तानी असफल' },
  'funds.failedDesc': { en: 'Unable to process your payment. Please try again.', ne: 'तपाईंको भुक्तानी प्रशोधन गर्न असमर्थ। कृपया पुन: प्रयास गर्नुहोस्।' },
  'funds.tryAgain': { en: 'Try Again', ne: 'पुन: प्रयास गर्नुहोस्' },
  'funds.close': { en: 'Close', ne: 'बन्द गर्नुहोस्' },

  // Common
  'common.loading': { en: 'Loading...', ne: 'लोड गर्दै...' },
  'common.error': { en: 'Error', ne: 'त्रुटि' },
  'common.success': { en: 'Success', ne: 'सफलता' },
  'common.cancel': { en: 'Cancel', ne: 'रद्द गर्नुहोस्' },
  'common.confirm': { en: 'Confirm', ne: 'पुष्टि गर्नुहोस्' },
  'common.back': { en: 'Back', ne: 'पछाडि' },
  'common.next': { en: 'Next', ne: 'अर्को' },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[key]?.[language] || key;
    
    // Replace parameters like {amount} with actual values
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
