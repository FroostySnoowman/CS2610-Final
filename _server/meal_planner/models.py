from django.db import models
from django.contrib.auth.models import User

class Recipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    ingredients = models.TextField()
    instructions = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class MealPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    week_start = models.DateField()
    recipes = models.ManyToManyField(Recipe, related_name='meal_plans')

class GroceryItem(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class GroceryList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, default="Unnamed List")
    items = models.ManyToManyField(GroceryItem, related_name='grocery_lists')
    created_at = models.DateTimeField(auto_now_add=True)