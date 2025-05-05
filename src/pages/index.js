import Image from "next/image";
import Background from "@/assets/images/pomo-background.webp";
import Header from "@/components/Header";
import { Sora } from 'next/font/google'

const sora = Sora({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});
export default function Home() {

  return (
    <main>
        <div className={`${sora.className} absolute top-0 left-0 w-full h-full object-cover object-center -z-1`}>
            <Image
                src={Background}
                alt=""
                className="block w-full h-full object-cover object-center"
            />
        </div>
        <Header/>
    </main>
  );
}
