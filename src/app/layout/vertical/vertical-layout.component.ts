import { Component, OnDestroy, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConnectionStore, Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { PhantomWalletName } from '@solana/wallet-adapter-wallets';
import { IWallet, WalletService } from '@core/services/wallet.service';

@Component({
  selector: 'vertical-layout',
  templateUrl: './vertical-layout.component.html',
  styleUrls: ['./vertical-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerticalLayoutComponent implements OnInit, OnDestroy {
  coreConfig: any;

  // Wallet
  readonly connection$ = this._hdConnectionStore.connection$;
  readonly wallets$ = this._hdWalletStore.wallets$;
  readonly wallet$ = this._hdWalletStore.wallet$;
  readonly walletName$ = this.wallet$.pipe(
    map((wallet) => wallet?.adapter.name || null)
  );

  readonly connected$ = this._hdWalletStore.connected$;
  readonly publicKey$ = this._hdWalletStore.publicKey$;

  @ViewChild('walletModal', { static: true }) walletModal: ElementRef;
  walletLoading: boolean = false;
  
  
  // Private
  private _unsubscribeAll: Subject<void>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService, 
    private _elementRef: ElementRef, 
    private modalService: NgbModal,
    private readonly _hdConnectionStore: ConnectionStore,
    private readonly _hdWalletStore: WalletStore,
    private walletService: WalletService
    ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    

    this.connected$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res =>{
      if(!res){
        this.WalletModal();
      } else {
        this.modalService.dismissAll();
        this._hdWalletStore.wallet$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res =>{
          // console.log(res.adapter.name);
          // console.log(res.adapter.publicKey.toString());
        });

      }



    });



  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

    this._hdWalletStore.disconnect().subscribe();
  }

  WalletModal(){
    this.modalService.open(this.walletModal, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'sm'
    });
  }

  walletConnect(){
      this._hdWalletStore.selectWallet(PhantomWalletName);
  
  }

  WalletModalInit(){
    this.modalService.open(this.walletModal, {
      // backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal modal-primary'
    });
  }
}
