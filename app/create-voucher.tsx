// Create Voucher - Redirect route
// The actual create voucher modal is built into the vouchers tab screen
// This route exists to satisfy the Stack.Screen declaration in _layout.tsx

import { Redirect } from 'expo-router';

export default function CreateVoucherRedirect() {
    return <Redirect href="/(tabs)/vouchers" />;
}
