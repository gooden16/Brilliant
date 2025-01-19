import { authenticator } from '@otplib/preset-default';
import { logger } from './logger';

/**
 * Generates a new TOTP secret for 2FA setup
 * @returns TOTP secret string
 */
export function generateTOTPSecret(): string {
  return authenticator.generateSecret();
}

/**
 * Generates the TOTP URI for QR code generation
 * @param email User's email
 * @param secret TOTP secret
 * @returns URI string for QR code
 */
export function generateTOTPUri(email: string, secret: string): string {
  return authenticator.keyuri(email, 'Financial Advisor Platform', secret);
}

/**
 * Verifies a TOTP token
 * @param token User provided token
 * @param secret TOTP secret
 * @returns boolean indicating if token is valid
 */
export function verifyTOTP(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    logger.error('TOTP verification failed', { error });
    return false;
  }
}