// components/FilePreview.tsx
import React, { useState, useEffect } from 'react'

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Alert,
  Chip,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { useTranslations } from 'next-intl'

interface FilePreviewProps {
  file: File | null
  previewRowCount?: number
  templateType: 'kw-filtering' | 'genre-keyword'
}

interface PreviewData {
  headers: string[]
  rows: string[][]
  totalRows: number
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, previewRowCount = 5, templateType }) => {
  const t = useTranslations()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [expanded, setExpanded] = useState<boolean>(true)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  // Toggle preview expansion
  const toggleExpanded = () => setExpanded(!expanded)

  useEffect(() => {
    if (!file) {
      setPreviewData(null)
      setError(null)

      return
    }

    const parseFile = async () => {
      setLoading(true)
      setError(null)

      try {
        // In a real implementation, you'd parse the file based on its type (CSV, Excel)
        // For this example, we'll simulate the parsing process

        // Simulating file reading delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Generate mock preview data based on template type
        const mockData = generateMockPreviewData(templateType, previewRowCount)

        setPreviewData(mockData)
      } catch (err) {
        console.error('Error parsing file:', err)
        setError(t('fileParseError'))
      } finally {
        setLoading(false)
      }
    }

    parseFile()
  }, [file, previewRowCount, t, templateType])

  // Mock function to generate preview data based on template type
  const generateMockPreviewData = (type: string, rowCount: number): PreviewData => {
    let headers: string[] = []
    const rows: string[][] = []

    if (type === 'kw-filtering') {
      headers = [
        'アカウントID',
        'アカウント名',
        'キャンペーンID',
        'キャンペーン名',
        '精査軸',
        '精査ポイント',
        '実績=1以上の場合、平均対比で○○%で停止',
        '実績=0の場合、平均対比で○○%で停止',
        '平均実績の計算期間 前○○日間',
        '休日実行'
      ]

      // Generate mock rows
      for (let i = 0; i < rowCount; i++) {
        rows.push([
          `acc-${i + 1}`,
          `テストアカウント${i + 1}`,
          `camp-${i + 1}`,
          `テストキャンペーン${i + 1}`,
          i % 3 === 0 ? 'CPA' : i % 3 === 1 ? 'CPC' : 'CPM',
          'ページビュー(Web)',
          '150%',
          '300%',
          '3',
          i % 2 === 0 ? 'ON' : 'OFF'
        ])
      }
    } else {
      // genre-keyword template
      headers = [
        'アカウントID',
        'アカウント名',
        'キャンペーンID',
        'キャンペーン名',
        '広告グループID',
        '広告グループ名',
        '入稿フラグ',
        '設定ジャンル1',
        '設定ジャンル2',
        '除外ジャンル1',
        '固定キーワード設定',
        '固定キーワード除外'
      ]

      // Generate mock rows
      for (let i = 0; i < rowCount; i++) {
        rows.push([
          `acc-${i + 1}`,
          `テストアカウント${i + 1}`,
          `camp-${i + 1}`,
          `テストキャンペーン${i + 1}`,
          `adg-${i + 1}`,
          `テスト広告グループ${i + 1}`,
          i % 2 === 0 ? 'ON' : 'OFF',
          'エンターテイメント',
          'スポーツ',
          'その他',
          'テスト,キーワード,設定',
          '除外,キーワード'
        ])
      }
    }

    return {
      headers,
      rows,
      totalRows: 15 // Mock total row count
    }
  }

  if (!file) {
    return null
  }

  return (
    <Box className='mt-6'>
      <Box className='flex justify-between items-center mb-2'>
        <Typography variant='subtitle1' className='font-semibold flex items-center'>
          <i className='tabler-table mr-2 text-primary-500' />
          {t('filePreview')}

          {previewData && (
            <Chip
              size='small'
              label={t('totalRows', { count: previewData.totalRows })}
              variant='outlined'
              className='ml-2'
            />
          )}
        </Typography>

        <IconButton size='small' onClick={toggleExpanded} className='text-gray-600'>
          <i className={`tabler-chevron-${expanded ? 'up' : 'down'}`} />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        {loading ? (
          <Paper elevation={0} className='border p-4'>
            <Skeleton variant='rectangular' height={40} className='mb-2' />
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} variant='rectangular' height={32} className='mb-1' />
            ))}
          </Paper>
        ) : error ? (
          <Alert severity='error'>{error}</Alert>
        ) : previewData ? (
          <div className='overflow-hidden border rounded-md'>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                maxHeight: isSmallScreen ? 300 : 400,
                overflow: 'auto'
              }}
              className='border-0'
            >
              <Table size='small' stickyHeader>
                <TableHead>
                  <TableRow>
                    {previewData.headers.map((header, idx) => (
                      <TableCell
                        key={idx}
                        className='font-semibold bg-gray-50'
                        sx={{
                          whiteSpace: 'nowrap',
                          position: 'sticky',
                          top: 0,
                          backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f9fafb',
                          zIndex: 1
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.rows.map((row, rowIdx) => (
                    <TableRow key={rowIdx} hover>
                      {row.map((cell, cellIdx) => (
                        <TableCell
                          key={cellIdx}
                          sx={{
                            whiteSpace: 'nowrap',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {previewData.totalRows > previewRowCount && (
              <Box className='p-2 text-center border-t bg-gray-50'>
                <Typography variant='caption' color='textSecondary'>
                  {t('showingFirstXRows', { count: previewRowCount, total: previewData.totalRows })}
                </Typography>
              </Box>
            )}
          </div>
        ) : null}
      </Collapse>
    </Box>
  )
}

export default FilePreview
