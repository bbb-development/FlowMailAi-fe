import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, 
  Users, ShoppingCart, Eye
} from 'lucide-react';

interface ChooseFlowsStepProps {
  onNext: (data: { selectedFlows: string[] }) => void;
  onBack: () => void;
  initialData?: { selectedFlows?: string[] };
}

const availableFlows = [
  {
    id: 'welcome',
    name: 'Welcome Flow + Pop-up',
    icon: Users,
    description: 'Engage new subscribers with a warm welcome and special offer.'
  },
  {
    id: 'abandoned_cart',
    name: 'Abandoned Cart Flow',
    icon: ShoppingCart,
    description: 'Recover lost sales with timely reminders and incentives.'
  },
  {
    id: 'browse_abandonment',
    name: 'Browse Abandonment Flow',
    icon: Eye,
    description: "Re-engage visitors who viewed products but didn't purchase."
  }
];

const ChooseFlowsStep: React.FC<ChooseFlowsStepProps> = ({ onNext, onBack, initialData }) => {
  // Initialize with all flows selected and don't override with initialData
  const [selectedFlows, setSelectedFlows] = useState<string[]>(availableFlows.map(flow => flow.id));

  // Remove the useEffect that was overriding our default selection
  // We want them all selected by default, so we don't need to sync with initialData

  const toggleFlow = (flowId: string) => {
    setSelectedFlows((prev) =>
      prev.includes(flowId) ? prev.filter((id) => id !== flowId) : [...prev, flowId]
    );
  };

  const selectAllFlows = () => {
    setSelectedFlows(availableFlows.map(flow => flow.id));
  };

  const handleNext = () => {
    if (selectedFlows.length > 0) {
      onNext({ selectedFlows });
    }
  };

  const isNextDisabled = selectedFlows.length === 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Choose Your Flows</h2>
        <p className="text-gray-600 mt-2">Select the email flows you want to start with.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {availableFlows.map((flow) => {
          const isSelected = selectedFlows.includes(flow.id);
          const Icon = flow.icon;
          
          return (
            <div
              key={flow.id}
              onClick={() => toggleFlow(flow.id)}
              className={`
                relative rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1">
                  <Check size={14} />
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{flow.name}</h3>
                  </div>
                </div>

                <p className="text-sm text-gray-600">{flow.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-600 text-sm">
          This is a Beta Version, so you can get all 3 for FREE. We'll add many more flows as we upgrade the software.
        </p>
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </button>

        <button
          onClick={selectAllFlows}
          className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
        >
          <Check size={18} className="mr-2" />
          Choose All 3
        </button>

        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`
            flex items-center px-6 py-2 rounded-lg transition-colors
            ${isNextDisabled 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          Next
          <ArrowRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ChooseFlowsStep;