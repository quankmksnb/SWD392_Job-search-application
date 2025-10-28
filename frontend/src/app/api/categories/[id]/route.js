import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999';

// GET /api/categories/[id] - Lấy category theo ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const response = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch category',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update category (admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const token = request.headers.get('authorization');

    const response = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
      method: 'PUT',
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
    console.error('Error updating category:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update category',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category (admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const token = request.headers.get('authorization');

    const response = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete category',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
