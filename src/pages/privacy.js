import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Image from 'next/image';
import Background from '@/assets/images/pomo-background.webp';
import { Sora } from 'next/font/google';

const sora = Sora({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Privacy() {
  return (
    <main className="relative min-h-screen bg-[#100B16] text-white">
      {/* background image (same as home) */}
      <div className={`${sora.className} absolute top-0 left-0 w-full h-full object-cover object-center -z-1 bg-[#100B16]`}>
        <Image
          src={Background}
          alt="Pomodoro background"
          className="block object-cover object-center w-full h-full"
        />
      </div>

      <SEO title="Privacy — Pomodoro Productivity" description="Privacy policy for Pomodoro Productivity" />
      <Header />
      <div className="max-w-[980px] mx-auto px-4 py-12 relative">
        {/* black panel behind the content to ensure good contrast */}
        <div className="absolute inset-0 z-0 rounded-md bg-black/80 mt-[40px]" />

        <div className="relative z-10">
          <h1 className="mb-4 text-2xl font-semibold">Privacy Policy</h1>

          <p className="mb-4 text-sm text-white/80">
            Effective date: September 6, 2025
          </p>

          <p className="mb-4 text-sm text-white/80">
            Pomodoro Productivity ("we", "us", "the App") respects your privacy. This Privacy Policy explains what information the App collects, how it is used, and the choices you have.
          </p>

          <h2 className="mt-6 mb-2 text-lg font-medium">1. Information we collect</h2>
          <ul className="mb-4 ml-5 text-sm list-disc text-white/80">
            <li>
              <strong>Local data:</strong> The App stores tasks, timer settings, and related state in your browser (e.g., localStorage or IndexedDB) so your tasks persist between visits. This data stays on your device unless you explicitly export or share it.
            </li>
            <li>
              <strong>Optional analytics:</strong> If you enable analytics or if the App is configured to use third-party analytics, anonymous usage metrics (e.g., feature usage, errors, aggregate counts) may be collected. You will be informed if analytics are enabled and offered the option to opt out.
            </li>
            <li>
              <strong>No personal account required by default:</strong> The App does not require creating an account or collecting personal identifiers (name, email) for normal use unless you opt into an account-based feature.
            </li>
          </ul>

          <h2 className="mt-6 mb-2 text-lg font-medium">2. How we use information</h2>
          <p className="mb-4 text-sm text-white/80">
            Data stored locally is used to provide the App's core functionality (tasks, timers, progress tracking). Anonymous analytics, if enabled, are used to improve the App, fix bugs, and better understand usage patterns.
          </p>

          <h2 className="mt-6 mb-2 text-lg font-medium">3. Sharing and disclosures</h2>
          <p className="mb-4 text-sm text-white/80">
            We do not sell or lease your personal information. Local data is not transmitted to our servers by default. If you enable backups, sync, or sign in via a third-party service, data may be transmitted to the chosen provider — you will be informed and asked to consent before this happens.
          </p>

          <h2 className="mt-6 mb-2 text-lg font-medium">4. Third-party services</h2>
          <p className="mb-4 text-sm text-white/80">
            The App may use third-party services (e.g., analytics, error reporting, authentication). Those services have their own privacy policies; consider reviewing them before enabling related features.
          </p>

          <h2 className="mt-6 mb-2 text-lg font-medium">5. Security</h2>
          <p className="mb-4 text-sm text-white/80">
            We take reasonable measures to protect the data stored by the App. However, no method of storage or transmission is completely secure. Because most data is stored locally in your browser, protect access to your device and browser profile.
          </p>

          <h2 className="mt-6 mb-2 text-lg font-medium">6. Children</h2>
          <p className="mb-4 text-sm text-white/80">
            The App is not intended for children under 13. We do not knowingly collect personal information from children. If you believe we have collected information about a child, contact us and we will take steps to remove it.
          </p>

          <h2 className="mt-6 mb-2 text-lg font-medium">7. Your rights and choices</h2>
          <ul className="mb-4 ml-5 text-sm list-disc text-white/80">
            <li>You can clear or export your local data at any time using your browser developer tools or App UI if an export feature exists.</li>
            <li>If analytics are enabled, you may be offered an option to opt out in the App settings (if available).</li>
            <li>For account-based features (if added), you may request access to, correction of, or deletion of your data by contacting us (see section below).</li>
          </ul>

          <h2 className="mt-6 mb-2 text-lg font-medium">8. Changes to this policy</h2>
          <p className="mb-4 text-sm text-white/80">
            We may update this policy occasionally. If changes are material, we will attempt to notify users (for example via an in-app notice). The "Effective date" at the top will be updated when this policy changes.
          </p>

          <p className="mt-6 text-sm text-white/80">This Privacy Policy is provided for informational purposes and does not constitute legal advice.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
