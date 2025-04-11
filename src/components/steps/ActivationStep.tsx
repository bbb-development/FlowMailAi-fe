import React, { useState } from 'react';
import Button from '../Button';
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ActivationStepProps {
  onNext: () => void;
  onBack: () => void;
}

interface CheckItem {
  label: string;
  status: boolean;
}

interface DocSection {
  title: string;
  issue: string;
  steps: string[];
  note?: string;
  tips?: string[];
}

const ActivationStep: React.FC<ActivationStepProps> = ({ onNext, onBack }) => {
  const [allChecksComplete, setAllChecksComplete] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const [checkItems, setCheckItems] = useState<CheckItem[]>([
    { label: 'Sender Email', status: false },
    { label: 'Organization Name', status: false },
    { label: 'Shopify x Klaviyo Integration', status: false },
    { label: 'Conflicting Pop-up', status: false },
    { label: 'Conflicting Flows', status: false },
    { label: 'Klaviyo Billing', status: false },
    { label: 'No Dedicated Sending Domain', status: false },
  ]);

  const docSections: DocSection[] = [
    {
      title: 'Sender Email',
      issue: 'Your default sender email is not related to the company domain. You must use a business email to avoid landing in Spam.',
      steps: [
        'Go to Klaviyo > Account > Settings > Organization',
        'Update the "Default sender email address" field with the appropriate company sender email (e.g. support@yourstore.com)',
        'Click "Apply sender email to all messages"'
      ]
    },
    {
      title: 'Organization Name',
      issue: 'Your default organization name doesn’t seem to match your company name.',
      steps: [
        'Go to Klaviyo > Account > Settings > Organization',
        'Update the "Company/organization name" to your Brand Name for better recognition',
        'Save changes'
      ],
      note: 'This shows as the sender name in your emails. It\'s completely up to you what it is. Disregard this problem if you are happy with how it is now.'
    },
    {
      title: 'Shopify x Klaviyo Integration',
      issue: 'If the connection is broken or not installed, data won\'t sync and flows won\'t trigger.',
      steps: [
        'In Klaviyo, go to Integrations (scroll down in the left menu) > Shopify > Setup',
        'Finalize the Integration'
      ],
      tips: [
        'Enable everything you can for maximum performance. Change the default receiving email',
        'Enable "Sync your Shopify email subscribers to Klaviyo" and select the "Brand New Subscribers" list'
      ]
    },
    {
      title: 'Conflicting Pop-up',
      issue: 'There may be a conflicting pop-up. Please check and make sure they don\'t overlap.',
      steps: [
        'Go to Klaviyo > Signup Forms',
        'Check if you have other pop-ups running that may overlap with your new ones',
        'Disable them'
      ]
    },
    {
      title: 'Conflicting Flows',
      issue: 'You have a flow or flows that may conflict with your new ones.',
      steps: [
        'Go to Klaviyo > Flows',
        'Look for any existing flows using the following triggers: Checkout Started OR Viewed Product',
        'Pause or archive them before activating your new ones'
      ]
    },
    {
      title: 'Klaviyo Billing',
      issue: 'You\'re on a Free Klaviyo account. Please enable the minimum account available ($20/month).',
      steps: [
        'Go to Klaviyo > Account > Billing',
        'Select a paid plan based on your list size',
        'Complete checkout'
      ]
    },
    {
      title: 'No Dedicated Sending Domain',
      issue: 'Without this, your emails will inevitably start landing in Spam, plus you will get flagged by Gmail & Yahoo\'s compliance checks.',
      steps: [
        'Go to Klaviyo > Settings > Domains',
        'Follow the setup to connect a dedicated sending domain',
        'You\'ll need access to your domain host (e.g. GoDaddy, Shopify)',
        'Add the provided DNS records',
        'Verify your domain once DNS updates are done'
      ]
    }
  ];

  const handleRecheckProblems = () => {
    setCheckItems(items => items.map(item => ({ ...item, status: true })));
    setAllChecksComplete(true);
  };

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Final Setup Checklist
        </h2>
        <p className="text-gray-600">
          Let's ensure everything is properly configured before going live.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <ul className="space-y-4">
          {checkItems.map((item, index) => (
            <li
              key={index}
              className="flex items-center text-left text-gray-700"
            >
              {item.status ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
              )}
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between mb-8">
        <Button
          onClick={handleRecheckProblems}
          className="flex-1 mr-4"
        >
          Recheck Problems
        </Button>
        <Button
          variant="secondary"
          onClick={onNext}
          className="flex-1 mr-4"
        >
          {allChecksComplete ? 'Set Flows Live' : 'Set Flows Live Anyway'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {}}
          className="flex-1"
        >
          Get Human Help
        </Button>
      </div>

      <div className="space-y-4">
        {docSections.map((section) => (
          <div
            key={section.title}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection(section.title)}
            >
              <span className="font-medium text-gray-800">{section.title}</span>
              {expandedSection === section.title ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSection === section.title && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="mb-4">
                  <h4 className="font-medium text-red-600 mb-2">Issue:</h4>
                  <p className="text-gray-700">{section.issue}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium text-blue-600 mb-2">Fix:</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {section.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
                {section.tips && (
                  <div className="mb-4">
                    <h4 className="font-medium text-green-600 mb-2">Tips:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {section.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {section.note && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">📝 {section.note}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivationStep;