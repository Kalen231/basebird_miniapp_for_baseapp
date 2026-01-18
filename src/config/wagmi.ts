import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { baseAccount } from 'wagmi/connectors'

export const config = createConfig({
    chains: [base],
    connectors: [
        miniAppConnector(),
        baseAccount({
            appName: 'Base Bird',
            appLogoUrl: 'https://basebird.space/icon.png',
        }),
    ],
    transports: {
        [base.id]: http(),
    },
    ssr: true,
})
