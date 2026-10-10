export type ItemFormData = {
  type: 'LOST' | 'FOUND';
  title: string;
  categoryId: string;
  description: string;
  locationId: string;
  locationAdditional: string;
  incidentDate: string;
};
