# Credit Management System - Setup Guide

## Overview
A complete credit management system with PayPal integration, bank transfer support, and admin dashboard for the CvSira platform.

## Features Implemented

### 1. Pricing & Packages
- **6 Fixed Credit Packages:**
  - 15 Credits - 10 SAR ($2.67)
  - 80 Credits - 50 SAR ($13.33)
  - 175 Credits - 100 SAR ($26.67)
  - 450 Credits - 250 SAR ($66.67)
  - 1,000 Credits - 500 SAR ($133.33) - Best Value
  - 2,450 Credits - 1,000 SAR ($266.67)

- **Dynamic Slider:**
  - Range: 5 to 5,000 credits
  - Automatic pricing calculation based on tiered rates
  - Real-time SAR/USD conversion (1 USD = 3.75 SAR)

### 2. Payment Methods

#### PayPal Integration
- Direct payment processing
- Server-side verification via Edge Function
- Instant credit delivery
- Secure transaction handling

#### Bank Transfer
- Multiple Saudi bank accounts displayed
- Receipt upload (PNG, JPG, PDF - max 5MB)
- Admin approval workflow
- Automatic credit addition upon approval

### 3. Admin Dashboard

#### Main Dashboard (`/admin`)
- Overview statistics
- Total users, active users
- Credits distributed
- Revenue tracking (SAR/USD)
- Pending transactions count

#### User Management (`/admin/users`)
- View all users
- Search by name, email, or phone
- Filter by status (Active/Inactive/All)
- Activate/deactivate user accounts
- View user details and credit balance

#### Pending Transactions (`/admin/transactions`)
- Review bank transfer requests
- View uploaded receipts
- Approve transactions (auto-adds credits)
- Reject with reason (sends notification)
- Transaction history

#### Manual Credit Control (`/admin/credits`)
- Search users
- Add or subtract credits manually
- Required reason for audit trail
- Real-time balance updates

### 4. Security Features

#### Role-Based Access Control (RBAC)
- Admin role assigned to: `mohamts01@gmail.com`
- Strict route protection
- 403 Forbidden for unauthorized access
- Server-side verification

#### Payment Security
- PayPal server-side verification
- Amount validation
- Duplicate transaction prevention
- Audit logging

## Setup Instructions

### 1. Environment Variables

Add to `.env` file:

```env
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_SECRET_KEY=your_paypal_secret_key_here
PAYPAL_MODE=sandbox
```

**For Production:**
- Change `PAYPAL_MODE=live`
- Use live PayPal credentials

### 2. PayPal Setup

1. Create PayPal Developer Account: https://developer.paypal.com
2. Create a REST API app
3. Get Client ID and Secret Key
4. For testing: Use sandbox credentials
5. For production: Use live credentials

**Sandbox Testing:**
- Use sandbox accounts from PayPal developer dashboard
- Test transactions don't charge real money

**Going Live:**
1. Get live API credentials from PayPal dashboard
2. Update `VITE_PAYPAL_CLIENT_ID` with live client ID
3. Update `PAYPAL_SECRET_KEY` with live secret key
4. Change `PAYPAL_MODE=live` in `.env`

### 3. Database Setup

All database migrations are already applied:
- Extended `profiles` table (phone, is_active, role)
- Extended `credits_transactions` table
- Created `credit_packages` table
- Set up RLS policies
- Created storage bucket for receipts
- Auto-assigned admin role to mohamts01@gmail.com

### 4. Edge Function Setup

The PayPal verification Edge Function is deployed at:
`/functions/v1/verify-paypal-payment`

**Environment variables are automatically configured for the Edge Function.**

## Usage Guide

### For Users

#### Purchasing Credits

1. **Via Pricing Page:**
   - Navigate to `/pricing`
   - Choose a package or use the dynamic slider
   - Click "Buy Now" or "Purchase"

2. **At Checkout:**
   - Select payment method:
     - **PayPal:** Instant delivery
     - **Bank Transfer:** 24-48 hour review

3. **PayPal Flow:**
   - Click PayPal button
   - Complete payment on PayPal
   - Credits added automatically
   - Success confirmation displayed

4. **Bank Transfer Flow:**
   - View bank account details
   - Make transfer to any listed bank
   - Upload receipt (PNG/JPG/PDF)
   - Enter reference number
   - Submit for review
   - Await admin approval (24-48 hours)

### For Admins

#### Accessing Admin Dashboard

1. Login with admin email: `mohamts01@gmail.com`
2. Navigate to `/admin`
3. Access granted automatically

#### Managing Pending Transactions

1. Go to `/admin/transactions`
2. Review pending bank transfers
3. Click receipt to view full size
4. **Approve:** Credits added automatically
5. **Reject:** Provide reason (user gets notification)

#### Managing Users

1. Go to `/admin/users`
2. Search or filter users
3. View user details
4. Activate/deactivate accounts
5. Monitor credit balances

#### Manual Credit Adjustments

1. Go to `/admin/credits`
2. Search for user
3. Select Add or Subtract
4. Enter amount
5. Provide reason (required)
6. Confirm adjustment

## Routes

### Public Routes
- `/` - Home page
- `/pricing` - Pricing page with packages

### User Routes (Authenticated)
- `/checkout` - Checkout page
- `/builder` - Resume builder
- `/social-home` - Social media home
- `/certificates-dashboard` - Certificates

### Admin Routes (Admin Only)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/transactions` - Pending transactions
- `/admin/credits` - Manual credit control

## Technical Details

### Database Schema

#### profiles table (extended)
- `phone` - User phone number
- `is_active` - Account status
- `role` - User role (admin/user)

#### credits_transactions table (extended)
- `amount_sar` - Transaction amount in SAR
- `amount_usd` - Transaction amount in USD
- `credits_purchased` - Credits bought
- `payment_method` - paypal or bank_transfer
- `status` - pending, success, failed, rejected
- `paypal_order_id` - PayPal transaction ID
- `receipt_url` - Bank transfer receipt
- `rejection_reason` - Admin rejection reason
- `admin_user_id` - Admin who processed
- `processed_at` - Processing timestamp

#### credit_packages table (new)
- `credits` - Number of credits
- `price_sar` - Price in SAR
- `price_usd` - Price in USD
- `is_featured` - Best value flag
- `discount_percentage` - Discount amount
- `display_order` - Sorting order
- `is_active` - Package status

### Credit Pricing Logic

- **Base Rate:** 1 SAR = 1 credit (for < 15 credits)
- **Tiered Pricing:** Discounts increase with volume
- **Interpolation:** Smooth pricing between tiers
- **Currency Conversion:** 1 USD = 3.75 SAR

### Storage

#### receipts bucket
- Public bucket for receipt storage
- User can upload own receipts
- Admins can view all receipts
- Automatic cleanup policies

## Security Considerations

### Admin Access
- Only mohamts01@gmail.com has admin role
- Automatic role assignment on user creation
- Protected routes with AdminRoute component
- 403 Forbidden for unauthorized access

### Payment Verification
- Server-side PayPal verification
- Amount matching validation
- Duplicate transaction prevention
- Audit trail for all transactions

### Data Protection
- RLS policies on all tables
- Users can only see own data
- Admins have full access
- Secure file uploads

## Troubleshooting

### PayPal Issues

**"PayPal client ID not configured"**
- Add `VITE_PAYPAL_CLIENT_ID` to `.env`
- Restart development server

**Payment succeeds but credits not added**
- Check Edge Function logs
- Verify PayPal credentials
- Check transaction status in database

### Bank Transfer Issues

**Receipt upload fails**
- Check file size (max 5MB)
- Verify file type (PNG, JPG, PDF only)
- Check Supabase storage bucket permissions

**Transaction stuck in pending**
- Admin needs to approve/reject
- Check `/admin/transactions` page

### Admin Access Issues

**403 Forbidden on admin routes**
- Verify user email is mohamts01@gmail.com
- Check `profiles` table `role` column
- Ensure user is authenticated

## Support & Maintenance

### Monitoring
- Track failed transactions
- Monitor PayPal webhook events
- Review pending approvals regularly
- Check storage usage

### Regular Tasks
- Review and approve bank transfers daily
- Monitor credit balance anomalies
- Update package pricing as needed
- Review transaction logs

### Database Maintenance
- Backup transaction data regularly
- Archive old transactions
- Clean up rejected receipts
- Monitor storage growth

## Future Enhancements

Potential improvements:
- Email notifications for transactions
- SMS notifications for approvals
- Webhook support for PayPal
- Automated receipt verification
- Credit usage analytics
- Subscription packages
- Referral bonuses
- Bulk operations for admins
- Export reports (CSV/Excel)
- Transaction dispute handling

## Contact

For technical support or questions:
- Email: support@cvsira.com
- Admin Dashboard: https://cvsira.com/admin
