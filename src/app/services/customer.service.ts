import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const baseUrl = 'http://localhost:8080/customer';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getAllCustomers(): Observable<any> {
    return this.http.get(baseUrl);
  }

  createCustomer(data : any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
}
