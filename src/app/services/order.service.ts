import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const baseUrl = 'http://localhost:8080/order';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getAllOrders(page: number, size: number): Observable<any> {
    return this.http.get(`${baseUrl}?page=${page}&size=${size}`);
  }

  createOrder(data : any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  payOrder(id : number): Observable<any> {
    return this.http.put(`${baseUrl}/pay/${id}`, null);
  }

  cancelOrder(id : number): Observable<any> {
    return this.http.put(`${baseUrl}/cancel/${id}`, null);
  }

  sendToQueue(id : number): Observable<any> {
    return this.http.put(`${baseUrl}/sendToQueue/${id}`, null);
  }
}
