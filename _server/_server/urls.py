from django.contrib import admin
from django.urls import path, include
from meal_planner import views as meal_planner_views

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # Registration routes
    path('registration/', include("registration.urls")),

    # Core routes
    path('', include("core.urls")),

    # Recipes
    path('recipes/', meal_planner_views.recipe_list, name='recipe_list'),
    path('recipes/add/', meal_planner_views.add_recipe, name='add_recipe'),  # Add trailing slash
    path('recipes/delete/<int:recipe_id>/', meal_planner_views.delete_recipe, name='delete_recipe'),

    # Meal Plans
    path('meal_plans/', meal_planner_views.meal_plan_list, name='meal_plan_list'),
    path('meal_plans/add/', meal_planner_views.add_meal_plan, name='add_meal_plan'),
    path('meal_plans/delete/<int:meal_plan_id>/', meal_planner_views.delete_meal_plan, name='delete_meal_plan'),

    # Grocery Lists
    path('grocery_list/', meal_planner_views.grocery_list, name='grocery_list'),
    path('grocery_list/add/', meal_planner_views.add_grocery_list, name='add_grocery_list'),
    path('grocery_list/delete/<int:grocery_list_id>/', meal_planner_views.delete_grocery_list, name='delete_grocery_list'),
]