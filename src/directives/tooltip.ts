import type { DirectiveBinding, ObjectDirective } from 'vue'

interface TooltipValue {
  value: string
  showDelay?: number
  hideDelay?: number
}

interface TooltipElement extends HTMLElement {
  _tooltipEl?: HTMLDivElement
  _showTimeout?: ReturnType<typeof setTimeout>
  _hideTimeout?: ReturnType<typeof setTimeout>
  _showHandler?: () => void
  _hideHandler?: () => void
}

function getTooltipConfig(binding: DirectiveBinding): TooltipValue {
  const value = binding.value
  if (typeof value === 'string') {
    return { value, showDelay: 100, hideDelay: 0 }
  }
  if (typeof value === 'object' && value !== null) {
    return { showDelay: 100, hideDelay: 0, ...value }
  }
  return { value: '', showDelay: 100, hideDelay: 0 }
}

function getPosition(binding: DirectiveBinding): 'top' | 'bottom' | 'left' | 'right' {
  if (binding.modifiers.top) return 'top'
  if (binding.modifiers.bottom) return 'bottom'
  if (binding.modifiers.left) return 'left'
  if (binding.modifiers.right) return 'right'
  return 'top'
}

function createTooltip(el: TooltipElement, binding: DirectiveBinding): void {
  const config = getTooltipConfig(binding)
  if (!config.value) return

  const position = getPosition(binding)

  const tooltip = document.createElement('div')
  tooltip.className = 'tooltip-directive'
  tooltip.setAttribute('data-position', position)
  tooltip.textContent = config.value

  // Basic styling - uses CSS variables for theme support
  tooltip.style.cssText = `
    position: fixed;
    z-index: 9999;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 500;
    color: hsl(var(--popover-foreground));
    background: hsl(var(--popover));
    border: 1px solid hsl(var(--border));
    border-radius: 6px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    white-space: nowrap;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  `

  document.body.appendChild(tooltip)
  el._tooltipEl = tooltip

  const showTooltip = () => {
    clearTimeout(el._hideTimeout)
    el._showTimeout = setTimeout(() => {
      const rect = el.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (position) {
        case 'top':
          top = rect.top - tooltipRect.height - 8
          left = rect.left + (rect.width - tooltipRect.width) / 2
          break
        case 'bottom':
          top = rect.bottom + 8
          left = rect.left + (rect.width - tooltipRect.width) / 2
          break
        case 'left':
          top = rect.top + (rect.height - tooltipRect.height) / 2
          left = rect.left - tooltipRect.width - 8
          break
        case 'right':
          top = rect.top + (rect.height - tooltipRect.height) / 2
          left = rect.right + 8
          break
      }

      // Keep within viewport
      const padding = 8
      if (left < padding) left = padding
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding
      }
      if (top < padding) top = padding
      if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding
      }

      tooltip.style.top = `${top}px`
      tooltip.style.left = `${left}px`
      tooltip.style.opacity = '1'
    }, config.showDelay)
  }

  const hideTooltip = () => {
    clearTimeout(el._showTimeout)
    el._hideTimeout = setTimeout(() => {
      tooltip.style.opacity = '0'
    }, config.hideDelay)
  }

  el._showHandler = showTooltip
  el._hideHandler = hideTooltip

  el.addEventListener('mouseenter', showTooltip)
  el.addEventListener('mouseleave', hideTooltip)
  el.addEventListener('focus', showTooltip)
  el.addEventListener('blur', hideTooltip)
}

function destroyTooltip(el: TooltipElement): void {
  clearTimeout(el._showTimeout)
  clearTimeout(el._hideTimeout)

  if (el._showHandler) {
    el.removeEventListener('mouseenter', el._showHandler)
    el.removeEventListener('focus', el._showHandler)
  }
  if (el._hideHandler) {
    el.removeEventListener('mouseleave', el._hideHandler)
    el.removeEventListener('blur', el._hideHandler)
  }

  if (el._tooltipEl) {
    el._tooltipEl.remove()
    delete el._tooltipEl
  }
}

export const vTooltip: ObjectDirective<TooltipElement> = {
  mounted(el, binding) {
    createTooltip(el, binding)
  },
  updated(el, binding) {
    destroyTooltip(el)
    createTooltip(el, binding)
  },
  unmounted(el) {
    destroyTooltip(el)
  }
}
