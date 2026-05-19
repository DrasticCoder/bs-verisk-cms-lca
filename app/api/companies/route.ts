import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';

const productCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const skip = (page - 1) * perPage;

    // Build filter conditions
    const where: Prisma.ProductWhereInput = {};
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Build sort conditions - only allow sorting by valid fields
    const validSortFields = ['name', 'id'] as const;
    type ValidSortField = (typeof validSortFields)[number];
    const validSortField = validSortFields.includes(sortBy as ValidSortField)
      ? sortBy
      : 'name';
    const validSortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [validSortField]: validSortOrder,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: perPage,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      items: products,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = productCreateSchema.parse(body);

    const product = await prisma.product.create({
      data: validatedData,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 },
    );
  }
}
