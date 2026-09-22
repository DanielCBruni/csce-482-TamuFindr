import type { ItemModalData } from './item_modal';

/** Sample reports for the UI until report data is connected. */
export const sampleItems: ItemModalData[] = [
  {
    title: 'AirPods Pro Case',
    category: 'Lost item',
    status: 'possible-match',
    statusLabel: 'Possible Match',
    reportedDate: 'Reported Sep 5, 2026',
    reportedBy: 'You',
    location: 'Memorial Student Center',
    itemId: 'LR-8821',
    description:
      'AirPods Pro charging case with a black protective cover and a small keychain clip.',
    itemType: 'Electronics',
  },
  {
    title: 'Texas A&M Lanyard',
    category: 'Lost item',
    status: 'open',
    statusLabel: 'Open',
    reportedDate: 'Reported Aug 28, 2026',
    reportedBy: 'You',
    location: 'Evans Library',
    itemId: 'LR-8754',
    description: 'Maroon Texas A&M lanyard with a metal clip.',
    itemType: 'Accessory',
  },
  {
    title: 'Navy Umbrella',
    category: 'Found item',
    status: 'open',
    statusLabel: 'Open',
    reportedDate: 'Reported Sep 12, 2026',
    reportedBy: 'You',
    location: 'Engineering courtyard',
    itemId: 'FR-4421',
    description: 'Navy umbrella with a silver handle, left near the engineering courtyard.',
    itemType: 'Umbrella',
  },
  {
    title: 'Black Hydroflask 32oz',
    category: 'My claim',
    status: 'claim-under-review',
    statusLabel: 'Claim Under Review',
    reportedDate: 'Submitted Sep 13, 2026',
    reportedBy: 'You',
    location: 'Student Recreation Center',
    itemId: 'CLM-1109',
    description: 'Black 32 oz insulated water bottle with a carrying handle.',
    itemType: 'Water bottle',
  },
];
