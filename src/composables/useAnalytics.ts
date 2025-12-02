import { posthog } from '@/plugins/posthog'

export function useAnalytics() {
  /**
   * Track a custom event
   */
  function track(event: string, properties?: Record<string, unknown>) {
    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Identify a user (call on login)
   */
  function identify(
    userId: string,
    traits?: {
      email?: string
      name?: string
      plan?: string
      [key: string]: unknown
    }
  ) {
    posthog.identify(userId, traits)
  }

  /**
   * Reset user identity (call on logout)
   */
  function reset() {
    posthog.reset()
  }

  /**
   * Check if a feature flag is enabled
   */
  function isFeatureEnabled(flagKey: string): boolean {
    return posthog.isFeatureEnabled(flagKey) ?? false
  }

  /**
   * Get feature flag value (for multivariate flags)
   */
  function getFeatureFlag(flagKey: string): string | boolean | undefined {
    return posthog.getFeatureFlag(flagKey)
  }

  /**
   * Opt user out of tracking
   */
  function optOut() {
    posthog.opt_out_capturing()
  }

  /**
   * Opt user in to tracking
   */
  function optIn() {
    posthog.opt_in_capturing()
  }

  /**
   * Check if user has opted out
   */
  function hasOptedOut(): boolean {
    return posthog.has_opted_out_capturing()
  }

  return {
    track,
    identify,
    reset,
    isFeatureEnabled,
    getFeatureFlag,
    optOut,
    optIn,
    hasOptedOut,
  }
}
