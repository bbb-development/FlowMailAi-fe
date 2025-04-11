import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { supabase } from "../../lib/supabaseClient";
import { userSession } from "../../lib/constants";


interface WebsiteStepProps {
  onNext: (brandBrief?: any) => void;
}

const WebsiteStep: React.FC<WebsiteStepProps> = ({ onNext }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() =>{
    async function signInIfNeeded() {
      
        const {
            data,
            error
        } = await supabase.auth.getSession();
      
        if (data.session === null) {
          const {
                data,
                error
            } = await supabase.auth.signInAnonymously();
            localStorage.setItem(userSession, JSON.stringify(data));
            
        } else if (data) {
            localStorage.setItem(userSession, JSON.stringify(data));
        } else {
            setIsError(true)
        }
        
        console.log(data)
    }

    signInIfNeeded()
  }, [])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const {
            data,
            error
        } = await supabase.auth.getSession();
      
      await supabase.from('email-sequences').insert({ user_id: data.session.user.id, website: url });
      
      onNext({ url });
    } catch (err) {
      console.error("Submission error:", err);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-4">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Get Started: Enter Your Store URL
        </h2>
        <p className="text-gray-600">
          We'll analyze your website to personalize your email flows.
        </p>
      </div>

      <div className="flex justify-center space-x-8 mb-8">
        <img
          src="/shopify.png"
          alt="Shopify"
          className="w-[70px] h-[70px] opacity-80 hover:opacity-100 transition-opacity duration-200"
        />
        <img
          src="/klaviyo.png"
          alt="Klaviyo"
          className="w-[60px] h-[50px] mt-[10px] opacity-80 hover:opacity-100 transition-opacity duration-200"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your store's website (e.g., mystore.com)"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            We currently support Shopify stores.
          </p>
        </div>
        <Button type="submit" loading={loading} className="w-full">
          {loading ? 'Analyzing Your Website...' : 'Next'}
        </Button>
      </form>
    </div>
  );
};

export default WebsiteStep;
