/*******************************************
created by Raul Montesdeoca Fuentes - 2017
*******************************************/

/*
Component which show the list of recipes in pages of 10 items
*/

import {Http} from '@angular/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})

//Main class of the list of recipes component
export class RecipesComponent implements OnInit {

  //Initial values for the pagination
  recipesPerPages = 10;
  recipeFirst = 0;
  recipeLast = 9;
  recipesLength: number;
  recipes_originalLength: number;

  dataRecipes: any; //var to save the JSON with the list of recipes
  dataRecipes_original: any; //var to save the JSON with the list of recipes. Its a virgin copy all the time.

  //vars to save the JSON with the recipe, and interaction with the recipe component
  dataRecipe: any;
  name: string;
  summary: string;
  ingredients: any;
  methods: string[];
  image: string;
  
  searchNote: string = ''; //var to save the possible ingredients linked with the search

  orderASC = false;//flag to control the order ASC or DESC


  constructor(private http:Http) {

    

    /*******************************************
                  load from .JSON
    *******************************************/

    //Some loadings of the lists of recipes .JSON with different size to proof all the cases.

    this.http.get('assets/data/list.json')
    //this.http.get('assets/data/list_empty.json')
    //this.http.get('assets/data/list_big.json')
    
    .subscribe(
      res => {
        this.dataRecipes = res.json();
        this.dataRecipes_original = this.dataRecipes;
        this.recipesLength = Object.keys(this.dataRecipes).length;
        this.recipes_originalLength = Object.keys(this.dataRecipes_original).length;
      }
    )
    
  }


  ngOnInit() {
  }


  //control of the next page button
  pagNext() : void{
    this.recipeFirst += this.recipesPerPages;
    this.recipeLast += this.recipesPerPages;
  }

 //control of the previous page button
  pagPrevious() : void{
    this.recipeFirst -= this.recipesPerPages;
    this.recipeLast -= this.recipesPerPages;
  }


  //void which receive the name of the recipe from the list and convert to JSON name to load all the info
  showRecipe(name : string) : void{

    //transform recipe name to JSON name, including '-' instead of spaces and transforming in lowercases.
    let aux = name.toLowerCase();
    aux = aux.replace(/ /gi, '-');
    aux = aux.replace(/'/gi, '');
    aux = aux + ".json";

    //load the JSON in the recipe vars
    this.http.get('assets/data/' + aux)
    .subscribe(
      res => {
        let data = res.json();
        this.image = data.image;
        this.name = data.name;
        this.summary = data.summary;
        this.ingredients = data.ingredients;
        this.methods = data.method;
        this.dataRecipe = res.json();
      }
    )
  }


  //sort the list ASC or DESC
  order() : void{


    if (this.orderASC){
      //sort the list DESC
      this.dataRecipes.sort((a,b)=>{
        if (a.cookingTime > b.cookingTime)
          return -1;
        if (a.cookingTime < b.cookingTime)
          return 1;
        return 0;
      })
      this.orderASC=false;

    }else{
      //sort the list ASC
      this.dataRecipes.sort((a,b)=>{
        if (a.cookingTime < b.cookingTime)
          return -1;
        if (a.cookingTime > b.cookingTime)
          return 1;
        return 0;
      })
      this.orderASC=true;
    }

  }


  //void to search a title of recipe or ingredients inside of a recipe.
  search(word : string) : void{

    let dataRecipesNames: any;
    let dataRecipesIngredientes: any;
    this.searchNote = '';

    if (word == ''){
      this.dataRecipes = this.dataRecipes_original;
    }else{

      //search a title of recipe
      //filter 1 by 1 all the recipes titles checking if some of them contain the word from the search 
      dataRecipesNames = this.dataRecipes_original.filter((a)=>{

        //search the word in all the titles of recipes
        let auxPos = a.name.toLowerCase().indexOf(word.toLowerCase());
        //check if it was found
        if ( auxPos >= 0){
          //save only the exactly word from the title. example-> recipe: The Chicken Tandori; searched: Chick; save; Chicken;
          let auxPre = a.name.substring(0,auxPos);
          auxPre = auxPre.substring(auxPre.lastIndexOf(' '));
          let auxPost = a.name.substring(auxPos);
          auxPost = auxPost.substring(0,auxPost.indexOf(' '));
          let aux = auxPre + auxPost;

          //include the word in the possible ingredients if it was not included before
          if (this.searchNote.indexOf(aux.toUpperCase()) < 0){
            this.searchNote += aux.toUpperCase() + ' | ';
          }

          //save this recipe like found and continue searching in the next one.
          return 1;
        }
      //save this recipe like not found and continue searching in the next one.
      return 0;
      })

      //search ingredients inside of a recipe.
      dataRecipesIngredientes = this.dataRecipes_original.filter((a)=>{
        let ingredientFind = false;
        //search the word in all the ingredients of all the recipes
        for (let ingredient of a.ingredients) {
          //if the ingredient was found then save in the possible ingredients and continue searching more
          if (ingredient.toLowerCase().indexOf(word.toLowerCase()) >= 0){
            if (this.searchNote.indexOf(ingredient) < 0){
              this.searchNote += ingredient + ' | ';
            }
            ingredientFind = true;
          }
        }
        return ingredientFind;
      })

      //join all the recipes found
      this.dataRecipes = Array.from(new Set(dataRecipesNames.concat(dataRecipesIngredientes)));

      //save the number of total of recipes found
      this.recipesLength = Object.keys(this.dataRecipes).length;

    }

    

  }



}


