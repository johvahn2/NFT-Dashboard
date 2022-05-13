// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// RxJS
import {of, forkJoin } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
// Lodash
import { filter, some, find, each } from 'lodash';
// Environment
import { environment } from 'environments/environment';


import { BehaviorSubject, Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';


const API_URL = environment.magicEdenAPI;
const collectionName = 'runcible';

@Injectable()
export class DashboardService {

    constructor(private http: HttpClient) { }


    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });

    getStatus(): Observable<any> {
		return this.http.get<any>(API_URL+`/collections/${collectionName}/stats`,{headers:this.headers});
    }

    getActivities(): Observable<any> {
		return this.http.get<any>(API_URL+`/collections/${collectionName}/activities?offset=0&limit=20`);
    }

}