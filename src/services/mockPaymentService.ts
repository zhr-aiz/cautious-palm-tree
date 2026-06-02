/** Mock payment service — simulates payment processing with 1.5s delay */

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

/** Process a mock payment (always succeeds) */
export async function processPayment(
  amount: number,
  description: string
): Promise<PaymentResult> {
  // Simulate payment gateway latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    message: `支付成功：${description}，金额 ¥${amount.toFixed(2)}`,
  };
}

/** Verify payment status (mock) */
export async function verifyPayment(transactionId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return transactionId.startsWith('txn_');
}
