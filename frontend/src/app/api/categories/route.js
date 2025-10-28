import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999';

// GET /api/categories - Lấy danh sách categories
export async function GET(request) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Không cache để luôn lấy data mới
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/categories - Tạo category mới (admin only)
export async function POST(request) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');

    const response = await fetch(`${BACKEND_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create category',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
