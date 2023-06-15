
import Head from 'next/head'

export default function SEO({ title }: { description?: string, title?: string }) {

    return (
        <Head>
            <title>{title ? `${title} |` : ''} ARYA Crypto</title>
            <meta name="description" content="Track all your wallets and exchanges on a unified dashboard and effectively manage and automate your entire portfolio." />

            {/* Facebook Meta Tags*/}
            <meta property="og:site_name" content="ARYA Crypto" />
            <meta property="og:title" content="ARYA Crypto" />
            <meta property="og:type" content="website" />
            <meta property="og:description" content="Track all your wallets and exchanges on a unified dashboard and effectively manage and automate your entire portfolio." />

            {/* Twitter Meta Tags*/}
            <meta name="twitter:title" content="ARYA Crypto" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:description" content="Track all your wallets and exchanges on a unified dashboard and effectively manage and automate your entire portfolio." />
        </Head>
    )
}