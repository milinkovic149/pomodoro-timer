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

export default function Terms() {
  return (
    <main className="relative min-h-screen bg-[#100B16] text-white">
      {/* background like home */}
      <div className={`${sora.className} absolute top-0 left-0 w-full h-full object-cover object-center -z-1 bg-[#100B16]`}>
        <Image
          src={Background}
          alt="Pomodoro background"
          className="block object-cover object-center w-full h-full"
        />
      </div>

      <SEO title="Terms — Pomodoro Productivity" description="Terms of service for Pomodoro Productivity" />
      <Header />

      <div className="max-w-[980px] mx-auto px-4 py-12 relative mt-[40px]">
        <div className="absolute inset-0 z-0 rounded-md bg-black/80" />
        <div className="relative z-10">
          <h1 className="mb-4 text-2xl font-semibold">Terms of Service</h1>

          <p className="mb-4 text-sm text-white/80">Effective date: September 6, 2025</p>

          <p className="mb-4 text-sm text-white/80">Please read these Terms of Service ("Terms") carefully before using Pomodoro Productivity (the "App"). By accessing or using the App, you agree to be bound by these Terms.</p>

          <h2 className="mt-6 mb-2 text-lg font-medium">1. Use of the App</h2>
          <p className="mb-4 text-sm text-white/80">The App provides a client-side Pomodoro timer and task management features. You may use the App for personal, non-commercial purposes in accordance with these Terms.</p>

          <h2 className="mt-6 mb-2 text-lg font-medium">2. No account required by default</h2>
          <p className="mb-4 text-sm text-white/80">The App does not require creating an account for basic usage. If account-based features (sync, backup, or sign-in) are added, those features will have their own terms and privacy implications which you must accept before use.</p>

          <h2 className="mt-6 mb-2 text-lg font-medium">3. Data and local storage</h2>
          <p className="mb-4 text-sm text-white/80">By default, task and timer data are stored locally in your browser (e.g., localStorage or IndexedDB). We do not transmit this data to our servers unless you explicitly enable a sync/backup feature. You are responsible for maintaining backups of any data you wish to preserve.</p>

          <h2 className="mt-6 mb-2 text-lg font-medium">4. Intellectual property</h2>
          <p className="mb-4 text-sm text-white/80">The App and its original content, features and functionality are owned by the site owner and are protected by copyright, trademark and other laws. You may not reproduce, distribute, modify, or create derivative works without permission.</p>

          <h2 className="mt-6 mb-2 text-lg font-medium">5. Disclaimers</h2>
          <p className="mb-4 text-sm text-white/80">The App is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the App will be uninterrupted, error-free, or completely secure.</p>

          <h2 className="mt-6 mb-2 text-lg font-medium">6. Limitation of liability</h2>
          <p className="mb-4 text-sm text-white/80">To the fullest extent permitted by law, in no event shall the App owners be liable for any indirect, incidental, special, consequential or punitive damages arising out of your use of the App.</p>

          <h2 className="mt-6 mb-2 text-lg font-medium">7. Changes to the App and Terms</h2>
          <p className="mb-4 text-sm text-white/80">We reserve the right to modify or discontinue the App (or any part of it) at any time without notice. We may also update these Terms from time to time; continued use after changes constitutes acceptance of the revised Terms.</p>

          <h2 className="mt-6 mb-2 text-lg font-medium">8. Termination</h2>
          <p className="mb-4 text-sm text-white/80">We may suspend or terminate access to the App at any time for any reason, including for violation of these Terms.</p>

          <h2 className="mt-6 mb-2 text-lg font-medium">9. Governing law</h2>
          <p className="mb-4 text-sm text-white/80">These Terms are governed by and construed in accordance with the laws of the jurisdiction where the site owner is located, without regard to conflict of law principles.</p>

          <p className="mt-6 text-sm text-white/80">These Terms constitute the entire agreement between you and the App regarding the use of the App.</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
