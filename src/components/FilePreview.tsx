// src/components/FilePreview.tsx
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

import { readAndParseFile } from '@/utils/fileReader'
import type { FilePreviewData } from '@/types/bulkUpload'

interface FilePreviewProps {
  file: File | null
  previewRowCount?: number
  templateType: 'kw-filtering' | 'genre-keyword'
  previewData?: FilePreviewData | null
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  previewRowCount = 5,
  templateType,
  previewData: externalPreviewData
}) => {
  const t = useTranslations()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<FilePreviewData | null>(null)
  const [expanded, setExpanded] = useState<boolean>(true)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  // Toggle preview expansion
  const toggleExpanded = () => setExpanded(!expanded)

  useEffect(() => {
    // If previewData is provided externally, use it
    if (externalPreviewData) {
      setPreviewData(externalPreviewData)
      setLoading(false)
      setError(null)

      return
    }

    if (!file) {
      setPreviewData(null)
      setError(null)

      return
    }

    const parseFile = async () => {
      setLoading(true)
      setError(null)

      try {
        const parsedData = await readAndParseFile(file)

        setPreviewData({
          headers: parsedData.headers,
          rows: parsedData.rows.slice(0, previewRowCount),
          totalRows: parsedData.totalRows
        })
      } catch (err) {
        console.error('Error parsing file:', err)
        setError(t('fileParseError'))
      } finally {
        setLoading(false)
      }
    }

    parseFile()
  }, [file, previewRowCount, t, externalPreviewData])

  if ((!file && !externalPreviewData) || (externalPreviewData && externalPreviewData.rows.length === 0)) {
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
                  {t('showingFirstXRows', { count: previewData.rows.length, total: previewData.totalRows })}
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
