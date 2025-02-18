import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { recipes, RecipesType } from './recipes_exemples';
import { IRecipe } from '../i-recipe';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { SupabaseService } from '../../services/supabase.service';
import { map, Subscription } from 'rxjs';
import { SearchServiceService } from '../../services/search-service.service';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-recipes-list',
  imports: [CommonModule, RecipeCardComponent, FilterPipe],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.css',
})
export class RecipesListComponent implements OnInit, OnDestroy {
  constructor(
    private supabaseService: SupabaseService,
    private searchService: SearchServiceService
  ) {}

  public recipes: IRecipe[] = [];
  public allRecipes: IRecipe[] = [];
  public characters: any[] = [];
  private searchSubscription?: Subscription;
  public searchValue: string = '';

  ngOnInit(): void {
    this.supabaseService.getMeals().subscribe({
      next: (meals) => {
        console.log(meals);
        this.recipes = meals;
        this.allRecipes = meals;
      },
      error: (err) => console.log(err),
      complete: () => console.log('Received'),
    });

    this.searchSubscription = this.searchService.searchSubject.subscribe(
      (searchValue) => {
        this.searchValue = searchValue;
        this.searchRecipes(searchValue);
      }
    );
  }

  searchRecipes(query: string): void {
    if (query) {
      this.supabaseService.searchMeals(query).subscribe({
        next: (meals) => {
          console.log("Recetas recibidas de supabase por "+query, meals);
          
          this.recipes = meals;
        },
        error: (err) => console.log(err),
      });
    } else {
      this.supabaseService.getMeals().subscribe({
        next: (meals) => {
        console.log("No hay busqued, mostrando lista completa:",meals);
        
          this.recipes = meals;
        },
        error: (err) => console.log(err),
      });
    }
  }

  ngOnDestroy(): void {
    // this.intervalSubscritor?.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }
}
