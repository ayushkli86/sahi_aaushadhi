-- Complete Supabase Setup for Sahi Aaushadi
-- Run this entire script in your Supabase SQL Editor

-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS verification_logs CASCADE;
DROP TABLE IF EXISTS qr_records CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manufacturer', 'pharmacy', 'consumer', 'dda')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medicines table
CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  manufacturer VARCHAR(255) NOT NULL,
  batch_number VARCHAR(100) NOT NULL,
  manufacture_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  description TEXT,
  blockchain_tx VARCHAR(255),
  registered_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QR Records table
CREATE TABLE qr_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_hash VARCHAR(255) UNIQUE NOT NULL,
  product_id VARCHAR(50) REFERENCES medicines(product_id),
  nonce VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification Logs table
CREATE TABLE verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(50) REFERENCES medicines(product_id),
  is_valid BOOLEAN NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(50),
  user_agent TEXT,
  metadata JSONB
);

-- Indexes
CREATE INDEX idx_medicines_product_id ON medicines(product_id);
CREATE INDEX idx_medicines_manufacturer ON medicines(manufacturer);
CREATE INDEX idx_qr_records_hash ON qr_records(qr_hash);
CREATE INDEX idx_qr_records_product_id ON qr_records(product_id);
CREATE INDEX idx_verification_logs_product_id ON verification_logs(product_id);
CREATE INDEX idx_users_email ON users(email);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medicines_updated_at
  BEFORE UPDATE ON medicines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert Medicine Data
INSERT INTO medicines (product_id, name, manufacturer, batch_number, manufacture_date, expiry_date, description, blockchain_tx) VALUES
('MED-AUTH200000', 'Paracetamol 500mg', 'Nepal Pharma Ltd', 'NPL-2026-PAR-001', '2026-01-01', '2026-12-31', 'Paracetamol 500mg - Nepal Pharma Ltd', '0x9dc141c1fda52623c20bd5fe908d232cdfcfd8ab8b498b8a9fbd118d9dd5dbe5'),
('MED-AUTH200001', 'Amoxicillin 250mg', 'Himalayan Drugs', 'HD-2026-AMX-002', '2026-01-01', '2027-06-30', 'Amoxicillin 250mg - Himalayan Drugs', '0xddaca74b78332c6240f02e60d4bb12a63113ce7f9c9e4e0152d0756e21c9087b'),
('MED-AUTH200002', 'Ibuprofen 400mg', 'Nepal Pharma Ltd', 'NPL-2026-IBU-003', '2026-01-01', '2026-11-15', 'Ibuprofen 400mg - Nepal Pharma Ltd', '0x92a43aa4e7742900ca56403e0de50045e1ee593b425903d212520ed807d24e7e'),
('MED-AUTH200003', 'Ciprofloxacin 500mg', 'Kathmandu Pharmaceuticals', 'KP-2026-CIP-004', '2026-01-01', '2027-03-20', 'Ciprofloxacin 500mg - Kathmandu Pharmaceuticals', '0x31bf7b4c11c10c5ff2c0290761619ace331f2a49f0675671cc147e0425d3b7bd'),
('MED-AUTH200004', 'Metformin 500mg', 'Himalayan Drugs', 'HD-2026-MET-005', '2026-01-01', '2027-08-10', 'Metformin 500mg - Himalayan Drugs', '0x4c280ebacb337ebb96f6f81be277f0b42fb5d5df84fc8f069bff3c7800c34484'),
('MED-AUTH200005', 'Omeprazole 20mg', 'Nepal Pharma Ltd', 'NPL-2026-OME-006', '2026-01-01', '2026-10-25', 'Omeprazole 20mg - Nepal Pharma Ltd', '0xba262285953278f188109358a5d0ff501586bab2b240fea54bc9c25e74f79510'),
('MED-AUTH200006', 'Aspirin 75mg', 'Pokhara Medicines', 'PM-2026-ASP-007', '2026-01-01', '2027-05-18', 'Aspirin 75mg - Pokhara Medicines', '0xe2b24e70968e1ba5d5e884b12da8480b7cf255f0ebead09ed46b67b1daa8c1b5'),
('MED-AUTH200007', 'Atorvastatin 10mg', 'Kathmandu Pharmaceuticals', 'KP-2026-ATO-008', '2026-01-01', '2027-02-14', 'Atorvastatin 10mg - Kathmandu Pharmaceuticals', '0x4e40c244acab240ac12e09b7c865fab1827ca209484a83df06ddccefc1a23122'),
('MED-AUTH200008', 'Losartan 50mg', 'Himalayan Drugs', 'HD-2026-LOS-009', '2026-01-01', '2027-07-22', 'Losartan 50mg - Himalayan Drugs', '0xfa01842259938da334e9223aa247627170835296d7e74b2da5f5a8ce1e283d83'),
('MED-AUTH200009', 'Amlodipine 5mg', 'Nepal Pharma Ltd', 'NPL-2026-AML-010', '2026-01-01', '2026-09-30', 'Amlodipine 5mg - Nepal Pharma Ltd', '0x9f52fbda42a4fc4345e1cf60f20e3e20641db43bd1182cc433e9967af6abe3f4'),
('MED-AUTH200010', 'Cetirizine 10mg', 'Pokhara Medicines', 'PM-2026-CET-011', '2026-01-01', '2027-04-12', 'Cetirizine 10mg - Pokhara Medicines', '0x4c0a6dee8bfd4f7c57f570223faa879d8d2a87840901618e1a4e9f33b6645fbd'),
('MED-AUTH200011', 'Azithromycin 500mg', 'Kathmandu Pharmaceuticals', 'KP-2026-AZI-012', '2026-01-01', '2027-01-28', 'Azithromycin 500mg - Kathmandu Pharmaceuticals', '0x5f14316102cebe50ae8c90604cf94cb06421de13d8e529142d2f4888f081c53d'),
('MED-AUTH200012', 'Doxycycline 100mg', 'Himalayan Drugs', 'HD-2026-DOX-013', '2026-01-01', '2027-06-15', 'Doxycycline 100mg - Himalayan Drugs', '0xc7d08b3c5e73a0742462e2d26f93fba19466d2630b77f0d6ac4b3abd5f5e4133'),
('MED-AUTH200013', 'Ranitidine 150mg', 'Nepal Pharma Ltd', 'NPL-2026-RAN-014', '2026-01-01', '2026-12-20', 'Ranitidine 150mg - Nepal Pharma Ltd', '0xa9187d51f242ffde2f14641381c879e967dcb4c944617fe59fe6a5624e8556d5'),
('MED-AUTH200014', 'Diclofenac 50mg', 'Pokhara Medicines', 'PM-2026-DIC-015', '2026-01-01', '2027-03-08', 'Diclofenac 50mg - Pokhara Medicines', '0xb4f44fdbe85307ceff4503172acc81d7289aed4e8d533c1b0931eb020797efee'),
('MED-AUTH200015', 'Prednisolone 5mg', 'Kathmandu Pharmaceuticals', 'KP-2026-PRE-016', '2026-01-01', '2027-08-25', 'Prednisolone 5mg - Kathmandu Pharmaceuticals', '0x17791184bad0b274f9cd228fe8faab2bbc8ec8be7942c5be52bbb7c8b5d09956'),
('MED-AUTH200016', 'Levothyroxine 50mcg', 'Himalayan Drugs', 'HD-2026-LEV-017', '2026-01-01', '2027-05-30', 'Levothyroxine 50mcg - Himalayan Drugs', '0x42b60cfebf01612986d4aa2018866b121f123178290c4729c817966919d9824d'),
('MED-AUTH200017', 'Salbutamol 100mcg', 'Nepal Pharma Ltd', 'NPL-2026-SAL-018', '2026-01-01', '2026-11-10', 'Salbutamol 100mcg - Nepal Pharma Ltd', '0xb5f92b31c99c53a6752938ce9ef91255391da440752855c78b0376870326324e'),
('MED-AUTH200018', 'Insulin Glargine 100U', 'Pokhara Medicines', 'PM-2026-INS-019', '2026-01-01', '2027-02-28', 'Insulin Glargine 100U - Pokhara Medicines', '0x8cb21589ffd26641addd06be15734186be1ebc6523e69b231950ae6f245de3a0'),
('MED-AUTH200019', 'Warfarin 5mg', 'Kathmandu Pharmaceuticals', 'KP-2026-WAR-020', '2026-01-01', '2027-07-15', 'Warfarin 5mg - Kathmandu Pharmaceuticals', '0xc9c9addd83004f473872e600ab6acc889423e591646044f27f3d57c31e7a6578'),
('MED-AUTH200020', 'Furosemide 40mg', 'Himalayan Drugs', 'HD-2026-FUR-021', '2026-01-01', '2027-04-20', 'Furosemide 40mg - Himalayan Drugs', '0xa07eec32ea9347a530ea4803bd2b54c024ba4c7706b147d099092339d617ba19');

-- Verify insertion
SELECT COUNT(*) as total_medicines FROM medicines;
SELECT product_id, name, manufacturer FROM medicines LIMIT 5;
