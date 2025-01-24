import { IconType } from 'react-icons';

export interface IChainInfo {
    name: string;
    icon: IconType;
    symbol: string;
    chainId?: string; 
    rpcUrl?: string; 
    explorerUrl?: string; 
}