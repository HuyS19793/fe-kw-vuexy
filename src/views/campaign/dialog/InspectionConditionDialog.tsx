'use client'

// Core imports
import { useEffect, useState } from 'react'

import { useTranslations } from 'next-intl'

// MUI components
import { Button, TextField, Typography, MenuItem, Chip } from '@mui/material'

// Custom components
import cn from 'classnames'

import DialogComponent from '@/components/DialogComponent'
import { getColor, InspectionConditionButton } from '../cells/InspectionConditionCell'

// Hooks and types
import { useInspectionConditionConfig } from '@/hooks/useOptions'
import type { CampaignSettingType, inspectionConditionSettingType } from '@/types/campaignType'

interface InspectionConditionDialogProps {
  openDialog: boolean
  onClose: () => void
  data: CampaignSettingType | null
  onSave: (inspectionConditionSetting: inspectionConditionSettingType) => void
  onDelete: () => void
}

interface PerformanceSettings {
  inspectionCondition: string
  formulaSelected: string | null
  performanceAboveOne: number
  performanceZero: number
  calculationPeriod: number
}

/**
 * Dialog for configuring inspection conditions for campaign settings
 */
const InspectionConditionDialog = ({ openDialog, onClose, data, onSave, onDelete }: InspectionConditionDialogProps) => {
  // Hooks
  const t = useTranslations()
  const inspectionConfig = useInspectionConditionConfig()

  // State
  const [settings, setSettings] = useState<PerformanceSettings>({
    inspectionCondition: '',
    formulaSelected: null,
    performanceAboveOne: 150,
    performanceZero: 300,
    calculationPeriod: 3
  })

  // Destructure state for easier access
  const { inspectionCondition, formulaSelected, performanceAboveOne, performanceZero, calculationPeriod } = settings

  const [performanceConfig, setPerformanceConfig] = useState<Record<string, string>>({})

  // Effects
  useEffect(() => {
    if (inspectionCondition) {
      setPerformanceConfig(inspectionConfig[inspectionCondition as keyof typeof inspectionConfig] || {})
    }
  }, [inspectionCondition, inspectionConfig])

  useEffect(() => {
    if (data?.performanceConfig?.formula) {
      const { inspectionCondition: dataCondition, performanceConfig: dataConfig } = data

      const newSettings: PerformanceSettings = {
        inspectionCondition: dataCondition || '',
        formulaSelected: dataConfig?.formula || null,
        performanceAboveOne: dataConfig?.performanceAboveOne || 150,
        performanceZero: dataConfig?.performanceZero || 300,
        calculationPeriod: dataConfig?.calculationPeriod || 3
      }

      setSettings(newSettings)
    } else {
      setSettings(prev => ({
        ...prev,
        inspectionCondition: '',
        formulaSelected: null
      }))
    }
  }, [data])

  useEffect(() => {
    // Auto-select the first formula when inspection condition changes
    if (
      Object.keys(performanceConfig).length > 0 &&
      !data?.performanceConfig?.formula &&
      settings.inspectionCondition
    ) {
      setSettings(prev => ({
        ...prev,
        formulaSelected: Object.keys(performanceConfig)[0]
      }))
    }
  }, [data?.performanceConfig?.formula, performanceConfig, settings.inspectionCondition])

  // console.log({ settings, data, performanceConfig })

  // Helpers
  const updateSetting = <K extends keyof PerformanceSettings>(key: K, value: PerformanceSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const isValidForSave = inspectionCondition && formulaSelected

  // Handlers
  const handleSelectInspectionCondition = (condition: string) => {
    updateSetting('inspectionCondition', condition)
  }

  const handleSelectPerformance = (key: string) => {
    updateSetting('formulaSelected', formulaSelected === key ? null : key)
  }

  const handleSave = () => {
    if (!isValidForSave) return

    onSave({
      name: performanceConfig[formulaSelected as string],
      performanceAboveOne,
      performanceZero,
      calculationPeriod
    })
  }

  // UI Components
  const renderInspectionButtons = () => (
    <div className='flex gap-6 justify-center mb-6'>
      {Object.keys(inspectionConfig).map(key => (
        <div key={key}>
          <InspectionConditionButton
            value={key}
            variant={inspectionCondition === key ? 'contained' : 'outlined'}
            onClick={() => handleSelectInspectionCondition(key)}
            size='large'
          >
            {key}
          </InspectionConditionButton>
        </div>
      ))}
    </div>
  )

  const renderPerformanceOptions = () => {
    if (Object.keys(performanceConfig).length === 0 || !inspectionCondition) return null

    return (
      <div className='mt-4'>
        <div className='flex gap-3 flex-wrap'>
          {Object.keys(performanceConfig).map(key => (
            <div
              className={cn('min-w-[160px]', {
                'flex-1': Object.keys(performanceConfig).length > 2
              })}
              key={key}
            >
              <Chip
                label={performanceConfig[key]}
                color={formulaSelected === key ? getColor(inspectionCondition) || 'default' : 'secondary'}
                variant={formulaSelected === key ? 'filled' : 'outlined'}
                size='small'
                clickable
                onClick={() => handleSelectPerformance(key)}
                className='text-center w-full'
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderSettingsForm = () => (
    <div className='space-y-6 border border-gray-200 p-6 rounded-lg mt-6'>
      <FormRow
        label='実績=1以上の場合 平均対比'
        suffix='% 以上で停止'
        value={performanceAboveOne}
        onChange={value => updateSetting('performanceAboveOne', Number(value))}
      />

      <FormRow
        label='実績=0 の場合 平均対比'
        suffix='% 以上で停止'
        value={performanceZero}
        onChange={value => updateSetting('performanceZero', Number(value))}
      />

      <FormRow
        label='平均実績の計算期間 前'
        suffix='日'
        value={calculationPeriod}
        onChange={value => updateSetting('calculationPeriod', Number(value))}
        isSelect
        options={[1, 2, 3, 4, 5, 6, 7]}
      />
    </div>
  )

  return (
    <DialogComponent
      open={openDialog}
      onClose={onClose}
      title={
        (data?.name && data?.name?.length > 50 && data?.name?.slice(0, 60) + '...') ||
        data?.name ||
        'Inspection Condition'
      }
      Body={
        <div className='grid grid-cols-1 gap-4 max-w-[800px] my-4'>
          <div>
            {renderInspectionButtons()}
            {renderPerformanceOptions()}
          </div>
          {renderSettingsForm()}
        </div>
      }
      ExtraActions={
        <Button color='error' variant='outlined' endIcon={<i className='tabler-trash' />} onClick={onDelete}>
          {t('Delete')}
        </Button>
      }
      Actions={
        <Button
          variant='contained'
          endIcon={<i className='tabler-device-floppy' />}
          disabled={!isValidForSave}
          onClick={handleSave}
        >
          {t('Save')}
        </Button>
      }
    />
  )
}

// Helper component for form rows
interface FormRowProps {
  label: string
  suffix: string
  value: number
  onChange: (value: string) => void
  isSelect?: boolean
  options?: number[]
}

const FormRow = ({ label, suffix, value, onChange, isSelect = false, options = [] }: FormRowProps) => (
  <div className='grid grid-cols-3 items-center gap-4'>
    <Typography variant='body1' className='font-medium'>
      {label}
    </Typography>

    {isSelect ? (
      <TextField size='small' select value={value} onChange={e => onChange(e.target.value)} className='w-full'>
        {options.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    ) : (
      <TextField size='small' type='number' value={value} onChange={e => onChange(e.target.value)} className='w-full' />
    )}

    <Typography variant='body1' className='font-medium'>
      {suffix}
    </Typography>
  </div>
)

export default InspectionConditionDialog
