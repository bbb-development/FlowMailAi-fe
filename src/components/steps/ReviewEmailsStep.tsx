import React from 'react';
import Button from '../Button';

interface ReviewEmailsStepProps {
  onNext: () => void;
  onBack: () => void;
  selectedFlows: string[];
}

interface EmailFlow {
  id: string;
  title: string;
  emails: number;
}

const EmailPreview = ({ number }: { number: number }) => (
  <div className="flex-none w-[240px] h-[720px] bg-white rounded-lg border border-gray-200 mr-4 shadow-sm">
    <div className="h-full flex flex-col p-6">
      <p className="text-gray-600 text-sm mb-4">Email #{number}</p>
      <div className="flex-1 bg-gray-50 rounded"></div>
    </div>
  </div>
);

const FlowSection = ({ flow }: { flow: EmailFlow }) => (
  <div className="flex-none">
    <h3 className="text-lg font-medium text-gray-800 mb-4">{flow.title}</h3>
    <div className="flex">
      {Array.from({ length: flow.emails }, (_, i) => (
        <EmailPreview key={i} number={i + 1} />
      ))}
    </div>
  </div>
);

const ReviewEmailsStep: React.FC<ReviewEmailsStepProps> = ({ onNext, onBack, selectedFlows }) => {
  // Map flow IDs to their display data
  const flowsData: Record<string, { title: string; emails: number }> = {
    welcome: { title: 'Welcome Flow + Pop-up', emails: 3 },
    abandoned_cart: { title: 'Abandoned Cart Flow', emails: 4 },
    browse_abandonment: { title: 'Browse Abandonment Flow', emails: 1 }
  };

  // Create flows array based on selected flows
  const flows: EmailFlow[] = selectedFlows.map(flowId => ({
    id: flowId,
    title: flowsData[flowId].title,
    emails: flowsData[flowId].emails
  }));

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Your Branded Emails Are Ready!
        </h2>
        <p className="text-gray-600">
          Here's a preview of your high-converting email flows. Click approve to continue.
        </p>
      </div>

      <div className="flex-1 mb-8 min-h-0">
        <div className="h-full overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex space-x-8 min-w-min h-full">
            {flows.map((flow) => (
              <FlowSection key={flow.id} flow={flow} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button variant="secondary" onClick={onBack}>
          Go Back
        </Button>
        <Button onClick={onNext}>
          Approve & Continue
        </Button>
      </div>
    </div>
  );
};

export default ReviewEmailsStep;