import React from 'react';
import Button from '../Button';
import { Gift } from 'lucide-react';

const DoneStep: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-12">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-ping w-32 h-32 rounded-full bg-blue-100"></div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-4xl">🎉</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-blue-900 mb-4">
          Your New Branded Klaviyo Flows Are Live!
        </h2>
        <p className="text-lg text-gray-600">
          We're performing additional checks to confirm they will perform phenomenally for you. 
          We'll email you with our findings.
        </p>
      </div>

      <div className="bg-blue-50 rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="text-left">
            <p className="text-lg text-gray-800 mb-6">
              Book a call with our Founder to share your experience with the Software. 
              Receive additional high-class, human-made Klaviyo materials as a gift for attending.
            </p>
            <Button className="w-full">
              <Gift className="w-5 h-5 mr-2" />
              Book A Call 🎁
            </Button>
          </div>
          <div className="bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Portfolio Preview</p>
          </div>
        </div>
      </div>

      <Button variant="secondary" className="w-48">
        Skip For Now
      </Button>
    </div>
  );
};

export default DoneStep;