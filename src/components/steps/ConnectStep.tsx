import React, { useState } from 'react';
import Button from '../Button';
import { Link, CheckCircle } from 'lucide-react';

interface ConnectStepProps {
  onNext: () => void;
  onBack: () => void;
}

const ConnectStep: React.FC<ConnectStepProps> = ({ onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    // Simulate API connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setIsConnected(true);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Link className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Connect Klaviyo to Activate Your Flows
        </h2>
        <p className="text-gray-600">
          We're ready to set these flows up in your Klaviyo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-medium text-gray-800 mb-4">Follow these steps:</h3>
          <ol className="space-y-3 text-gray-600 list-decimal pl-4">
            <li>
              <a 
                href="https://www.klaviyo.com/settings/account/users" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Log into Klaviyo
              </a>
            </li>
            <li>Click Profile (bottom left)</li>
            <li>Click 'Settings'</li>
            <li>Click 'Users'</li>
            <li>Click 'Add new user'</li>
            <li>Enter AI.assistant@flowai.com</li>
            <li>Select Admin Role</li>
            <li>Click 'Add User'</li>
            <li>Click 'Confirm Connection' below</li>
          </ol>

          <div className="flex justify-between mt-8">
            <Button type="button" variant="secondary" onClick={onBack}>
              Go Back
            </Button>
            {isConnected ? (
              <Button onClick={onNext} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                Continue
              </Button>
            ) : (
              <Button onClick={handleConnect} loading={loading}>
                {loading ? 'Verifying Access...' : 'Confirm Connection'}
              </Button>
            )}
          </div>
        </div>

        <div className="aspect-video bg-gray-200 flex items-center justify-center rounded-lg">
          <p className="text-gray-600">Tutorial: How To Add Us To Klaviyo + What To Expect</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectStep;