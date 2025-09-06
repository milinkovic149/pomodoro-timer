import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-[10px] mt-8 bg-transparent border-t border-white/10">
      <div className="max-w-[980px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-white/80">© {new Date().getFullYear()} Pomodoro Productivity</div>
        <nav className="flex gap-4">
          <Link href="/" className="text-sm text-white/80 hover:text-white">Home</Link>
          <Link href="/privacy" className="text-sm text-white/80 hover:text-white">Privacy</Link>
          <Link href="/terms" className="text-sm text-white/80 hover:text-white">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
