export interface IAuthThrottleMethods {
  assertNotLocked(): void;
  recordFailure(maxAttempts: number, lockMinutes: number): void;
  recordSuccess(): void;
}