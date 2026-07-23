import * as XLSX from 'xlsx';
import { StoreMasterRow, WeeklySalesRow } from '../types/retail';

export interface ParseResult<T> {
  success: boolean;
  data: T[];
  errors: string[];
  warnings: string[];
  fileName: string;
}

// Normalize column key for flexible column matching
function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

export async function parseWeeklySalesExcel(file: File): Promise<ParseResult<WeeklySalesRow>> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return { success: false, data: [], errors: ['No sheets found in workbook'], warnings: [], fileName: file.name };
    }

    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[sheetName]);
    if (!rawRows.length) {
      return { success: false, data: [], errors: ['Workbook sheet is empty'], warnings: [], fileName: file.name };
    }

    const parsedRows: WeeklySalesRow[] = [];

    rawRows.forEach((row, idx) => {
      // Build normalized key map
      const rowNormMap: Record<string, any> = {};
      Object.keys(row).forEach((k) => {
        rowNormMap[normalizeKey(k)] = row[k];
      });

      const getVal = (possibleKeys: string[], defaultVal: any = '') => {
        for (const k of possibleKeys) {
          const norm = normalizeKey(k);
          if (rowNormMap[norm] !== undefined && rowNormMap[norm] !== null && rowNormMap[norm] !== '') {
            return rowNormMap[norm];
          }
        }
        return defaultVal;
      };

      const storeId = String(getVal(['store_id', 'storeid', 'store', 'storecode'], '')).trim();
      if (!storeId) {
        warnings.push(`Row ${idx + 2}: Missing Store ID, skipped`);
        return;
      }

      const week = String(getVal(['week', 'week_no', 'weeknumber', 'wk'], 'Week 1')).trim();
      const date = String(getVal(['date', 'sales_date', 'week_date'], new Date().toISOString().split('T')[0])).trim();
      const productId = String(getVal(['product_id', 'productid', 'sku', 'item_id'], `SKU-${idx}`)).trim();
      const productName = String(getVal(['product_name', 'productname', 'item_name', 'product'], 'General Product')).trim();
      const category = String(getVal(['category', 'product_category', 'dept'], 'General')).trim();

      const grossSales = Number(getVal(['gross_sales', 'grosssales', 'gross'], 0)) || 0;
      const discountAmount = Number(getVal(['discount_amount', 'discountamount', 'discount'], 0)) || 0;
      const netSalesVal = getVal(['net_sales', 'netsales', 'net', 'sales'], null);
      const netSales = netSalesVal !== null ? Number(netSalesVal) || 0 : Math.max(0, grossSales - discountAmount);

      const returnAmount = Number(getVal(['return_amount', 'returnamount', 'returns', 'refund'], 0)) || 0;
      const transactionCount = Number(getVal(['transaction_count', 'transactions', 'tx_count', 'orders'], 1)) || 1;
      const salesTarget = Number(getVal(['sales_target', 'target', 'weekly_target'], netSales * 1.1)) || (netSales * 1.1);
      const stockoutDays = Number(getVal(['stockout_days', 'stockoutdays', 'stockout', 'out_of_stock_days'], 0)) || 0;
      const inventoryUnits = Number(getVal(['inventory_units', 'inventory', 'stock_units'], 100)) || 100;

      parsedRows.push({
        id: `FILE-${idx + 1}`,
        week,
        date,
        store_id: storeId,
        product_id: productId,
        product_name: productName,
        category,
        gross_sales: grossSales || netSales,
        discount_amount: discountAmount,
        net_sales: netSales,
        return_amount: returnAmount,
        transaction_count: Math.max(1, transactionCount),
        sales_target: Math.round(salesTarget),
        stockout_days: Math.max(0, stockoutDays),
        inventory_units: Math.max(0, inventoryUnits),
      });
    });

    if (parsedRows.length === 0) {
      errors.push('Failed to parse valid sales rows from file. Please check column headers.');
    }

    return {
      success: parsedRows.length > 0,
      data: parsedRows,
      errors,
      warnings: warnings.slice(0, 10), // Limit warning messages
      fileName: file.name,
    };
  } catch (err: any) {
    return {
      success: false,
      data: [],
      errors: [`Error reading file: ${err?.message || 'Unknown parsing error'}`],
      warnings: [],
      fileName: file.name,
    };
  }
}

export async function parseStoreMasterExcel(file: File): Promise<ParseResult<StoreMasterRow>> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return { success: false, data: [], errors: ['No sheets found in workbook'], warnings: [], fileName: file.name };
    }

    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[sheetName]);
    if (!rawRows.length) {
      return { success: false, data: [], errors: ['Workbook sheet is empty'], warnings: [], fileName: file.name };
    }

    const parsedRows: StoreMasterRow[] = [];

    rawRows.forEach((row, idx) => {
      const rowNormMap: Record<string, any> = {};
      Object.keys(row).forEach((k) => {
        rowNormMap[normalizeKey(k)] = row[k];
      });

      const getVal = (possibleKeys: string[], defaultVal: any = '') => {
        for (const k of possibleKeys) {
          const norm = normalizeKey(k);
          if (rowNormMap[norm] !== undefined && rowNormMap[norm] !== null && rowNormMap[norm] !== '') {
            return rowNormMap[norm];
          }
        }
        return defaultVal;
      };

      const storeId = String(getVal(['store_id', 'storeid', 'store', 'storecode'], '')).trim();
      if (!storeId) {
        warnings.push(`Row ${idx + 2}: Missing Store ID, skipped`);
        return;
      }

      const storeName = String(getVal(['store_name', 'storename', 'name'], `Store ${storeId}`)).trim();
      const region = String(getVal(['region', 'area', 'zone'], 'North')).trim();
      const city = String(getVal(['city', 'location', 'town'], 'Metropolis')).trim();
      const format = String(getVal(['format', 'store_format', 'type'], 'Supermarket')).trim();
      const managerName = String(getVal(['manager_name', 'manager', 'store_manager'], 'Store Manager')).trim();
      const targetSales = Number(getVal(['target_sales', 'target', 'weekly_target'], 80000)) || 80000;

      parsedRows.push({
        store_id: storeId,
        store_name: storeName,
        region,
        city,
        format,
        manager_name: managerName,
        target_sales: targetSales,
      });
    });

    if (parsedRows.length === 0) {
      errors.push('Failed to parse valid store master rows from file. Please check column headers.');
    }

    return {
      success: parsedRows.length > 0,
      data: parsedRows,
      errors,
      warnings: warnings.slice(0, 10),
      fileName: file.name,
    };
  } catch (err: any) {
    return {
      success: false,
      data: [],
      errors: [`Error reading store master file: ${err?.message || 'Unknown parsing error'}`],
      warnings: [],
      fileName: file.name,
    };
  }
}
