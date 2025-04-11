import React, { useState } from 'react';
import { Globe, Mail, Link, Loader2, ShieldCheck, Palette, Layout } from 'lucide-react';
import StepIndicator from './components/StepIndicator';
import WebsiteStep from './components/steps/WebsiteStep';
import BrandBriefStep from './components/steps/BrandBriefStep';
import ChooseFlowsStep from './components/steps/ChooseFlowsStep';
import ReviewEmailsStep from './components/steps/ReviewEmailsStep';
import ConnectStep from './components/steps/ConnectStep';
import BuildingStep from './components/steps/BuildingStep';
import ActivationStep from './components/steps/ActivationStep';
import DoneStep from './components/steps/DoneStep';

const steps = [
  { title: 'Enter Website', icon: Globe },
  { title: 'Brand Brief', icon: Palette },
  { title: 'Choose Flows', icon: Mail },
  { title: 'Review Emails', icon: Mail },
  { title: 'Connect Klaviyo', icon: Link },
  { title: 'Building Flows', icon: Loader2 },
  { title: 'Activation', icon: ShieldCheck },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(null);
  const [brandBrief, setBrandBrief] = useState<any>(null);
  const [selectedFlows, setSelectedFlows] = useState<string[]>([]);

  const handleNext = (data?: any) => {
    if (currentStep === 0 && data?.url) {
      setWebsiteUrl(data.url);
    }
    if (currentStep === 1 && data) {
      setBrandBrief(data);
    }
    if (currentStep === 2 && data?.selectedFlows) {
      setSelectedFlows(data.selectedFlows);
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WebsiteStep onNext={handleNext} />;
      case 1:
        return <BrandBriefStep onNext={handleNext} onBack={handleBack} initialData={{ url: websiteUrl }} />;
      case 2:
        return <ChooseFlowsStep onNext={handleNext} onBack={handleBack} initialData={{ selectedFlows }} />;
      case 3:
        return <ReviewEmailsStep onNext={handleNext} onBack={handleBack} selectedFlows={selectedFlows} />;
      case 4:
        return <ConnectStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <BuildingStep onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <ActivationStep onNext={handleNext} onBack={handleBack} />;
      case 7:
        return <DoneStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">
            Effortlessly Build & Launch Results-Driven Klaviyo Flows in Under 5 Minutes, Free of Charge
          </h1>
        </div>

        {currentStep < steps.length && <StepIndicator steps={steps} currentStep={currentStep} />}

        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 min-h-[400px]">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default App;