export interface OnboardingChecklistResponse {
  verifications: { emailVerified: boolean }
  profileSetup:  { completed: boolean }
  subscription:  { activeSubscriptions: number }
}
