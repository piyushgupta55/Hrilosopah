import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export default function OnboardingPage({ searchParams }: { searchParams: { step?: string } }) {
  const initialStep = searchParams?.step ? parseInt(searchParams.step, 10) : 0;

  return (
    <main className="flex-1 w-full bg-white relative overflow-hidden flex flex-col min-h-[100dvh]">
      <OnboardingFlow initialStep={initialStep} />
    </main>
  );
}
