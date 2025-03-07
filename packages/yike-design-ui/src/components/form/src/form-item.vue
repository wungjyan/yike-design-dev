<template>
  <div :class="bem([mergedSize])">
    <div :class="bem('label')" :style="{ width: `${mergedLabelWidth}px` }">
      {{ label }}
    </div>
    <div :class="bem('field')">
      <slot />
      <Transition name="fade">
        <div v-if="validateStatus.isError" :class="bem('extra')">
          {{ validateStatus.message }}
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  FormItemProps,
  formContextKey,
  FormItemInstance,
  FormContext,
  formItemContextKey,
  FormItemStatus,
} from './form'
import { createCssScope, isArray } from '../../utils'
import { inject, computed, onMounted, reactive, provide } from 'vue'
import { Schema } from '../../utils/validate'

const bem = createCssScope('form-item')

defineOptions({
  name: 'YkForm',
})
const formContext = inject<Partial<FormContext>>(formContextKey, {})
const props = withDefaults(defineProps<FormItemProps>(), {
  labelWidth: 116,
})

const validateStatus = reactive<FormItemStatus>({
  status: 'primary',
  isError: false,
  message: '',
})

const computedDisabled = computed(() => props.disabled || formContext.disabled)

const mergedLabelWidth = computed(
  () => formContext?.labelWidth ?? props.labelWidth,
)

const mergedRules = computed(() => {
  const rules = []
  if (props.rules) {
    rules.push(...props.rules)
  }
  if (props.field) {
    if (formContext.rules) {
      const formFieldRules = formContext.rules?.[props.field] ?? []
      rules.push(...formFieldRules)
    }
  }
  if (props.required) {
    rules.push({ required: true })
  }
  return rules
})

const mergedSize = computed(() => formContext.size || 'l')

const layout = computed(() => formContext.layout || 'horizontal')

const validateField = (trigger?: string): Promise<any> => {
  let rules = mergedRules.value
  if (trigger) {
    // 根据rules列表中的trigger进行筛选
    rules = rules.filter((rule) => {
      if (isArray(rule.trigger)) {
        return rule.trigger.includes(trigger)
      }
      return rule.trigger === trigger
    })
  }
  if (!props.field || rules.length === 0) {
    return Promise.resolve()
  }

  const _field = props.field
  const _value = formContext?.model[_field]
  const schema = new Schema(
    {
      [_field]: rules.map(({ ...rule }) => {
        if (!rule.type && !rule.validator) {
          rule.type = 'string'
        }
        return rule
      }),
    },
    {
      ignoreEmptyString: true,
    },
  )
  return new Promise((resolve) => {
    schema.validate({ [_field]: _value }, (err: any) => {
      const isError = Boolean(err?.[_field])
      formContext.updateValidateState?.(_field, {
        isError,
        status: isError ? 'error' : 'primary',
        message: err?.[_field].message ?? '',
      })
      validateStatus.isError = isError
      validateStatus.status = isError ? 'error' : 'primary'
      validateStatus.message = err?.[_field].message ?? ''
      const error = isError
        ? {
            label: props.label,
            field: props.field,
            value: err[_field].value,
            type: err[_field].type,
            isRequiredError: Boolean(err[_field].requiredError),
            message: err[_field].message,
          }
        : undefined

      resolve(error)
    })
  })
}

const resetValidate = () => {
  if (!props.field) {
    return
  }
  formContext.updateValidateState?.(props.field, {
    isError: false,
    status: 'primary',
    message: '',
  })
  validateStatus.isError = false
  validateStatus.status = 'primary'
  validateStatus.message = ''
}

onMounted(() => {
  if (props.field) {
    const formItemInfo: FormItemInstance = reactive({
      field: props.field,
      disabled: computedDisabled,
      status: 'primary',
      isError: false,
      rules: mergedRules,
      validate: validateField,
      resetValidate,
    })
    formContext.addField?.(formItemInfo)
  }
})

provide(
  formItemContextKey,
  reactive({
    size: mergedSize,
    layout,
    validateInstance: validateStatus,
    disabled: computedDisabled.value,
    validate: validateField,
  }),
)
</script>
