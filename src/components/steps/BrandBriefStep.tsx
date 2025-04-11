import React, { useEffect, useState, useRef } from 'react';
import Button from '../Button';
import { Loader2 } from 'lucide-react';
import { makeBrandBrief } from '../../logic/makeBrandBrief.js';
import AutoGrowTextArea from '../AutoGrowTextArea';

interface BrandBriefStepProps {
  onNext: (brief: BrandBrief | null) => void;
  onBack: () => void;
  initialData?: { url: string | null };
}

interface BrandBrief {
  brandName: string;
  brandDescription: string;
  brandAudience: string;
  brandTone: string;
  brandMessage: string;
  brandColors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

// Replace the simple STORAGE_KEY constant with a function
const getStorageKey = (url: string) => `brandBrief_${encodeURIComponent(url)}`;

const BrandBriefStep: React.FC<BrandBriefStepProps> = ({ onNext, onBack, initialData }) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Checking website...');
  const [isAnalyzing, setIsAnalyzing] = useState(!!initialData?.url); // Initialize based on URL presence
  const [brandBrief, setBrandBrief] = useState<BrandBrief | null>(null);
  const hasRequestedRef = useRef(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update the save effect to use URL-specific key
  useEffect(() => {
    if (brandBrief && initialData?.url) {
      console.log("Saving brand brief to localStorage for URL:", initialData.url);
      localStorage.setItem(getStorageKey(initialData.url), JSON.stringify(brandBrief));
    }
  }, [brandBrief, initialData?.url]);

  // Loading animation effect - depends *only* on isAnalyzing
  useEffect(() => {
    //console.log("Loading effect running. isAnalyzing:", isAnalyzing);
    if (!isAnalyzing) {
      if (progressIntervalRef.current) {
        //console.log("Clearing progress interval because isAnalyzing is false.");
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(100); // Set to 100 when done analyzing before showing form
      setCurrentTask('Brand Brief Ready!');
      return;
    }

    // Only start interval if isAnalyzing is true *and* interval isn't already running
    if (isAnalyzing && !progressIntervalRef.current) {
        //console.log("Starting progress interval.");
        setProgress(0); // Reset progress when starting
        setCurrentTask('Checking website...'); // Set initial task

        const tasks = [
          'Checking website...', // 0
          'Analyzing website content...', // 10
          'Extracting brand information...', // 20
          'Creating mind map...', // 30
          'Analyzing brand voice...', // 40
          'Identifying target audience...', // 50
          'Extracting brand colors...', // 60
          'Analyzing design patterns...', // 70
          'Generating brand description...', // 80
          'Finalizing brand brief...', // 90
        ]; // Length 10

        let progressValue = 0;
        let taskIndex = 0;

        progressIntervalRef.current = setInterval(() => {
            taskIndex = Math.floor(progressValue / 10);
            if (taskIndex < tasks.length) {
                 setCurrentTask(tasks[taskIndex]);
            }
            setProgress(progressValue);

            if (progressValue >= 95) {
                // Don't clear interval here, let it stop naturally when isAnalyzing becomes false
                // Just hold at 95% / last task
                 setCurrentTask(tasks[tasks.length - 1]);
                 setProgress(95);
            } else {
                progressValue += 5; // Increment progress more smoothly
            }

        }, 400); // Faster interval for smoother progress
    }


    // Cleanup function: Clears interval if component unmounts while analyzing
    return () => {
      if (progressIntervalRef.current) {
        //console.log("Clearing progress interval on effect cleanup.");
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [isAnalyzing]);

  // Update the data fetching effect
  useEffect(() => {
    const url = initialData?.url;

    // Reset state if URL is removed
    if (!url) {
      console.log("Data fetching effect: No URL, resetting state.");
      setIsAnalyzing(false);
      setBrandBrief(null);
      hasRequestedRef.current = false;
      return;
    }

    console.log("Data fetching effect: URL found:", url);

    // Check local storage using URL-specific key
    const storageKey = getStorageKey(url);
    const savedBrief = localStorage.getItem(storageKey);
    if (savedBrief) {
      try {
        const parsedBrief = JSON.parse(savedBrief);
        if (parsedBrief && parsedBrief.brandName) {
          console.log("Data fetching effect: Found valid saved brief for URL:", url);
          setBrandBrief(parsedBrief);
          setIsAnalyzing(false);
          hasRequestedRef.current = true;
          return;
        } else {
          console.warn("Saved brief data is invalid for URL:", url);
          localStorage.removeItem(storageKey);
        }
      } catch (error) {
        console.error('Error parsing saved brand brief for URL:', url, error);
        localStorage.removeItem(storageKey);
      }
    }

    // If reached here, no valid saved brief was found

    // Prevent duplicate requests in Strict Mode / fast re-renders
    if (hasRequestedRef.current && isAnalyzing) {
        // If already requested AND we are still analyzing, it means the fetch is in flight.
        // Or, it could mean Strict Mode's second run. Let the existing fetch complete.
        console.log("Data fetching effect: Already requested/analyzing, skipping new fetch initiation.");
        return;
    }
    // If we haven't requested OR analysis finished (e.g., error occurred previously), allow a new request.
    // Reset ref if analysis is not ongoing.
    if (!isAnalyzing) {
        hasRequestedRef.current = false;
    }


    console.log("Data fetching effect: No saved brief or retrying, preparing to fetch.");
    hasRequestedRef.current = true; // Mark that we are initiating a request NOW
    setIsAnalyzing(true); // Start analysis (might already be true, but ensures it)
    setBrandBrief(null); // Clear any previous brief data if re-fetching

    const scrapeWebsite = async () => {
      //console.log("scrapeWebsite: Starting analysis for", url);
      try {
        const brief: BrandBrief = await makeBrandBrief(url);
        console.log("scrapeWebsite: Received brief data", brief);

        // --- State Update ---
        // Directly set state. If component unmounted, React handles the warning.
        // In Strict Mode, this will update the *second* (persistent) component instance.
        //console.log("scrapeWebsite: Setting brand brief and stopping analysis (Success).");
        setBrandBrief(brief);
        setIsAnalyzing(false); // Stop analyzing *after* getting data

      } catch (error) {
        console.error('Error generating brand brief:', error);

        // --- State Update (Error) ---
        console.log("scrapeWebsite: Setting default brief and stopping analysis (Error).");
        setBrandBrief({ // Set a fallback brief
          brandName: 'Error Fetching Name',
          brandDescription: `Failed to generate brief from ${url}. Please enter manually. Error: ${error instanceof Error ? error.message : String(error)}`,
          brandAudience: 'Please define',
          brandTone: 'Please define',
          brandMessage: 'Please define',
          brandColors: { primary: '#FF0000', secondary: '#CCCCCC', tertiary: '#888888' }
        });
        setIsAnalyzing(false); // Still stop analyzing even on error
      }
    };

    scrapeWebsite();

    // No cleanup needed here anymore for isSubscribed
    // An AbortController cleanup would go here if makeBrandBrief supported it
    return () => {
       //console.log("Data fetching effect: Cleanup function running.");
       // If using AbortController: controller.abort();
    };
  }, [initialData?.url]); // Depend only on the URL string primitive value

  const handleInputChange = (
    field: keyof Omit<BrandBrief, 'brandColors'>,
    value: string
  ) => {
    setBrandBrief((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleColorChange = (colorType: keyof BrandBrief['brandColors'], value: string) => {
    setBrandBrief((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        brandColors: {
          ...prev.brandColors,
          [colorType]: value
        }
      };
    });
  };

  const handleNext = () => {
    //console.log("Navigating next with final brief:", brandBrief);
    onNext(brandBrief);
  };

  // --- Conditional Rendering ---

  if (isAnalyzing) {
    //console.log("Rendering Loading state.");
    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Building Brand Brief
          </h2>
          <p className="text-gray-600">We're analyzing your brand identity...</p>
        </div>
        <div className="max-w-md mx-auto mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{currentTask || 'Initializing...'}</p>
        </div>
      </div>
    );
  }

  if (!brandBrief) {
    console.log("Rendering Error/No Brief state (isAnalyzing is false).");
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {initialData?.url ? "Error Loading Brand Brief" : "Brand Brief Not Generated"}
        </h2>
        <p className="text-gray-600 mb-6">
          {initialData?.url
             ? "We couldn't load or generate the brand brief. Check the console for errors or try again."
             : "Please go back and provide a website URL."}
        </p>
        <Button onClick={onBack}>Go Back</Button>
        {initialData?.url && (
          <Button
            onClick={() => {
              //console.log("Retry button clicked");
              hasRequestedRef.current = false;
              setIsAnalyzing(true);
            }}
            variant="secondary"
            className="ml-2"
          >
            Retry Analysis
          </Button>
        )}
      </div>
    );
  }

  // If isAnalyzing is false AND brandBrief has data, render the form:
  //console.log("Rendering Brand Brief form state.");
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-600 mb-3 text-center">
        Your Brand Brief is Ready!
      </h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name
          </label>
          <input
            id="brandName"
            type="text"
            value={brandBrief.brandName}
            onChange={(e) => handleInputChange('brandName', e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="brandDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Brand Description
          </label>
          <AutoGrowTextArea
            id="brandDescription"
            value={brandBrief.brandDescription}
            onChange={(e) => handleInputChange('brandDescription', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="brandAudience" className="block text-sm font-medium text-gray-700 mb-2">
            Target Audience
          </label>
          <AutoGrowTextArea
            id="brandAudience"
            value={brandBrief.brandAudience}
            onChange={(e) => handleInputChange('brandAudience', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="brandTone" className="block text-sm font-medium text-gray-700 mb-2">
            Brand Tone
          </label>
          <AutoGrowTextArea
            id="brandTone"
            value={brandBrief.brandTone}
            onChange={(e) => handleInputChange('brandTone', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="brandMessage" className="block text-sm font-medium text-gray-700 mb-2">
            Brand Message
          </label>
          <AutoGrowTextArea
            id="brandMessage"
            value={brandBrief.brandMessage}
            onChange={(e) => handleInputChange('brandMessage', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Colors
          </label>
          <div className="grid grid-cols-3 gap-4 items-center">
            <div>
              <label htmlFor="colorPrimary" className="block text-xs text-gray-500 mb-1">
                Primary
              </label>
              <input
                id="colorPrimary"
                type="color"
                value={brandBrief.brandColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-full h-10 rounded cursor-pointer border border-gray-300"
              />
              <span className="text-xs text-gray-500 block truncate">
                {brandBrief.brandColors.primary}
              </span>
            </div>
            <div>
              <label htmlFor="colorSecondary" className="block text-xs text-gray-500 mb-1">
                Secondary
              </label>
              <input
                id="colorSecondary"
                type="color"
                value={brandBrief.brandColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-full h-10 rounded cursor-pointer border border-gray-300"
              />
              <span className="text-xs text-gray-500 block truncate">
                {brandBrief.brandColors.secondary}
              </span>
            </div>
            <div>
              <label htmlFor="colorTertiary" className="block text-xs text-gray-500 mb-1">
                Tertiary
              </label>
              <input
                id="colorTertiary"
                type="color"
                value={brandBrief.brandColors.tertiary}
                onChange={(e) => handleColorChange('tertiary', e.target.value)}
                className="w-full h-10 rounded cursor-pointer border border-gray-300"
              />
              <span className="text-xs text-gray-500 block truncate">
                {brandBrief.brandColors.tertiary}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="secondary" onClick={onBack}>
            Go Back
          </Button>
          <Button onClick={handleNext}>
            Accept & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandBriefStep;