// utils/excelExport.ts
import * as XLSX from 'xlsx'
import { utils, writeFile } from 'xlsx'
// utils/excelReader.ts

import { utils as styleUtils, writeFile as writeFileWithStyle } from 'xlsx-js-style'

// 样式类型定义
export interface ExcelStyle {
  fill?: {
    fgColor: { rgb: string }
  }
  font?: {
    name?: string
    sz?: number
    bold?: boolean
    italic?: boolean
    underline?: boolean
    color?: { rgb: string }
  }
  alignment?: {
    horizontal?: 'left' | 'center' | 'right' | 'justify'
    vertical?: 'top' | 'center' | 'bottom'
    wrapText?: boolean
  }
  border?: {
    top?: { style: string, color: { rgb: string } }
    bottom?: { style: string, color: { rgb: string } }
    left?: { style: string, color: { rgb: string } }
    right?: { style: string, color: { rgb: string } }
  }
  numFmt?: string
}

export interface ColumnConfig<T = any> {
  label: string
  prop: keyof T
  width?: number
  style?: ExcelStyle
  formatter?: (value: any, row: T) => any
}

export interface ExportOptions<T = any> {
  data: T[]
  columns: ColumnConfig<T>[]
  filename: string
  sheetName?: string
  headerStyle?: ExcelStyle
  cellStyle?: ExcelStyle
  merges?: XLSX.Range[]
}

export class ExcelExporter {
  // 默认样式
  static defaultHeaderStyle: ExcelStyle = {
    fill: { fgColor: { rgb: '4472C4' } },
    font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    },
  }

  static defaultCellStyle: ExcelStyle = {
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    },
  }

  /**
   * 导出带样式的Excel
   */
  static exportWithStyle<T>(options: ExportOptions<T>): void {
    const {
      data,
      columns,
      filename,
      sheetName = 'Sheet1',
      headerStyle = this.defaultHeaderStyle,
      cellStyle = this.defaultCellStyle,
      merges = [],
    } = options

    // 构建表头行
    const headerRow = columns.map(col => ({
      v: col.label,
      t: 's',
      s: { ...headerStyle, ...col.style },
    }))

    // 构建数据行
    const dataRows = data.map(row =>
      columns.map((col) => {
        const value = col.formatter
          ? col.formatter(row[col.prop], row)
          : row[col.prop]

        const cellType = typeof value === 'number' ? 'n' : 's'

        return {
          v: value,
          t: cellType,
          s: { ...cellStyle, ...col.style },
        }
      }),
    )

    // 合并数据
    const allData = [headerRow, ...dataRows]

    // 创建工作表
    const ws = styleUtils.aoa_to_sheet(allData)

    // 设置列宽
    if (columns.some(col => col.width)) {
      ws['!cols'] = columns.map(col => ({
        width: col.width || 20,
      }))
    }

    // 设置行高
    ws['!rows'] = [{ hpt: 25 }]

    // 设置合并单元格
    if (merges.length > 0) {
      ws['!merges'] = merges
    }

    // 创建工作簿并导出
    const wb = styleUtils.book_new()
    styleUtils.book_append_sheet(wb, ws, sheetName)
    writeFileWithStyle(wb, `${filename}.xlsx`)
  }

  /**
   * 导出简单Excel（无样式）
   */
  static exportSimple<T>(options: Omit<ExportOptions<T>, 'headerStyle' | 'cellStyle'>): void {
    const { data, columns, filename, sheetName = 'Sheet1' } = options

    const headerRow = columns.map(col => col.label)
    const dataRows = data.map(row =>
      columns.map((col) => {
        return col.formatter
          ? col.formatter(row[col.prop], row)
          : row[col.prop]
      }),
    )

    const allData = [headerRow, ...dataRows]
    const ws = utils.aoa_to_sheet(allData)

    // 设置列宽
    if (columns.some(col => col.width)) {
      ws['!cols'] = columns.map(col => ({
        width: col.width || 20,
      }))
    }

    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, sheetName)
    writeFile(wb, `${filename}.xlsx`)
  }

  /**
   * 导出复杂模板（包含标题、表头、数据、合计等）
   */
  static exportTemplate<T>(options: {
    title: string
    data: T[]
    columns: ColumnConfig<T>[]
    filename: string
    summaryRow?: { label: string, value: any }[]
  }): void {
    const { title, data, columns, filename, summaryRow } = options

    const titleStyle: ExcelStyle = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: 'center' },
    }

    const summaryStyle: ExcelStyle = {
      fill: { fgColor: { rgb: 'F2F2F2' } },
      font: { bold: true },
      alignment: { horizontal: 'right' },
    }

    // 标题行
    const titleRow = [{
      v: title,
      t: 's',
      s: titleStyle,
    }]

    // 表头行
    const headerRow = columns.map(col => ({
      v: col.label,
      t: 's',
      s: ExcelExporter.defaultHeaderStyle,
    }))

    // 数据行
    const dataRows = data.map(row =>
      columns.map(col => ({
        v: col.formatter ? col.formatter(row[col.prop], row) : row[col.prop],
        t: typeof row[col.prop] === 'number' ? 'n' : 's',
        s: ExcelExporter.defaultCellStyle,
      })),
    )

    // 合计行
    let summaryRows: any[] = []
    if (summaryRow) {
      summaryRows = summaryRow.map(item => [
        { v: item.label, t: 's', s: summaryStyle },
        ...Array.from({ length: columns.length - 1 }).fill(null).map(() => ({ v: '', t: 's', s: {} })),
        { v: item.value, t: 'n', s: summaryStyle },
      ])
    }

    // 合并所有数据
    const allData = [titleRow, [], headerRow, ...dataRows, ...summaryRows]

    // 创建工作表
    const ws = styleUtils.aoa_to_sheet(allData)

    // 合并标题行
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
    ]

    // 设置列宽
    ws['!cols'] = columns.map(col => ({ width: col.width || 20 }))

    // 创建工作簿并导出
    const wb = styleUtils.book_new()
    styleUtils.book_append_sheet(wb, ws, '报表')
    writeFileWithStyle(wb, `${filename}.xlsx`)
  }
}

export interface ReadOptions {
  // 是否包含原始Excel数据
  includeRaw?: boolean
  // 空单元格默认值
  defval?: any
  // 是否将数字字符串转换为数字
  convertNumbers?: boolean
  // 是否转换日期
  convertDates?: boolean
  // 自定义表头映射
  headerMap?: { [original: string]: string }
  // 需要跳过的行数（从开头）
  skipRows?: number
  // 需要跳过的行数（从结尾）
  skipFooter?: number
}

export interface SheetData {
  name: string
  data: any[]
  rawData?: any[][]
  headers: string[]
  rowCount: number
  columnCount: number
}

export interface ReadResult {
  fileName: string
  fileSize: number
  sheetCount: number
  sheets: SheetData[]
  workbook?: XLSX.WorkBook
}

export class ExcelReader {
  /**
   * 读取Excel文件
   */
  static async readFile(
    file: File,
    options: ReadOptions = {},
  ): Promise<ReadResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result as ArrayBuffer
          const workbook = XLSX.read(data, { type: 'array' })

          const result = this.processWorkbook(workbook, file, options)
          resolve(result)
        }
        catch (error) {
          reject(new Error(`读取Excel文件失败: ${error}`))
        }
      }

      reader.onerror = () => {
        reject(new Error('读取文件时发生错误'))
      }

      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * 从URL读取Excel
   */
  static async readFromUrl(
    url: string,
    options: ReadOptions = {},
  ): Promise<ReadResult> {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })

    const fileName = url.split('/').pop() || 'download.xlsx'
    const file = new File([arrayBuffer], fileName)

    return this.processWorkbook(workbook, file, options)
  }

  /**
   * 处理Workbook
   */
  private static processWorkbook(
    workbook: XLSX.WorkBook,
    file: File,
    options: ReadOptions,
  ): ReadResult {
    const sheets: SheetData[] = []

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName]
      const sheetData = this.processWorksheet(worksheet, sheetName, options)
      sheets.push(sheetData)
    })

    return {
      fileName: file.name,
      fileSize: file.size,
      sheetCount: workbook.SheetNames.length,
      sheets,
      workbook: options.includeRaw ? workbook : undefined,
    }
  }

  /**
   * 处理单个Worksheet
   */
  private static processWorksheet(
    worksheet: XLSX.WorkSheet,
    sheetName: string,
    options: ReadOptions,
  ): SheetData {
    // 获取原始二维数组数据
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: true,
      defval: options.defval || '',
    }) as any[][]

    // 跳过指定行数
    let data = [...rawData]
    if (options.skipRows && options.skipRows > 0) {
      data = data.slice(options.skipRows)
    }
    if (options.skipFooter && options.skipFooter > 0) {
      data = data.slice(0, -options.skipFooter)
    }

    // 获取表头
    let headers = (data[0] || []).map((header, index) => {
      if (!header || header.toString().trim() === '') {
        return `Column_${index + 1}`
      }
      return header.toString().trim()
    })

    // 应用表头映射
    if (options.headerMap) {
      headers = headers.map(header => options.headerMap![header] || header)
    }

    // 转换数据行
    const jsonData = this.convertRowsToJson(data.slice(1), headers, options)

    return {
      name: sheetName,
      data: jsonData,
      rawData: options.includeRaw ? rawData : undefined,
      headers,
      rowCount: jsonData.length,
      columnCount: headers.length,
    }
  }

  /**
   * 将数据行转换为JSON
   */
  private static convertRowsToJson(
    rows: any[][],
    headers: string[],
    options: ReadOptions,
  ): any[] {
    const result: any[] = []

    rows.forEach((row) => {
      const obj: any = {}
      let hasValue = false

      headers.forEach((header, index) => {
        const value = row[index]

        if (value === null || value === undefined || value === '') {
          obj[header] = null
          return
        }

        hasValue = true

        // 转换数字
        if (options.convertNumbers !== false) {
          const numValue = Number.parseFloat(value)
          if (!Number.isNaN(numValue) && value.toString() === numValue.toString()) {
            obj[header] = numValue
            return
          }
        }

        // 转换日期
        if (options.convertDates && typeof value === 'number') {
          // Excel日期转换
          const excelDate = value
          const jsDate = XLSX.SSF.format('yyyy-mm-dd', excelDate)
          if (jsDate) {
            obj[header] = jsDate
            return
          }
        }

        // 字符串处理
        obj[header] = value.toString().trim()
      })

      if (hasValue) {
        result.push(obj)
      }
    })

    return result
  }

  /**
   * 获取工作表预览（前几行）
   */
  static getPreview(data: any[], limit: number = 10): any[] {
    return data.slice(0, Math.min(limit, data.length))
  }

  /**
   * 查找数据中的空值
   */
  static findEmptyCells(data: any[]): Array<{ row: number, column: string, value: any }> {
    const emptyCells: Array<{ row: number, column: string, value: any }> = []

    data.forEach((row, rowIndex) => {
      Object.entries(row).forEach(([column, value]) => {
        if (value === null || value === undefined || value === '') {
          emptyCells.push({
            row: rowIndex + 2, // +2 因为Excel从1开始，且表头占一行
            column,
            value,
          })
        }
      })
    })

    return emptyCells
  }

  /**
   * 统计数据信息
   */
  static getStatistics(data: any[]): {
    totalRows: number
    totalColumns: number
    columnTypes: { [column: string]: string }
    sampleData: { [column: string]: any }
  } {
    if (!data.length) {
      return {
        totalRows: 0,
        totalColumns: 0,
        columnTypes: {},
        sampleData: {},
      }
    }

    const totalRows = data.length
    const totalColumns = Object.keys(data[0]).length
    const columnTypes: { [column: string]: string } = {}
    const sampleData: { [column: string]: any } = {}

    // 分析前几行数据推断类型
    Object.keys(data[0]).forEach((column) => {
      const values = data.slice(0, 10).map(row => row[column]).filter(val => val != null)

      if (values.length === 0) {
        columnTypes[column] = 'unknown'
        sampleData[column] = null
        return
      }

      // 检查是否是数字
      const allNumbers = values.every(val => typeof val === 'number')
      if (allNumbers) {
        columnTypes[column] = 'number'
      }
      // 检查是否是日期
      else if (values.every(val => typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val))) {
        columnTypes[column] = 'date'
      }
      // 检查是否是布尔值
      else if (values.every(val => typeof val === 'boolean')) {
        columnTypes[column] = 'boolean'
      }
      else {
        columnTypes[column] = 'string'
      }

      sampleData[column] = values[0]
    })

    return {
      totalRows,
      totalColumns,
      columnTypes,
      sampleData,
    }
  }
}
