export function makeBrandBrief(url: string): Promise<{
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
}>; 