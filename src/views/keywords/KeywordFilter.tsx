'use client'

import { forwardRef, useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { useRouter } from 'nextjs-toploader/app'

import type { TextFieldProps } from '@mui/material'
import { Checkbox, FormControlLabel, Button, Grid, Card } from '@mui/material'

// Third-party Imports
import { format } from 'date-fns'

// Custom Imports
import { useTranslations } from 'next-intl'

import moment from 'moment'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomTextField from '@/@core/components/mui/TextField'
import { useGenreOptions } from '@/hooks/useOptions'
import { useLoading } from '@/contexts/loadingContext'

interface SelectedGenres {
  [key: string]: boolean
}

type CustomInputProps = TextFieldProps & {
  label: string
  end: Date | number
  start: Date | number
}

const KeywordFilter = () => {
  // *** HOOKS ***
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isPending, startLoadingTransition } = useLoading()

  const genreParams = searchParams.get('category_name')
  const fromDateParam = searchParams.get('from_date')
  const toDateParam = searchParams.get('to_date')

  // *** OPTIONS ***
  const genreOptions = useGenreOptions()

  // *** STATE ***
  const [selectedGenres, setSelectedGenres] = useState<SelectedGenres>({})

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    moment().subtract(30, 'days').toDate(),
    moment().subtract(1, 'days').toDate()
  ])

  // *** EFFECTS ***
  useEffect(() => {
    if (genreOptions.length > 0) {
      if (genreParams) {
        const genres = genreParams.split(',')

        const genresObj = genreOptions.reduce((acc: SelectedGenres, genre: string) => {
          acc[genre] = genres.includes(genre)

          return acc
        }, {})

        setSelectedGenres(genresObj)
      } else {
        const genres: SelectedGenres = genreOptions.reduce((acc: SelectedGenres, genre: string) => {
          acc[genre] = true

          return acc
        }, {})

        setSelectedGenres(genres)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genreParams])

  useEffect(() => {
    if (fromDateParam && toDateParam) {
      setDateRange([new Date(fromDateParam), new Date(toDateParam)])
    }
  }, [fromDateParam, toDateParam])

  // *** FUNCTIONS ***
  const handleCategoryChange = (category: string) =>
    setSelectedGenres(prev => ({
      ...prev,
      [category]: !prev[category]
    }))

  const handleOnChangeRange = (dates: any) => setDateRange(dates)

  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const { start, end, ...rest } = props

    const startDate = start ? format(start, 'yyyy/MM/dd') : ''
    const endDate = end !== null ? ` - ${format(end, 'yyyy/MM/dd')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <CustomTextField fullWidth inputRef={ref} {...rest} value={value} />
  })

  const onSearch = () => {
    // Search Params to Object
    const currentSearchParamsObj = Object.fromEntries(searchParams)

    const queryObj = {
      ...currentSearchParamsObj
    } as Record<string, string>

    const genres = Object.keys(selectedGenres).filter(genre => selectedGenres[genre])

    const genresString = genres.length === 0 || genres.length === genreOptions.length ? '' : genres.join(',')

    // console.log('Genres:', genresString)

    if (genresString) {
      queryObj.category_name = genresString
    } else {
      delete queryObj.category_name
    }

    const fromDate = dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : ''
    const toDate = dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : ''

    if (fromDate) {
      queryObj.from_date = fromDate
    }

    if (toDate) {
      queryObj.to_date = toDate
    }

    if (!fromDate && !toDate) {
      delete queryObj.from_date
      delete queryObj.to_date
    }

    // console.log('Query:', queryObj)

    if (Object.keys(queryObj).length === 0) {
      startLoadingTransition(() => {
        router.replace('?')
      })

      return
    }

    const queryStr = new URLSearchParams(queryObj).toString()

    startLoadingTransition(() => {
      router.replace(`?${queryStr}`)
    })
  }

  return (
    <Card className='p-6 max-w-lg mx-auto min-w-[500px]'>
      <div className='mb-6'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className='flex gap-4'>
              <div className='flex-1'>
                <AppReactDatepicker
                  selectsRange
                  monthsShown={2}
                  startDate={dateRange[0] ?? undefined}
                  endDate={dateRange[1] ?? undefined}
                  selected={dateRange[0]}
                  shouldCloseOnSelect
                  id='keyword-date-range'
                  onChange={handleOnChangeRange}
                  customInput={
                    <CustomInput
                      label={t('Date Range')}
                      className='mb-2'
                      end={dateRange[1] as Date | number}
                      start={dateRange[0] as Date | number}
                    />
                  }
                />
              </div>

              <div className='flex items-center'>
                <span
                  className='text-gray-500 hover:text-gray-700
                    border border-white rounded-full p-1.5 shadow-md hover:shadow-lg
                    transition duration-200 ease-in-out
                    mt-2 cursor-pointer w-8 h-8 flex items-center justify-center text-2xl
                  '
                  onClick={() => setDateRange([null, null])}
                >
                  <i className='tabler-x' />
                </span>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Keyword Categories */}
      <div className='mb-6'>
        {/* <label className='block font-bold mb-2'>Genre</label> */}
        <Grid container spacing={1}>
          {Object.keys(selectedGenres).map((genre: string) => (
            <Grid item xs={12} sm={6} key={genre}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedGenres[genre]}
                    onChange={() => handleCategoryChange(genre)}
                    color='primary'
                  />
                }
                label={genre}
              />
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Buttons */}
      <div className='flex justify-end space-x-4'>
        {isPending ? (
          <>
            <Button variant='outlined' color='primary' startIcon={<i className='tabler-loader' />} disabled>
              {t('Fetching')}
            </Button>
          </>
        ) : (
          <Button variant='outlined' color='primary' startIcon={<i className='tabler-search' />} onClick={onSearch}>
            {t('Search')}
          </Button>
        )}
      </div>
    </Card>
  )
}

export default KeywordFilter
