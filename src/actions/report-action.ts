// @/actions/report-actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { AuthorizationError, requireAdmin, requireUser } from '@/lib/auth/guard';
import { ItemCondition, PrimaryColor, ItemType } from '../generated/prisma/enums';

export type CreateReportInput = {
  type: ItemType;
  title: string;
  categoryId: string;
  description: string;
  locationId: string;
  locationAdditional?: string;
  incidentDate: string;
  primaryColor: PrimaryColor;
  secondaryColor?: PrimaryColor | null;
  brand?: string | null;
  itemCondition: ItemCondition;
};

export async function createItemReport(data: CreateReportInput) {
  const user = await requireUser();
  if (!Object.values(ItemType).includes(data.type)) {
    return { success: false, error: 'Select a valid item type.' };
  }
  if (data.type === ItemType.FOUND) {
    try {
      await requireAdmin();
    } catch (error) {
      if (!(error instanceof AuthorizationError)) throw error;
      return { success: false, error: 'Only administrators can submit found items.' };
    }
  }

  if (!data.title || data.title.trim().length < 3) {
    return { success: false, error: 'Title must be at least 3 characters long.' };
  }
  if (!data.categoryId || !data.locationId) {
    return { success: false, error: 'Category and Location are required.' };
  }

  if (
    !Object.values(PrimaryColor).includes(data.primaryColor) ||
    !Object.values(ItemCondition).includes(data.itemCondition) ||
    (data.secondaryColor != null && !Object.values(PrimaryColor).includes(data.secondaryColor))
  ) {
    return { success: false, error: 'Select a valid primary color and condition.' };
  }

  const parsedDate = new Date(data.incidentDate);
  if (isNaN(parsedDate.getTime())) {
    return { success: false, error: 'Invalid incident date provided.' };
  }

  try {
    const newItem = await prisma.item.create({
      data: {
        userId: user.id,
        type: data.type,
        title: data.title.trim(),
        description: data.description.trim(),
        categoryId: data.categoryId,
        locationId: data.locationId,
        locationExtra: data.locationAdditional || null,
        incidentDate: parsedDate,
        status: 'OPEN',
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor || null,
        brand: data.brand || null,
        condition: data.itemCondition,
      },
    });

    return { success: true, item: newItem };
  } catch (err) {
    console.error('Failed to create item report:', err);
    return { success: false, error: 'Database transaction failed. Please try again.' };
  }
}
