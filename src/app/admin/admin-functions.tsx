'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createItemReport } from '@/actions/report-action';
import ConfirmationModal from '@/components/confirmation_modal/confirmation_modal';
import ItemFormModal from '@/components/item_form_modal/item_form_modal';
import { PrimaryColor, ItemCondition } from '@/generated/prisma/enums';
import type { Category, Location } from '@/generated/prisma/browser';

type Option = Pick<Category, 'id' | 'name'>;

export type AdminExportItem = {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  incidentDate: string;
  description: string;
  primaryColor: PrimaryColor;
  condition: ItemCondition;
  locationExtra: string;
  category: string;
  location: string;
};

function parseCsv(value: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quoted) {
      if (character === '"' && value[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
    } else if (character === '"' && cell.length === 0) {
      quoted = true;
    } else if (character === ',') {
      row.push(cell);
      cell = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && value[index + 1] === '\n') index += 1;
      row.push(cell);
      if (row.some((entry) => entry.trim())) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += character;
    }
  }

  row.push(cell);
  if (row.some((entry) => entry.trim())) rows.push(row);
  return rows;
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function downloadCsv(filename: string, rows: string[][]) {
  const contents = rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([contents], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminFunctions({
  categories,
  locations,
  items,
}: {
  categories: Option[];
  locations: Option[];
  items: AdminExportItem[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLogItemOpen, setIsLogItemOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  function handleExport() {
    const headers = [
      'ticketId',
      'title',
      'type',
      'status',
      'category',
      'description',
      'primaryColor',
      'condition',
      'location',
      'locationAdditional',
      'incidentDate',
      'submittedDate',
    ];
    const rows = items.map((item) => [
      item.id,
      item.title,
      item.type,
      item.status,
      item.category,
      item.description,
      item.primaryColor,
      item.condition,
      item.location,
      item.locationExtra,
      item.incidentDate,
      item.createdAt,
    ]);
    downloadCsv('tamufindr-tickets.csv', [headers, ...rows]);
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setImportMessage('');
    setIsImporting(true);

    try {
      const [headerRow, ...dataRows] = parseCsv(await file.text());
      if (!headerRow) {
        setImportMessage('The CSV file is empty.');
        return;
      }
      if (dataRows.length > 100) {
        setImportMessage('Import a maximum of 100 rows at a time.');
        return;
      }

      const headers = headerRow.map((header, index) =>
        (index === 0 ? header.replace(/^\uFEFF/, '') : header).trim().toLowerCase(),
      );
      const requiredHeaders = [
        'title',
        'category',
        'description',
        'location',
        'incidentdate',
        'primarycolor',
        'condition',
      ];
      const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
      if (missingHeaders.length > 0) {
        setImportMessage(
          `Missing CSV columns: ${missingHeaders.join(', ')}. Optional column: locationadditional.`,
        );
        return;
      }

      const categoryIds = new Map(
        categories.map((category) => [category.name.toLowerCase(), category.id]),
      );
      const locationIds = new Map(
        locations.map((location) => [location.name.toLowerCase(), location.id]),
      );
      let importedCount = 0;
      const errors: string[] = [];

      for (const [index, values] of dataRows.entries()) {
        const row = Object.fromEntries(
          headers.map((header, column) => [header, values[column] ?? '']),
        ) as Record<string, string>;
        const categoryId = categoryIds.get(row.category.trim().toLowerCase());
        const locationId = locationIds.get(row.location.trim().toLowerCase());
        const incidentDate = row.incidentdate.trim();
        const parsedDate = new Date(incidentDate);

        if (!row.title.trim() || row.title.trim().length < 3) {
          errors.push(`Row ${index + 2}: title must be at least 3 characters.`);
          continue;
        }
        if (!categoryId) {
          errors.push(`Row ${index + 2}: unknown category "${row.category}".`);
          continue;
        }
        if (!row.description.trim()) {
          errors.push(`Row ${index + 2}: description is required.`);
          continue;
        }
        if (!locationId) {
          errors.push(`Row ${index + 2}: unknown location "${row.location}".`);
          continue;
        }
        if (!incidentDate || Number.isNaN(parsedDate.getTime()) || parsedDate > new Date()) {
          errors.push(
            `Row ${index + 2}: incidentDate must be a valid date that is not in the future.`,
          );
          continue;
        }

        const primaryColor = Object.values(PrimaryColor).find(
          (color) => color === row.primarycolor.trim().toUpperCase(),
        );
        const itemCondition = Object.values(ItemCondition).find(
          (condition) => condition === row.condition.trim().toUpperCase(),
        );
        if (!primaryColor || !itemCondition) {
          errors.push(`Row ${index + 2}: primaryColor and condition must be valid enum values.`);
          continue;
        }

        const result = await createItemReport({
          primaryColor,
          itemCondition,
          type: 'FOUND',
          title: row.title,
          categoryId,
          description: row.description,
          locationId,
          locationAdditional: row.locationadditional ?? '',
          incidentDate,
        });
        if (result.success) {
          importedCount += 1;
        } else {
          errors.push(`Row ${index + 2}: ${result.error ?? 'could not be imported.'}`);
        }
      }

      const summary = `${importedCount} found item${importedCount === 1 ? '' : 's'} imported.`;
      setImportMessage(errors.length > 0 ? `${summary} ${errors.join(' ')}` : summary);
      if (importedCount > 0) router.refresh();
    } catch {
      setImportMessage('Unable to read this CSV file. Check its format and try again.');
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <>
      <section className="border-b border-primary-muted/15 py-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsLogItemOpen(true)}
            className="inline-flex min-h-11 items-center rounded-xl border border-primary bg-primary px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span aria-hidden="true" className="mr-2 text-xl leading-none">
              +
            </span>
            Log Item
          </button>
          <span aria-hidden="true" className="mx-1 hidden h-8 w-px bg-primary-muted/20 sm:block" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            title="CSV columns: title, category, description, location, incidentDate, primaryColor, condition; locationAdditional is optional"
            className="inline-flex min-h-11 items-center rounded-xl border border-primary-muted/30 bg-[var(--surface-raised)] px-4 py-2.5 font-semibold text-primary-dark shadow-sm transition-all hover:-translate-y-px hover:bg-[var(--surface-hover)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
          >
            {isImporting ? 'Importing…' : 'Import'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            aria-label="Choose a CSV file of found-item reports to import"
            onChange={handleImport}
          />
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex min-h-11 items-center rounded-xl border border-primary-muted/30 bg-[var(--surface-raised)] px-4 py-2.5 font-semibold text-primary-dark shadow-sm transition-all hover:-translate-y-px hover:bg-[var(--surface-hover)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Export
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/users')}
            className="inline-flex min-h-11 items-center rounded-xl border border-primary-muted/30 bg-[var(--surface-raised)] px-4 py-2.5 font-semibold text-primary-dark shadow-sm transition-all hover:-translate-y-px hover:bg-[var(--surface-hover)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Manage Users
          </button>
        </div>
        {importMessage && (
          <p role="status" className="mt-3 whitespace-pre-wrap text-sm text-primary-muted">
            {importMessage}
          </p>
        )}
      </section>

      <ItemFormModal
        mode="found"
        colors={Object.values(PrimaryColor)}
        conditions={Object.values(ItemCondition)}
        categories={categories as Category[]}
        locations={locations as Location[]}
        open={isLogItemOpen}
        onClose={() => setIsLogItemOpen(false)}
        onSuccess={(title) => {
          setIsLogItemOpen(false);
          setConfirmationTitle(title);
          router.refresh();
        }}
      />
      <ConfirmationModal
        open={confirmationTitle !== null}
        mode="found"
        itemTitle={confirmationTitle ?? ''}
        onClose={() => setConfirmationTitle(null)}
      />
    </>
  );
}
