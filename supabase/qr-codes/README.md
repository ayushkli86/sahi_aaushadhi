# Sahi Aaushadi - QR Code Generator

Generate QR codes for all medicines in the database (MED-AUTH200000 to MED-AUTH200020).

## 📋 Overview

This tool generates QR codes for 21 medicines with the following data:
- Product ID (MED-AUTH200000 to MED-AUTH200020)
- Medicine Name
- Manufacturer
- Batch Number
- Manufacture Date
- Expiry Date

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd supabase/qr-codes
npm install
```

### 2. Generate QR Codes

```bash
npm run generate
```

### 3. View Results

Open `generated/index.html` in your browser to see all QR codes with medicine details.

## 📁 Output Structure

```
supabase/qr-codes/
├── generated/
│   ├── MED-AUTH200000.png
│   ├── MED-AUTH200001.png
│   ├── ...
│   ├── MED-AUTH200020.png
│   ├── index.html (Visual gallery)
│   └── generation-summary.json (Metadata)
├── generate-medicine-qr-codes.js
├── package.json
└── README.md
```

## 🎯 QR Code Format

Each QR code contains the **Product ID** (e.g., `MED-AUTH200000`).

When scanned:
1. The QR scanner extracts the Product ID
2. The Verify page sends it to the backend API
3. The API queries Supabase for medicine details
4. Full information is displayed to the user

## 📱 Testing QR Codes

### Option 1: Use Your Phone
1. Open the generated `index.html` file
2. Use your phone's camera or QR scanner app
3. Scan any QR code
4. It should show the Product ID

### Option 2: Use the Web App
1. Start the frontend: `npm run dev` (in frontend folder)
2. Go to http://localhost:8080/verify
3. Click "Scan QR Code"
4. Allow camera access
5. Show the QR code to your camera
6. The app will automatically verify the medicine

### Option 3: Print and Test
1. Print the QR codes from `index.html`
2. Attach to medicine packages
3. Scan with the mobile app

## 🎨 QR Code Specifications

- **Format**: PNG
- **Size**: 400x400 pixels
- **Error Correction**: High (H level)
- **Color**: Teal (#0D9488) on White
- **Margin**: 2 modules
- **Quality**: Maximum (1.0)

## 📊 Medicine List

| Product ID | Medicine Name | Manufacturer |
|------------|---------------|--------------|
| MED-AUTH200000 | Paracetamol 500mg | Nepal Pharma Ltd |
| MED-AUTH200001 | Amoxicillin 250mg | Himalayan Drugs |
| MED-AUTH200002 | Ibuprofen 400mg | Nepal Pharma Ltd |
| MED-AUTH200003 | Ciprofloxacin 500mg | Kathmandu Pharmaceuticals |
| MED-AUTH200004 | Metformin 500mg | Himalayan Drugs |
| MED-AUTH200005 | Omeprazole 20mg | Nepal Pharma Ltd |
| MED-AUTH200006 | Aspirin 75mg | Pokhara Medicines |
| MED-AUTH200007 | Atorvastatin 10mg | Kathmandu Pharmaceuticals |
| MED-AUTH200008 | Losartan 50mg | Himalayan Drugs |
| MED-AUTH200009 | Amlodipine 5mg | Nepal Pharma Ltd |
| MED-AUTH200010 | Cetirizine 10mg | Pokhara Medicines |
| MED-AUTH200011 | Azithromycin 500mg | Kathmandu Pharmaceuticals |
| MED-AUTH200012 | Doxycycline 100mg | Himalayan Drugs |
| MED-AUTH200013 | Ranitidine 150mg | Nepal Pharma Ltd |
| MED-AUTH200014 | Diclofenac 50mg | Pokhara Medicines |
| MED-AUTH200015 | Prednisolone 5mg | Kathmandu Pharmaceuticals |
| MED-AUTH200016 | Levothyroxine 50mcg | Himalayan Drugs |
| MED-AUTH200017 | Salbutamol 100mcg | Nepal Pharma Ltd |
| MED-AUTH200018 | Insulin Glargine 100U | Pokhara Medicines |
| MED-AUTH200019 | Warfarin 5mg | Kathmandu Pharmaceuticals |
| MED-AUTH200020 | Furosemide 40mg | Himalayan Drugs |

## 🔧 Customization

### Change QR Code Color

Edit `generate-medicine-qr-codes.js`:

```javascript
const qrOptions = {
  // ...
  color: {
    dark: '#YOUR_COLOR',  // QR code color
    light: '#FFFFFF'      // Background color
  }
};
```

### Change QR Code Size

```javascript
const qrOptions = {
  // ...
  width: 600,  // Change to desired size
};
```

### Include Full Data in QR Code

Uncomment the alternative QR data format:

```javascript
const qrData = JSON.stringify({
  productId: medicine.productId,
  name: medicine.name,
  manufacturer: medicine.manufacturer,
  expiryDate: medicine.expiryDate
});
```

## 🔄 Regenerate QR Codes

To regenerate all QR codes:

```bash
npm run clean    # Remove old QR codes
npm run generate # Generate new ones
```

## 📤 Export Options

### For Printing
- Open `generated/index.html`
- Print the page (Ctrl+P / Cmd+P)
- Select "Save as PDF" or print directly

### For Digital Distribution
- Share the `generated` folder
- Upload QR codes to cloud storage
- Embed in medicine packaging designs

## 🔐 Security Notes

- QR codes contain only the Product ID (not sensitive data)
- Full medicine details are fetched from the secure backend
- Blockchain verification happens server-side
- QR codes cannot be tampered with (read-only)

## 🐛 Troubleshooting

### Error: "Cannot find module 'qrcode'"
**Solution**: Run `npm install` in the `supabase/qr-codes` directory

### Error: "Permission denied"
**Solution**: Check folder permissions or run with appropriate privileges

### QR Codes Not Scanning
**Solution**: 
- Ensure good lighting
- Hold camera steady
- Try different QR scanner apps
- Check QR code quality (should be 400x400px minimum)

## 📚 Additional Resources

- [QRCode npm package](https://www.npmjs.com/package/qrcode)
- [QR Code Specification](https://www.qrcode.com/en/about/standards.html)
- [Sahi Aaushadi Documentation](../../README.md)

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the main project README
3. Contact the development team

---

**Generated by**: Sahi Aaushadi Team
**Last Updated**: February 12, 2026
**Version**: 1.0.0
