import Nav from "./Nav/Nav";
import { Poppins } from 'next/font/google';


const poppins = Poppins({
    variable: '--poppins-font',
    weight: ["400", "500", "600"],
    subsets: ["latin"],
})

export default function Layout({ children }:any) {
    return <div className={poppins.className}>
        <Nav/>
        <div className={'flex flex-col flex-1 container sm:items-center lg:pt-28'}>
            {children}
        </div>;
    </div>
}
