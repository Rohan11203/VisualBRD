import ExcelJS from 'exceljs';
import mongoose, { Document, Types } from 'mongoose';

// --- Type Definitions (Interfaces remain the same) ---
interface AnnotationDocument extends Document {
  marker: string;
  componentId?: string;
  section?: string;
  source?: string;
  interactivity?: string;
  isRequired?: boolean;
  masterData?: string;
  apiName?: string;
  isApiAvailable?: boolean;
  apiId?: string;
  thirdPartyIntegration?: string;
  authoringFieldName?: string;
  fieldContext?: string;
  validation?: string;
  desktopViewDifference?: string;
}

interface ProjectDocument extends Document {
  _id: Types.ObjectId;
  imageUrl?: string;
  annotations: (Types.ObjectId | AnnotationDocument)[];
}


export const generateBrdExcel = async (
  project: ProjectDocument,
  annotatedImageBuffer: Buffer
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SpecSync';
  workbook.created = new Date();
  const worksheet = workbook.addWorksheet('Visual BRD');

  // --- 1. Add a Main Title ---
  worksheet.mergeCells('A1:T1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'Visual Business Requirements Document';
  titleCell.font = { name: 'Calibri', size: 18, bold: true };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 40;

  // --- 2. Embed the Screenshot on the Left ---
  const imageArrayBuffer = annotatedImageBuffer.buffer.slice(
    annotatedImageBuffer.byteOffset,
    annotatedImageBuffer.byteOffset + annotatedImageBuffer.byteLength
  );
  const imageId = workbook.addImage({
    //@ts-ignore
    buffer: imageArrayBuffer,
    extension: 'png',
  });
  worksheet.addImage(imageId, {
    tl: { col: 1, row: 2 }, // Top-left at cell B3
    ext: { width: 350, height: 450 }
  });

  // --- 3. Define the VBRD Data Table Columns ---
  const tableStartRow = 5;
  const tableStartCol = 8; // Column E
  const columns = [
    { header: 'Marker', key: 'marker', width: 25 },
    { header: 'Component ID', key: 'componentId', width: 20 },
    { header: 'Section', key: 'section', width: 20 },
    { header: 'Source', key: 'source', width: 15 },
    { header: 'Interactivity/Comment/Logic', key: 'interactivity', width: 50 },
    { header: 'Is Required', key: 'isRequired', width: 15 },
    { header: 'Master Data', key: 'masterData', width: 25 },
    { header: 'API Name', key: 'apiName', width: 25 },
    { header: 'Is API Available', key: 'isApiAvailable', width: 20 },
    { header: 'API ID', key: 'apiId', width: 20 },
    { header: '3rd Party Integration', key: 'thirdPartyIntegration', width: 25 },
    { header: 'Authoring Field Name', key: 'authoringFieldName', width: 25 },
    { header: 'Field Context', key: 'fieldContext', width: 30 },
    { header: 'Validation', key: 'validation', width: 30 },
    { header: 'Difference in Desktop View', key: 'desktopViewDifference', width: 30 },
  ];
  
  // FIX: Instead of setting worksheet.columns (which adds headers at row 1),
  // we now set the properties for each column individually.
  columns.forEach((col, index) => {
    worksheet.getColumn(tableStartCol + index).width = col.width;
  });

  // --- 4. Add and Style the Table Header ---
  const headerRow = worksheet.getRow(tableStartRow);
  columns.forEach((col, index) => {
      headerRow.getCell(tableStartCol + index).value = col.header;
  });
  headerRow.height = 30;
  headerRow.eachCell((cell, colNumber) => {
    if (colNumber >= tableStartCol) {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    }
  });

  // --- 5. Add and Style the Annotation Data ---
  const annotations = project.annotations as AnnotationDocument[];
  annotations.forEach((anno, index) => {
    const plainAnno = anno.toObject();
    
    // FIX: Add an explicit type to rowData to resolve the TypeScript error.
    const rowData: { [key: string]: any } = {};
    columns.forEach(col => {
      const key = col.key as keyof AnnotationDocument;
      if (key === 'isRequired' || key === 'isApiAvailable') {
        rowData[key] = plainAnno[key] ? 'Yes' : 'No';
      } else {
        rowData[key] = plainAnno[key] || '';
      }
    });

    // Manually construct the row data in the correct order to place it correctly.
    const values = columns.map(col => rowData[col.key]);
    const row = worksheet.addRow([...Array(tableStartCol - 1), ...values]);
    
    // Style every cell in the row to ensure complete borders.
    for (let i = 0; i < columns.length; i++) {
        const cell = row.getCell(tableStartCol + i);
        
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
        
        if ((index + 1) % 2 !== 0) { // Alternating row color
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCE6F1' } };
        }
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

