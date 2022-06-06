import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  zipCode: string;
  city: string;
  addressLine: string;
}

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {

  orderForm: FormGroup;
  customers: Customer[] = [];
  productType: String[] = [
    'ARTBOOK',
    'POSTER',
    'CALENDAR',
    'VISIT_CARDS'
  ];
  customerRadio = "existing";
  constructor(private formBuilder: FormBuilder, private customerService : CustomerService, private orderService : OrderService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.customers = this.getAllCustomers();

    this.orderForm = this.formBuilder.group({ 
      customerSelect: ['', [Validators.required]],
      productType:  ['', [Validators.required]],
      description:  ['', [Validators.required]]
    });
  }

  getAllCustomers(): any {
    this.customerService.getAllCustomers()
    .subscribe({
      next: data => {
        this.customers = data;
        console.log(data);
      },
      error: error => {
        console.log(error);
      },
      complete: () => {
        console.log("Request completed");
      }
    });
  }

  get f() { return this.orderForm.controls; }

  submit() {
    if (!this.orderForm.valid) {
      return;
    }

    if(this.customerRadio === "new") {

      const newCustomer = {
        firstName: this.orderForm.value.firstName,
        lastName: this.orderForm.value.lastName,
        email: this.orderForm.value.email,
        country: this.orderForm.value.country,
        zipCode: this.orderForm.value.zipCode,
        city: this.orderForm.value.city,
        addressLine: this.orderForm.value.addressLine
      };
      this.createCustomer(newCustomer)
    } else {
      const newOrder = {
        productType: this.orderForm.value.productType,
        description: this.orderForm.value.description,
        customer: this.orderForm.value.customerSelect
      }
      this.createorder(newOrder);
    }
    console.log(this.orderForm.value);
  }

  createCustomer(newCustomer: any) {
    this.customerService.createCustomer(newCustomer)
    .subscribe({
      next: data => {
        const savedCustomer = data;
        console.log(data);
        const newOrder = {
          productType: this.orderForm.value.productType,
          description: this.orderForm.value.description,
          customer: savedCustomer.id
        }
        this.createorder(newOrder);
      },
      error: error => {
        this.openSnackBar("Error: " + error);
      },
      complete: () => {
        console.log("Request completed");
      }
    });
  }

  createorder(newOrder: any) {
    this.orderService.createOrder(newOrder)
    .subscribe({
      next: data => {
        this.openSnackBar("Order created!");
        this.router.navigate(['/orders']);
      },
      error: error => {
        this.openSnackBar("Error: " + error);
      },
      complete: () => {
        console.log("Request completed");
      }
    });
  }

  radioChange(event: any) {
      if(event.value === 'new') {
        this.orderForm = this.formBuilder.group({ 
          firstName: ['', [Validators.required]],
          lastName:  ['', [Validators.required]],
          email:  ['', [Validators.required]],
          country: ['', [Validators.required]],
          city:  ['', [Validators.required]],
          addressLine:  ['', [Validators.required]],
          productType:  ['', [Validators.required]],
          description:  ['', [Validators.required]],
          zipCode:  ['', [Validators.required]],
        });
      } else {
        this.orderForm = this.formBuilder.group({ 
          customerSelect: ['', [Validators.required]],
          productType:  ['', [Validators.required]],
          description:  ['', [Validators.required]]
        });
      }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK");
  }

}
