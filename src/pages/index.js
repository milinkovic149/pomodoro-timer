import Image from "next/image";
import Background from "@/assets/images/pomo-background.webp";
import Header from "@/components/Header";
import { Sora } from 'next/font/google'
// import Timer from "@/components/Timer";
import Tasks from "@/components/Tasks";
import SEO from "@/components/SEO";

const sora = Sora({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});
export default function Home() {

  return (
    <main>
      <SEO
        title="Pomodoro Productivity — Pomodoro timer for increased productivity"
        description="A simple, lightweight Pomodoro timer to boost focus and productivity. Configure work and break intervals and track your progress."
        canonical="https://www.pomodoro-productivity.com/"
        image="https://www.pomodoro-productivity.com/next.svg"
      />
        <div className={`${sora.className} absolute top-0 left-0 w-full h-full object-cover object-center -z-1 bg-[#100B16]`}>
            <Image
                src={Background}
                alt="Pomodoro background"
                className="block w-full h-full object-cover object-center"
            />
        </div>
        <Header/>
        {/* <Timer /> */}
        <Tasks />
    </main>
  );
}
