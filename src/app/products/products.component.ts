import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: any[];
  filteredProducts: any[];
  categories$;
  category: string;
  subscription: Subscription;

  constructor(
    private productService: ProductService, 
    private categoryService: CategoryService,
    public route: ActivatedRoute
  ) { 
    this.subscription = this.productService.getAll().switchMap(products => {
      this.filteredProducts = this.products = products;

      return route.queryParamMap;
    })
    .subscribe(params => {
        this.category = params.get('category');
        if(this.category) {
          this.filteredProducts = this.products.filter(product => {
            return product.payload.val().category === this.category;
          });
        } else {
          this.filteredProducts = this.products;
        }
      });

    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
