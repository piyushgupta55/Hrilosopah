'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { OnboardingLayout } from './OnboardingLayout';
import { useLocale } from 'next-intl';

// Steps
import { StepWelcome } from './steps/StepWelcome';
import { StepLanguage } from './steps/StepLanguage';
import { StepLearn } from './steps/StepLearn';
import { StepInterests } from './steps/StepInterests';
import { StepGoal } from './steps/StepGoal';
import { StepExperience } from './steps/StepExperience';
import { StepTime } from './steps/StepTime';
import { StepLoadingPlan } from './steps/StepLoadingPlan';
import { StepReady } from './steps/StepReady';

export type OnboardingState = {
  interests: string[];
  goal: string;
  experience: string;
  dailyTime: string;
};

export const OnboardingFlow = ({ initialStep = 0 }: { initialStep?: number }) => {
  const router = useRouter();
  const locale = useLocale();
  const [step, setStep] = useState(initialStep);
  const [direction, setDirection] = useState(1);
  const [state, setState] = useState<OnboardingState>({
    interests: [],
    goal: '',
    experience: '',
    dailyTime: '',
  });

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(0, prev - 1));
  };

  const finishOnboarding = () => {
    // Save state to localStorage to be read by the /signup page
    localStorage.setItem('hrilosopah_onboarding', JSON.stringify(state));
    router.push(`/${locale}/signup`);
  };

  // We have 9 steps (0 to 8)
  const totalSteps = 9;

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepWelcome key="step-0" onNext={nextStep} onSkip={finishOnboarding} />;
      case 1:
        return (
          <StepLanguage
            key="step-1"
            onNext={(chosenLocale: string) => {
              // Switch locale and go to next step
              router.push(`/${chosenLocale}/onboarding?step=2`);
            }}
          />
        );
      case 2:
        return (
          <StepLearn
            key="step-2"
            selectedInterests={state.interests}
            onChange={(interests: string[]) => setState({ ...state, interests })}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <StepInterests
            key="step-3"
            interests={state.interests}
            onChange={(interests: string[]) => setState({ ...state, interests })}
            onNext={nextStep}
          />
        );
      case 4:
        return (
          <StepGoal
            key="step-4"
            goal={state.goal}
            onChange={(goal: string) => setState({ ...state, goal })}
            onNext={nextStep}
          />
        );
      case 5:
        return (
          <StepExperience
            key="step-5"
            experience={state.experience}
            onChange={(experience: string) => setState({ ...state, experience })}
            onNext={nextStep}
          />
        );
      case 6:
        return (
          <StepTime
            key="step-6"
            time={state.dailyTime}
            onChange={(dailyTime: string) => setState({ ...state, dailyTime })}
            onNext={nextStep}
          />
        );
      case 7:
        return <StepLoadingPlan key="step-7" onComplete={nextStep} />;
      case 8:
        return <StepReady key="step-8" onNext={finishOnboarding} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout currentStep={step}>
      <AnimatePresence mode="wait" custom={direction}>
        {renderStep()}
      </AnimatePresence>
    </OnboardingLayout>
  );
};
