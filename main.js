Vue.component('product', {
    props: {
        premium:{
            type: Boolean,
            required: true
        }
    },
    template:   
    `<div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText"/>
        
        </div>

        <div class="product-info">
        <!-- <h1>{{ brand }} {{ product }}</h1> or -->
        <h1>{{ title }}</h1>
            <!-- <p>{{ description }}</p> (CHALLENGE no.1)-->
            <!-- <a :href="link" target="_blank">VUE</a> (CHALLENGE no.2) -->
        <p v-if="inStock > 0">In Stock ({{inStock}})</p>
        <p v-else :class="{lineThrough: inStock <= 0}">Out of Stock</p> <!-- challenge no.6 put a line through on OUT of STOCK-->
        <p> Shipping: {{ shipping }}</p>
        <!--  <p v-else-if="inventory <=10 && inventory > 0">Almost out of Stock</p>
        <span v-if="onSale">On Sale!</span> Challenge no.3 v-if directive remove the element to the DOM you can use an alternative directive called v-show which only toggles the display of an element-->
        
        <product-details :details="details"></product-details>
        
        <!-- <ul>
            <li v-for="detail in details">{{ detail }}</li>
             <li v-for="size in sizes">{{ size }}</li> challenge no.4 
         </ul> -->

        <div class="flex">
            <div v-for="(variant, index) in variants" 
            :key="variant.variantId"
            class="color-box"
            :style="{backgroundColor: variant.variantColor}"
            @mouseover="updateProduct(index)">
            <!-- <p @mouseover="updateProduct(variant.variantImage)">{{ variant.variantColor }}</p> -->
            </div>
        </div>

        <button v-on:click="addToCart" 
                :disabled="inStock <= 0"
                :class="{disabledButton: inStock <= 0}">
                Add to Cart</button>
        <button @click="rmvFrmCart"  
                :disabled=" outOfStock == 0"
                :class="{disabledButton: outOfStock == 0}">
                Remove from Cart</button> <!--  Challenge no.5 -->
        <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There is no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                <p>Name: {{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>Feedback: {{ review.review }}</p>
                <p>Recommendation: {{ review.recommendation }}</p>

                </li>
            </ul>
        </div>

        <product-review @review-submitted="addReview"></product-review>
        </div>
    </div>`,
data() {
    return {
        brand: 'Vue Mastery',
        product: 'Socks',
        description: 'A pair of warm, fuzzy socks', // Challange no. 1 add a description using <p>tag</p> below the heading.
        // image: '/img-assets/vmSocks-green-onWhite.jpg',
        selectedVariant: 0,
        altText: 'Green Socks',
        link: 'https://vuejs.org/', // Challange no. 2 bind this link to an anchor tag using v-bind:attribute:value on your HTML document
        // inStock: false ,
        onSale: true,
        inventory: 0,
        onSale: false, // Challenge no.3 display a span that says on sale!! whenever the onSale data is true use v-if directive
        details: ["80% cotton", "20% polyester", "Gender Neutral","Softy-Lefty"],
        variants: [
            {
                variantId: 2234,
                variantColor: "green",
                variantImage: '/img-assets/vmSocks-green-onWhite.jpg',
                variantQuantity: "10",
                onCart: 0
            },
            {
                variantId: 2235,
                variantColor: "blue",
                variantImage: '/img-assets/vmSocks-blue-onWhite.jpg',
                variantQuantity: "5",
                onCart: 0
            }
        ],
        sizes: ["S","M","L","XL"], // Challenge no.4 add an array of sizes to your data object, then use v-for to display them as a list
        // cart: 0, 
        reviews: []
    }
},
methods:  {
    addToCart: function () { // you can use ES6 shorthand for anonymous function addToCart() note: this might now work to all browsers
        this.variants[this.selectedVariant].onCart += 1;
        this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    rmvFrmCart: function () { // challenge no.2 add a method which decrement the current total of items in the cart
        this.variants[this.selectedVariant].onCart -= 1;
        this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        if ( this.variants[this.selectedVariant].onCart < 0) {
            this.variants[this.selectedVariant].onCart = 0;
        } 
    },
    updateProduct: function (index){
        this.selectedVariant = index;
    },
    addReview (productReview) {
        this.reviews.push(productReview)
    }
},
computed: {
    title: function (){
        return this.brand + ' ' + this.product;
    },
    image: function () {
        return this.variants[this.selectedVariant].variantImage; 
    },
    inStock() {
        qty = this.variants[this.selectedVariant].variantQuantity;
        onCart =  this.variants[this.selectedVariant].onCart;
        currentStock = qty -  onCart;
      
        return currentStock;
    },
    outOfStock() {
        return  this.variants[this.selectedVariant].onCart;
    },
    shipping() {
        if (this.premium) {
            return "Free"
        } else {
            return "$"+2.99
        }
    }
}

})

Vue.component('product-details', {
    props: {
      details: {
        type: Array,
        required: true
      }
    },
    template: `
    <div>
        <h4>Product Details</h4>
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    </div>
    `
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors"> {{ error}}</li>
        </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="Name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
    
    <p> Would you recommend this product?</p> 
    
    <div class="flex"> 
    <label for="yes">Yes</label> <input type="radio" class="recommendation" name="recommend" value="yes" v-model="recommendation">
    <label for="yes">No</label> <input type="radio"  class="recommendation" name="recommend" value="no" v-model="recommendation">
    </div>
    <p>
      <input type="submit" value="Submit">  
    </p>    
  
  </form>

    `,
    data () {
        return {
            name: null,
            review: null,
            rating: null,
            recommendation: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
          this.errors = []
           if (this.name && this.review && this.rating && this.recommendation) {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                recommendation: this.recommendation
            }
            this.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
            this.recommendation = null
           } else {
               if(!this.name) this.errors.push("Name Required")
               if(!this.review) this.errors.push("Review Required")
               if(!this.rating) this.errors.push("Rating Required")
               if(!this.recommendation) this.errors.push("Recommendation Required")
           }
        }
    
    }
})

Vue.config.devtools = true

var app = new Vue ({
    el: '#app',
    data: {
        premium: false,
        totalCartItems: []
    },
    methods: {
        updateCart(id) {
           // this.totalCartItems += 1;
           this.totalCartItems.push(id);
        },
        updateRemove(id) {
           //this.totalCartItems -= 1;
           for(var i = this.totalCartItems.length - 1; i >= 0; i--) {
            if (this.totalCartItems[i] === id) {
               this.totalCartItems.splice(i, 1);
                break;
            }
            
          }
        }
    }
})
