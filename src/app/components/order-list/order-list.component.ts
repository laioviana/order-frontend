import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from 'src/app/services/order.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

interface Order {
  id: number;
  customer: any;
  productType: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  dataSource: MatTableDataSource<Order> = new MatTableDataSource();
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  timeout: any;
  isLoading = false;
  displayedColumns: string[] = ['id', 'customer', 'product', 'description', 'status', 'action'];
  constructor(private orderService : OrderService, private snackBar: MatSnackBar) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders(this.currentPage, this.pageSize)
    .subscribe({
      next: data => {
        this.dataSource.data = data.content;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = data.totalPages;
        });
        this.isLoading = false;
      },
      error: error => {
        this.openSnackBar("Error: " + error);
      },
      complete: () => {
        console.log("Request completed");
      }
    });
  }

  cancelOrder(id : number): any {
    clearTimeout(this.timeout);
    this.orderService.cancelOrder(id)
    .subscribe({
      next: data => {
        this.openSnackBar("Order "+id+" canceled!");
      },
      error: error => {
        this.openSnackBar("Error: " + error);
      },
      complete: () => {
        this.getAllOrders();
      }
    });
  }

  payOrder(id : number): any {
    this.orderService.payOrder(id)
    .subscribe({
      next: data => {
        this.openSnackBar("Order "+id+" paid successfully!");
        this.timeout = setTimeout(() => {
          this.sendToQueue(id);
        }, 5000);
      },
      error: error => {
        this.openSnackBar("Error: " + error);
      },
      complete: () => {
        this.getAllOrders();
      }
    });
  }

  sendToQueue(id : number): any {
    this.orderService.sendToQueue(id)
    .subscribe({
      next: data => {
        this.openSnackBar("Order "+id+" sent to queue!");
      },
      error: error => {
        this.openSnackBar("Error: " + error);
      },
      complete: () => {
        this.getAllOrders();
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK");
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllOrders();
  }

}
