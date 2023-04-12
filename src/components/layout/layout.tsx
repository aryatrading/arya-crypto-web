import Navbar from './navbar'

type LayoutPropsType = { children: any }

export default function Layout({ children }: LayoutPropsType) {
    return <div className='h-full w-full'>
        {children}
    </div>;
}