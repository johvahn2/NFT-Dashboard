import { Injectable } from "@angular/core";
import { ConnectionStore, WalletStore } from "@heavy-duty/wallet-adapter";
import { BehaviorSubject, from, lastValueFrom, Observable, of, Subject } from 'rxjs';
import base58 from 'bs58';
import { concatMap, first, map, takeUntil } from 'rxjs/operators';
import {
  PhantomWalletAdapter,
  PhantomWalletName,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { PublicKey } from "@solana/web3.js";
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import axios, { AxiosRequestConfig } from "axios";
import bs58 from "bs58";

const API_URL = environment.APP_BASE_URL;

@Injectable({
    providedIn: 'root'
  })
  export class WalletService {
  
    cluster = 'https://api.devnet.solana.com';

    public static connected$ = of(false);
    public static publicKey$ = new Observable<PublicKey>();

    public static _publicKey = new BehaviorSubject(null);
    public static Token = new BehaviorSubject(null);
    public static nfts = new BehaviorSubject(null);

    _unsubscribeAll: Subject<void> = new Subject();

    headers = new HttpHeaders({
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });

    constructor(
      private readonly _hdConnectionStore: ConnectionStore,
      private readonly _hdWalletStore: WalletStore,
      private http: HttpClient
    ){
      WalletService.connected$ = this._hdWalletStore.connected$;
      WalletService.publicKey$ = this._hdWalletStore.publicKey$;

      WalletService.publicKey$.subscribe(res => {
        if(!res) return;
        WalletService._publicKey.next(res);
      })
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
  



    connect(){
      this._hdWalletStore.connect().subscribe(async res => {
        console.log('Start Connecting');

        let key = WalletService._publicKey.getValue();
        if(!key) return;

        // Get HandShake
        let _sign:any = await this.handshake(key).catch((err)=> {this.disconnect()});

        if(!_sign?.data) return;

          //Prompt Signing
          this.onSignMessage(_sign.data).subscribe({next: async (res) => {
            let sign = bs58.encode(res);

            //Get Login Token
            let token:any = await this.login(key,sign,_sign.data);
            WalletService.Token.next(token.data);

          }, error: (err) => this.disconnect()});

      });
    }



    handshake(publicKey){
      return new Promise((resolve, rej) => {
        axios(API_URL+`/auth/handshake/${publicKey}`).then(res => {
          resolve(res);
        }).catch(err => rej(err));
      });
    }


    login(wallet, sign, nonce){
      return new Promise((resolve, rej) => {
        axios(API_URL+`/auth/login`,{method: 'post', data:{ wallet_address:wallet, signature: sign, auth_nonce: nonce }}).then(token => {
          resolve(token);
        }).catch(err => rej(err));
      });
    }


    onSignMessage(message) : Observable<Uint8Array> | Observable<null> {
      let prom = new Promise<Uint8Array>((resolve, reject) => {
        const signMessage$ = this._hdWalletStore.signMessage(
          new TextEncoder().encode(message)
        );
  
        if (!signMessage$) { //error after first sign in attempt
          console.error(new Error('Sign message method is not defined'));
          reject(null);
        }


        signMessage$.pipe(first()).subscribe({next:(signature) => {
          resolve(signature);
        }, error: (err) => {
          this.disconnect();
          reject(err);
        }});

      });

      return from(prom);

    }

    disconnect(){
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
      return this._hdWalletStore.disconnect().subscribe();
    }


}
