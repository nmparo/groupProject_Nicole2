import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Product } from '../resources/data/product-object';

@inject(Router, Product)
export class Products {
    constructor(router, products) {
        this.router = router;
        this.products = products;
        this.message = 'Products';
        this.showProductEditForm = false;
    }

    async activate() {
        await this.getProducts();
    }

    attached() {
        feather.replace();
    }

    async getProducts() {
        await this.products.getProducts();
    }

    newProduct() {
        this.product = {
            productImage: "",
            productName: "",
            description: "",
            url: "",
        }
        this.openEditForm();
    }

    editProduct(product) {
        this.product = product;
        this.openEditForm();
    }

    openEditForm() {
        this.showProductEditForm = true;
        setTimeout(() => { $("#productName").focus(); }, 500);
    }

    changeActive(product) {
        this.product = product;
        this.save();
    }

    async save() {
        if (this.product && this.product.productName && this.product.description && this.product.url) {
                let serverResponse = await this.products.saveProduct(this.product);
                if (this.imagesToUpload && this.imagesToUpload.length > 0) 
                this.products.uploadImage(this.imagesToUpload, serverResponse.contentID);
            await this.getProducts();
            this.back();
        }
    }

    async delete() {
        if (this.product) {
            await this.products.delete(this.product);
            await this.getProducts();
            this.back();
        }
    }

    getProductReviews(product) {
        this.product = product;
        this.showProductReview();
    }

    showProductReview() {
        this.showProductReview = true;
    }

    back() {
        this.showProductEditForm = false;
        this.imagesToUpload = new Array();
        this.images = new Array();
    }

    changeImages() {
        this.imagesToUpload = this.imagesToUpload ? this.imagesToUpload : new Array();
        for (var i = 0; i < this.images.length; i++) {
        let addImage = true;
        this.imagesToUpload.forEach(item => {
            if (item.name === this.images[i].name) addImage = false;
        })
            if (addImage) this.imagesToUpload.push(this.images[i]);
        }
        }
        

    logout() {
        this.router.navigate('home');
    }

}