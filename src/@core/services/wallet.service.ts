import { Injectable } from "@angular/core";
import { ConnectionStore, WalletStore } from "@heavy-duty/wallet-adapter";
import { BehaviorSubject, Observable, of } from 'rxjs';
import base58 from 'bs58';
import { concatMap, first, map } from 'rxjs/operators';
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
    public static nfts = new BehaviorSubject(null);

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
    
    onSignMessage(message) {

      const signMessage$ = this._hdWalletStore.signMessage(
        new TextEncoder().encode(message)
      );
  
      if (!signMessage$) {
        return console.error(new Error('Sign message method is not defined'));
      }

      return signMessage$;
    }




    connect(){
      this._hdWalletStore.connect().subscribe(res => {
        WalletService.publicKey$.subscribe(async  key => {

        //Hand Shake
         let _sign:any = await this.handshake(key);

         if(_sign.data){

           //Signing
          let signMessage =  this.onSignMessage(_sign.data);
          if(signMessage){
            signMessage.subscribe(async res => {
              localStorage.setItem('token',_sign.data)
              let sign = bs58.encode(res);
              
              //Get Login Token
              let token = await this.login(key,sign,_sign.data);

              console.log(token);
            })
          }

         }
          

        });
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

    disconnect(){
      return this._hdWalletStore.disconnect().subscribe();
    }


}
