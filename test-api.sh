#!/bin/bash

# API Testing Script for OrderFood Backend
BASE_URL="http://localhost:5000/api"

echo "=== OrderFood Backend API Test ==="
echo "Testing all endpoints..."
echo

# 1. Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/health" | python -m json.tool
echo -e "\n"

# 2. User Registration
echo "2. Testing User Registration..."
curl -s -X POST "$BASE_URL/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User API",
    "email": "apitest@example.com",
    "password": "Test123456",
    "phone": "0123456789"
  }' | python -m json.tool
echo -e "\n"

# 3. User Login
echo "3. Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "Test123456"
  }')

echo "$LOGIN_RESPONSE" | python -m json.tool

# Extract token for authenticated requests
TOKEN=$(echo "$LOGIN_RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['data']['tokens']['accessToken'])" 2>/dev/null)
echo -e "\n"

if [ ! -z "$TOKEN" ]; then
  echo "4. Testing Get User Profile (Authenticated)..."
  curl -s -X GET "$BASE_URL/users/me" \
    -H "Authorization: Bearer $TOKEN" | python -m json.tool
  echo -e "\n"

  echo "5. Testing Get Products..."
  curl -s -X GET "$BASE_URL/products" \
    -H "Authorization: Bearer $TOKEN" | python -m json.tool
  echo -e "\n"

  echo "6. Testing Get Cart..."
  curl -s -X GET "$BASE_URL/cart" \
    -H "Authorization: Bearer $TOKEN" | python -m json.tool
  echo -e "\n"

  echo "7. Testing Get Orders..."
  curl -s -X GET "$BASE_URL/orders" \
    -H "Authorization: Bearer $TOKEN" | python -m json.tool
  echo -e "\n"
else
  echo "Login failed - cannot test authenticated endpoints"
fi

echo "=== API Testing Complete ==="
