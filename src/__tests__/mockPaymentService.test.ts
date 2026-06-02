import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { processPayment, verifyPayment } from '../services/mockPaymentService';

describe('mockPaymentService', () => {
  describe('processPayment', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('应返回成功结果', async () => {
      const promise = processPayment(29.9, '专业版月付');
      await vi.advanceTimersByTimeAsync(1500);
      const result = await promise;
      expect(result.success).toBe(true);
    });

    it('应返回包含 txn_ 前缀的交易ID', async () => {
      const promise = processPayment(29.9, '专业版月付');
      await vi.advanceTimersByTimeAsync(1500);
      const result = await promise;
      expect(result.transactionId).toMatch(/^txn_/);
    });

    it('返回消息应包含金额', async () => {
      const promise = processPayment(29.9, '专业版月付');
      await vi.advanceTimersByTimeAsync(1500);
      const result = await promise;
      expect(result.message).toContain('29.90');
      expect(result.message).toContain('¥');
    });

    it('返回消息应包含描述', async () => {
      const promise = processPayment(29.9, '专业版月付');
      await vi.advanceTimersByTimeAsync(1500);
      const result = await promise;
      expect(result.message).toContain('专业版月付');
    });

    it('不同调用应返回不同交易ID', async () => {
      const promise1 = processPayment(29.9, 'Test1');
      await vi.advanceTimersByTimeAsync(1500);
      const result1 = await promise1;

      const promise2 = processPayment(29.9, 'Test2');
      await vi.advanceTimersByTimeAsync(1500);
      const result2 = await promise2;

      expect(result1.transactionId).not.toBe(result2.transactionId);
    });
  });

  describe('verifyPayment', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('txn_ 前缀的交易ID应验证通过', async () => {
      const promise = verifyPayment('txn_123456_abc');
      await vi.advanceTimersByTimeAsync(300);
      const result = await promise;
      expect(result).toBe(true);
    });

    it('非 txn_ 前缀的交易ID应验证失败', async () => {
      const promise = verifyPayment('invalid_id');
      await vi.advanceTimersByTimeAsync(300);
      const result = await promise;
      expect(result).toBe(false);
    });

    it('空字符串应验证失败', async () => {
      const promise = verifyPayment('');
      await vi.advanceTimersByTimeAsync(300);
      const result = await promise;
      expect(result).toBe(false);
    });
  });
});
