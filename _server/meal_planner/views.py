import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Recipe, MealPlan, GroceryList, GroceryItem
from django.shortcuts import get_object_or_404

@login_required
def recipe_list(request):
    """
    View to list all recipes for the logged-in user.
    """
    recipes = Recipe.objects.filter(user=request.user)
    return JsonResponse(
        [{"id": recipe.id, "title": recipe.title, "ingredients": recipe.ingredients, "instructions": recipe.instructions}
         for recipe in recipes], safe=False
    )

@login_required
@csrf_exempt
def add_recipe(request):
    """
    View to add a recipe for the logged-in user.
    Only POST requests are allowed.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data.get("title")
            ingredients = data.get("ingredients")
            instructions = data.get("instructions")

            if not (title and ingredients and instructions):
                return JsonResponse({"error": "Missing fields"}, status=400)

            Recipe.objects.create(
                user=request.user,
                title=title,
                ingredients=ingredients,
                instructions=instructions
            )
            return JsonResponse({"message": "Recipe added successfully"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "GET method not allowed"}, status=405)

@login_required
def meal_plan_list(request):
    """
    View to list all meal plans for the logged-in user.
    """
    meal_plans = MealPlan.objects.filter(user=request.user)
    return JsonResponse(
        [{"id": meal_plan.id, "week_start": meal_plan.week_start, "recipes": [
            {"id": recipe.id, "title": recipe.title} for recipe in meal_plan.recipes.all()]}
         for meal_plan in meal_plans], safe=False
    )

@login_required
@csrf_exempt
def add_meal_plan(request):
    """
    View to add a meal plan for the logged-in user.
    Only POST requests are allowed.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            week_start = data.get('week_start')
            recipe_ids = data.get('recipes', [])

            if not week_start or not recipe_ids:
                return JsonResponse({"error": "Missing fields"}, status=400)

            meal_plan = MealPlan.objects.create(user=request.user, week_start=week_start)
            meal_plan.recipes.set(Recipe.objects.filter(id__in=recipe_ids))
            return JsonResponse({"message": "Meal plan added successfully"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "GET method not allowed"}, status=405)

@login_required
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_recipe(request, recipe_id):
    """
    View to delete a recipe by ID.
    """
    try:
        recipe = get_object_or_404(Recipe, id=recipe_id, user=request.user)
        recipe.delete()
        return JsonResponse({"message": "Recipe deleted successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@login_required
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_meal_plan(request, meal_plan_id):
    """
    View to delete a meal plan by ID.
    """
    try:
        meal_plan = get_object_or_404(MealPlan, id=meal_plan_id, user=request.user)
        meal_plan.delete()
        return JsonResponse({"message": "Meal plan deleted successfully"}, status=200)
    except MealPlan.DoesNotExist:
        return JsonResponse({"error": "Meal plan not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@login_required
def grocery_list(request):
    try:
        grocery_lists = GroceryList.objects.filter(user=request.user)
        data = {
            "items": [
                {
                    "id": grocery_list.id,
                    "name": grocery_list.name,
                    "items": [item.name for item in grocery_list.items.all()],
                    "created_at": grocery_list.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                }
                for grocery_list in grocery_lists
            ]
        }
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@login_required
@csrf_exempt
def add_grocery_list(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            list_name = data.get("name", "Unnamed List")
            items = data.get("items", [])
            
            grocery_list = GroceryList.objects.create(user=request.user, name=list_name)
            for item_name in items:
                item, _ = GroceryItem.objects.get_or_create(name=item_name)
                grocery_list.items.add(item)
            
            grocery_list.save()
            return JsonResponse({
                "id": grocery_list.id,
                "name": grocery_list.name,
                "items": [item.name for item in grocery_list.items.all()],
                "created_at": grocery_list.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)

@login_required
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_grocery_list(request, grocery_list_id):
    """
    View to delete a grocery list by ID.
    """
    try:
        grocery_list = get_object_or_404(GroceryList, id=grocery_list_id, user=request.user)
        grocery_list.delete()
        return JsonResponse({"message": "Grocery list deleted successfully"}, status=200)
    except GroceryList.DoesNotExist:
        return JsonResponse({"error": "Grocery list not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)