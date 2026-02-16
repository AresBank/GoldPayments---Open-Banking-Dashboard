
import React from 'react';

export const GoldPaymentsLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="gp-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FDE047' }} />
                <stop offset="100%" style={{ stopColor: '#F59E0B' }} />
            </linearGradient>
        </defs>
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="url(#gp-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12M12 12L22 7M12 12V22M12 2V12" stroke="url(#gp-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const BanamexLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#D92D20"/>
    <path d="M7 10H17V14H7V10Z" fill="white"/>
    <path d="M12 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


export const BbvaLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="24" height="24" rx="12" fill="#004481"/>
    <path d="M7 8L10 16L13 8L16 16L19 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SantanderLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="24" height="24" rx="12" fill="#EC0000"/>
    <path d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12" fill="white"/>
    <path d="M12 5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19" fill="#EC0000"/>
  </svg>
);

export const HsbcLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2.5L3 7.5V16.5L12 21.5L21 16.5V7.5L12 2.5Z" fill="#DB0011"/>
    <path d="M12 2.5V21.5L3 16.5V7.5L12 2.5Z" fill="white"/>
  </svg>
);

export const StpLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="24" height="24" rx="12" fill="#4F46E5"/>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">STP</text>
  </svg>
);

export const MercadoPagoLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="24" height="24" rx="12" fill="#009EE3"/>
    <path d="M7 10.5C7 9.67157 7.67157 9 8.5 9H9.5C10.3284 9 11 9.67157 11 10.5V13.5C11 14.3284 10.3284 15 9.5 15H8.5C7.67157 15 7 14.3284 7 13.5V10.5Z" fill="white"/>
    <path d="M13 10.5C13 9.67157 13.6716 9 14.5 9H15.5C16.3284 9 17 9.67157 17 10.5V13.5C17 14.3284 16.3284 15 15.5 15H14.5C13.6716 15 13 14.3284 13 13.5V10.5Z" fill="white"/>
    <rect x="11" y="11" width="2" height="2" fill="white"/>
  </svg>
);
