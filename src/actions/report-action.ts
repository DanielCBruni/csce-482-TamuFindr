// @/actions/report-actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import type { ItemType } from '../generated/prisma/enums';

export type CreateReportInput = {
  userId: string; // Typically retrieved from session/auth middleware
  type: ItemType;
  title: string;
  categoryId: string;
  description: string;
  locationId: string;
  locationAdditional?: string;
  incidentDate: string;
};

export async function createItemReport(data: CreateReportInput) {
  // 1. Server-side Validation
  if (!data.title || data.title.trim().length < 3) {
    return { success: false, error: 'Title must be at least 3 characters long.' };
  }
  if (!data.categoryId || !data.locationId) {
    return { success: false, error: 'Category and Location are required.' };
  }
  
  const parsedDate = new Date(data.incidentDate);
  if (isNaN(parsedDate.getTime())) {
    return { success: false, error: 'Invalid incident date provided.' };
  }

  try {
    // 2. Insert into PostgreSQL
    const newItem = await prisma.item.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title.trim(),
        description: data.description.trim(),
        categoryId: data.categoryId,
        locationId: data.locationId,
        locationExtra: data.locationAdditional || null,
        incidentDate: parsedDate,
        status: 'OPEN',
      },
    });

    return { success: true, item: newItem };
  } catch (err) {
    console.error('Failed to create item report:', err);
    return { success: false, error: 'Database transaction failed. Please try again.' };
  }
}