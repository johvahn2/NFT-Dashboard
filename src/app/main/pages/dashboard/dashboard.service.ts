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


const API_URL = environment.APP_BASE_URL;
const collectionName = 'runcible';

@Injectable()
export class DashboardService {

    constructor(private http: HttpClient) { }


    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Authorization': `Bearer ${environment.token}`
    });

    getOverview(): Observable<any> {
		return this.http.get<any>(API_URL+`/get_overview`,{headers:this.headers});
    }

    getRevenueOverview(): Observable<any> {
		return this.http.get<any>(API_URL+`/get_revenue_overview`,{headers:this.headers});
    }

    getRecentSales(): Observable<any> {
      return this.http.get<any>(API_URL+`/get_recent_sales`,{headers:this.headers});
    }

    getTwitterFeed(): Observable<any> {
      return this.http.get<any>(API_URL+`/get_twitter_feed`,{headers:this.headers});
    }

}