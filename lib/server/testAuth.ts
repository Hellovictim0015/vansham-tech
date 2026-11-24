// Hard-coded test credentials for development/testing.
// Active only when NODE_ENV !== "production" (or ENABLE_TEST_OTP=true is set).
export const TEST_IDENTIFIER = "9999999999";
export const TEST_OTP = "123456";

export const testOtpEnabled = () =>
  process.env.NODE_ENV !== "production" || process.env.ENABLE_TEST_OTP === "true";

export const isTestIdentifier = (id: unknown) => testOtpEnabled() && id === TEST_IDENTIFIER;
