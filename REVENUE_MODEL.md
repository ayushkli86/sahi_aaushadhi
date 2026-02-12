# Sahi Aaushadi - Revenue Model

## Overview
Affordable medicine verification system for Nepal with flexible pricing options.

## Pricing Models

### 1. Pay-Per-Scan Model
**Target**: Individual users, small pharmacies, occasional verifiers

- **Cost**: NPR 0.10 per successful verification
- **No subscription required**
- **No minimum commitment**
- **Perfect for**: Consumers verifying personal medicine purchases

**Example Costs:**
- 10 scans = NPR 1.00
- 100 scans = NPR 10.00
- 1,000 scans = NPR 100.00

---

### 2. Subscription Model
**Target**: Pharmacies, hospitals, distributors, frequent users

#### Free Tier
- **Cost**: NPR 0
- **Scans**: 10 free scans/month
- **Features**: Basic verification, scan history
- **Perfect for**: Trial users, very small pharmacies

#### Basic Plan
- **Cost**: NPR 50/month or NPR 500/year (2 months free)
- **Scans**: 1,000 scans/month
- **Effective cost**: NPR 0.05 per scan (50% discount)
- **Features**: Priority support, analytics dashboard, batch verification
- **Perfect for**: Small to medium pharmacies

#### Professional Plan
- **Cost**: NPR 200/month or NPR 2,000/year (2 months free)
- **Scans**: 5,000 scans/month
- **Effective cost**: NPR 0.04 per scan (60% discount)
- **Features**: All Basic + API access, custom reports, multi-user accounts
- **Perfect for**: Large pharmacies, small hospital chains

#### Enterprise Plan
- **Cost**: NPR 500/month or NPR 5,000/year (2 months free)
- **Scans**: Unlimited
- **Effective cost**: ~NPR 0.01 per scan (90% discount for high volume)
- **Features**: All Professional + dedicated support, white-label options, SLA
- **Perfect for**: Hospital networks, pharmaceutical distributors, government agencies

---

## Comparison Table

| Feature | Pay-Per-Scan | Free | Basic | Professional | Enterprise |
|---------|--------------|------|-------|--------------|------------|
| **Monthly Cost** | Variable | NPR 0 | NPR 50 | NPR 200 | NPR 500 |
| **Yearly Cost** | Variable | NPR 0 | NPR 500 | NPR 2,000 | NPR 5,000 |
| **Scans/Month** | Unlimited | 10 | 1,000 | 5,000 | Unlimited |
| **Cost per Scan** | NPR 0.10 | Free | NPR 0.05 | NPR 0.04 | ~NPR 0.01 |
| **Analytics** | Basic | Basic | Advanced | Advanced | Custom |
| **API Access** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Multi-User** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Priority Support** | ❌ | ❌ | ✅ | ✅ | Dedicated |
| **Custom Reports** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **White Label** | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Payment Integration

### Supported Payment Methods
1. **eSewa** - Most popular digital wallet in Nepal
2. **Khalti** - Second most popular digital wallet
3. **IME Pay** - Banking integration
4. **Connect IPS** - Direct bank transfer
5. **Bank Transfer** - Manual verification for enterprise

### Payment Flow
1. User selects plan or adds credits
2. Redirects to payment gateway
3. Payment confirmation
4. Credits/subscription activated instantly
5. Email/SMS confirmation sent

---

## Revenue Projections

### Conservative Estimates (Year 1)
- **Individual Users**: 10,000 users × 50 scans/year × NPR 0.10 = NPR 50,000
- **Free Tier**: 5,000 users × 0 = NPR 0 (conversion funnel)
- **Basic Subscribers**: 500 × NPR 500/year = NPR 250,000
- **Professional Subscribers**: 100 × NPR 2,000/year = NPR 200,000
- **Enterprise Subscribers**: 20 × NPR 5,000/year = NPR 100,000

**Total Year 1 Revenue**: NPR 600,000 (~USD 4,500)

### Growth Projections (Year 3)
- **Individual Users**: 50,000 users × 100 scans/year × NPR 0.10 = NPR 500,000
- **Basic Subscribers**: 2,000 × NPR 500/year = NPR 1,000,000
- **Professional Subscribers**: 500 × NPR 2,000/year = NPR 1,000,000
- **Enterprise Subscribers**: 100 × NPR 5,000/year = NPR 500,000

**Total Year 3 Revenue**: NPR 3,000,000 (~USD 22,500)

---

## Implementation Strategy

### Phase 1: Launch (Month 1-3)
- Free tier for all users
- Pay-per-scan option available
- Focus on user acquisition and feedback

### Phase 2: Monetization (Month 4-6)
- Introduce Basic and Professional plans
- Offer 50% discount for early adopters
- Implement payment gateway integration

### Phase 3: Scale (Month 7-12)
- Launch Enterprise plan
- Add advanced features (API, white-label)
- Partner with pharmaceutical associations

### Phase 4: Expansion (Year 2+)
- Government partnerships (bulk licensing)
- International expansion (India, Bangladesh)
- B2B pharmaceutical company partnerships

---

## Cost Structure

### Operating Costs (Monthly)
- **Server & Infrastructure**: NPR 5,000
- **Blockchain Gas Fees**: NPR 2,000
- **Payment Gateway Fees**: 2-3% of revenue
- **Customer Support**: NPR 10,000
- **Marketing**: NPR 15,000
- **Development**: NPR 20,000

**Total Monthly Costs**: ~NPR 52,000

**Break-even**: ~100 Basic subscribers or 520 pay-per-scan users

---

## Why This Model Works for Nepal

1. **Affordability**: NPR 0.10 per scan is less than 1 cent USD
2. **Flexibility**: Users choose what works for them
3. **Scalability**: Subscription model provides predictable revenue
4. **Accessibility**: Free tier removes barriers to entry
5. **Value**: Prevents counterfeit medicine worth thousands of NPR

---

## Next Steps

1. ✅ Design pricing structure
2. ⏳ Implement database schema for billing
3. ⏳ Integrate payment gateways (eSewa, Khalti)
4. ⏳ Build subscription management UI
5. ⏳ Create billing dashboard
6. ⏳ Set up automated invoicing
7. ⏳ Implement usage tracking and limits
