from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.http import JsonResponse
from django.db import IntegrityError

# Create your views here.
def sign_up(req):
    if req.method == "POST":
        email = req.POST.get("email")
        password = req.POST.get("password")
        first_name = req.POST.get("first_name")
        last_name = req.POST.get("last_name")
        
        if User.objects.filter(username=email).exists():
            return render(req, "registration/sign_up.html", {
                "error": "A user with this email already exists."
            })
        
        try:
            user = User.objects.create_user(
                username=email,
                password=password,
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            login(req, user)
            return redirect("/")
        except IntegrityError:
            return render(req, "registration/sign_up.html", {
                "error": "An error occurred. Please try again."
            })
    else:
        return render(req, "registration/sign_up.html")

def sign_in(req):
    if req.method == "POST":
        user = authenticate(req, username=req.POST.get("email"), password=req.POST.get("password"))
        if user is not None:
            login(req, user)
            return redirect("/")

        return render(req, "registration/sign_in.html")
    else:
        return render(req, "registration/sign_in.html")

def logout_view(request):
    logout(request)
    return JsonResponse({"success": True })