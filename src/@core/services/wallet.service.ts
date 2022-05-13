import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class WalletService {

    private _walletSubject: BehaviorSubject<IWallet>;

    constructor() {}

 // Set the wallet
  set wallet(data: IWallet) {
    this._walletSubject.next(data);
  }

  get wallet(): any | Observable<IWallet> {
    return this._walletSubject.asObservable();
  }

}

export interface IWallet {
  name: undefined,
  publicKey: undefined
}