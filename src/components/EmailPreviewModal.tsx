import React from 'react';
import { X } from 'lucide-react';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  flowId: string;
  flowName: string;
}

const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ isOpen, onClose, flowId, flowName }) => {
  if (!isOpen) return null;

  // Mock email data - in a real app, this would be dynamic based on the flow
  const mockEmails = [
    {
      id: 1,
      subject: `${flowName} - Email 1`,
      preview: 'Welcome to our community!',
      sendTime: '0 hours',
    },
    {
      id: 2,
      subject: `${flowName} - Email 2`,
      preview: `Here's what you need to know...`,
      sendTime: '24 hours',
    },
    {
      id: 3,
      subject: `${flowName} - Email 3`,
      preview: 'Final thoughts and next steps',
      sendTime: '72 hours',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{flowName} Emails</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-6">
            {mockEmails.map((email) => (
              <div
                key={email.id}
                className="border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{email.subject}</h4>
                  <span className="text-sm text-gray-500">Send after: {email.sendTime}</span>
                </div>
                <p className="text-gray-600 text-sm">{email.preview}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreviewModal;