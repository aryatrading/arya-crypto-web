import Footer from "./Footer/Footer";
import Nav from "./Nav/Nav";


export default function Layout({ children }:any) {
    return <div>
        <Nav/>
        <div className={'flex flex-col flex-1 container sm:items-center lg:pt-28'}>
            {children}
        </div>
        <Footer/>
    </div>
}
