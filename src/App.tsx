/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Header } from './components/Header';
import { UploadPanel } from './components/UploadPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { BenchmarkPanel } from './components/BenchmarkPanel';
import { BenchmarkProvider } from './BenchmarkContext';
import { OnboardingGuide } from './components/OnboardingGuide';

export default function App() {
  return (
    <BenchmarkProvider>
      <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-800">
        <OnboardingGuide />
        <Header />
        
        <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-12 flex gap-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
            {/* Left Column - Fixed Width Upload Panel + Benchmark Panel */}
            <div className="flex flex-col gap-6 sm:gap-8 w-full lg:w-[480px]">
              <UploadPanel />
              <BenchmarkPanel />
            </div>

            {/* Right Column - Flexible Results Panel */}
            <div className="w-full lg:flex-1">
              <ResultsPanel />
            </div>
          </div>
        </main>

        {/* Background Decor to match Airtable's slight airy feel */}
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </BenchmarkProvider>
  );
}
