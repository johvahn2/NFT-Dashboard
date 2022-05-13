import { Injectable } from "@angular/core";
import { ConnectionStore, WalletStore } from "@heavy-duty/wallet-adapter";
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  PhantomWalletAdapter,
  PhantomWalletName,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { PublicKey } from "@solana/web3.js";

@Injectable({
    providedIn: 'root'
  })
  export class WalletService {
  
    cluster = 'https://api.devnet.solana.com';

    public static connected$ = of(false);
    public static publicKey$;

    constructor(
      private readonly _hdConnectionStore: ConnectionStore,
      private readonly _hdWalletStore: WalletStore,
    ){
      WalletService.connected$ = this._hdWalletStore.connected$;
      WalletService.publicKey$ = this._hdWalletStore.publicKey$;
    }





    init(){
      this._hdConnectionStore.setEndpoint(this.cluster);
      this._hdWalletStore.setAdapters([
        new PhantomWalletAdapter(),
        new SlopeWalletAdapter(),
        new SolflareWalletAdapter(),
        new SolongWalletAdapter(),
      ]);
    }

    disconnect(){
      return this._hdWalletStore.disconnect();
    }

}
