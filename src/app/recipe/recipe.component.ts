/*******************************************
created by Raul Montesdeoca Fuentes - 2017
*******************************************/

/*
Component which show the recipe and details
*/

import {Http} from '@angular/http';
import { Component, Input, Output, EventEmitter, OnInit  } from '@angular/core';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})

//Main class of the recipe component
export class RecipeComponent implements OnInit {

  //inputs to interaction with the others components
  @Input() summary: any = null;
  @Input() ingredients: any = null;
  @Input() methods: any = null;
  @Input() image: any = null;
  @Input() name: any = null;
  @Input() dataRecipe: any = null;

  constructor(){}

  ngOnInit() {
  }

}