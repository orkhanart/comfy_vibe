<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Bell,
  Bolt,
  Bold,
  Bookmark,
  BookOpen,
  Box,
  Briefcase,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  CircleDot,
  Clipboard,
  Clock,
  Code,
  Cog,
  Copy,
  CreditCard,
  Cpu,
  Download,
  Edit,
  Ellipsis,
  EllipsisVertical,
  Expand,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileText,
  Filter,
  Folder,
  FolderOpen,
  FolderPlus,
  GitBranch,
  Grid,
  HardDrive,
  Heart,
  History,
  Home,
  Image,
  Images,
  Inbox,
  Info,
  Key,
  Layers,
  LayoutGrid,
  Library,
  Link,
  List,
  Loader,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Maximize,
  Menu,
  MessageSquare,
  Minus,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Move,
  Network,
  Palette,
  Pause,
  Pencil,
  Pin,
  Play,
  Plus,
  Power,
  Receipt,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  Share,
  Share2,
  Shield,
  Shuffle,
  Sliders,
  SlidersHorizontal,
  SlidersVertical,
  Sparkles,
  Square,
  Star,
  Stop,
  Sun,
  Trash,
  Trash2,
  Type,
  Upload,
  User,
  UserPlus,
  Users,
  Video,
  Volume2,
  Wallet,
  Workflow,
  X,
  Zap,
  type LucideIcon
} from 'lucide-vue-next'

const props = defineProps<{
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  class?: HTMLAttributes['class']
}>()

const sizeClasses: Record<string, string> = {
  'xs': 'size-3',      // 12px
  'sm': 'size-3.5',    // 14px
  'md': 'size-4',      // 16px
  'lg': 'size-5',      // 20px
  'xl': 'size-6',      // 24px
  '2xl': 'size-8',     // 32px
}

// Map icon names to lucide components
const iconMap: Record<string, LucideIcon> = {
  // Navigation
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'arrow-up-down': ArrowUpDown,
  'arrows-alt': Move,
  'external-link': ExternalLink,

  // Actions
  'plus': Plus,
  'minus': Minus,
  'times': X,
  'check': Check,
  'search': Search,
  'filter': Filter,
  'sort-alt': Shuffle,
  'refresh': RefreshCw,
  'sync': RefreshCw,
  'download': Download,
  'upload': Upload,
  'copy': Copy,
  'clone': Copy,
  'trash': Trash2,
  'pencil': Pencil,
  'edit': Edit,
  'save': Save,
  'send': Send,
  'share-alt': Share2,
  'link': Link,
  'expand': Expand,
  'maximize': Maximize,

  // Media
  'image': Image,
  'images': Images,
  'video': Video,
  'play': Play,
  'pause': Pause,
  'stop': Square,
  'volume-up': Volume2,

  // Files & Folders
  'file': File,
  'file-text': FileText,
  'folder': Folder,
  'folder-open': FolderOpen,
  'folder-plus': FolderPlus,
  'inbox': Inbox,
  'archive': Archive,
  'briefcase': Briefcase,

  // UI Elements
  'th-large': LayoutGrid,
  'list': List,
  'grid': Grid,
  'menu': Menu,
  'ellipsis-h': MoreHorizontal,
  'ellipsis-v': MoreVertical,
  'spinner': Loader,
  'circle': Circle,
  'circle-fill': CircleDot,
  'square': Square,
  'layers': Layers,

  // Objects
  'box': Box,
  'sitemap': Network,
  'workflow': Workflow,
  'objects-column': LayoutGrid,
  'code': Code,
  'cog': Settings,
  'sliders-h': SlidersHorizontal,
  'sliders-v': SlidersVertical,
  'palette': Palette,
  'key': Key,
  'lock': Lock,
  'shield': Shield,
  'bolt': Zap,
  'sparkles': Sparkles,
  'star': Star,
  'star-fill': Star,
  'heart': Heart,

  // Users
  'user': User,
  'users': Users,
  'user-plus': UserPlus,

  // Communication
  'envelope': Mail,
  'bell': Bell,
  'comment': MessageSquare,
  'comments': MessageSquare,

  // Status
  'info': Info,
  'info-circle': Info,
  'question-circle': AlertCircle,
  'exclamation-circle': AlertCircle,
  'exclamation-triangle': AlertTriangle,
  'alert-circle': AlertCircle,
  'check-circle': CheckCircle,
  'times-circle': X,
  'verified': CheckCircle,
  'x': X,

  // Git
  'git-branch': GitBranch,

  // Objects extras
  'cube': Box,

  // System
  'home': Home,
  'sign-out': LogOut,
  'power-off': Power,
  'clock': Clock,
  'calendar': Calendar,
  'eye': Eye,
  'eye-slash': EyeOff,
  'sun': Sun,
  'moon': Moon,
  'book': BookOpen,
  'library': Library,
  'clipboard': Clipboard,
  'type': Type,
  'bold': Bold,
  'thumbtack': Pin,
  'bookmark': Bookmark,

  // Billing & Finance
  'credit-card': CreditCard,
  'wallet': Wallet,
  'receipt': Receipt,
  'chart-bar': BarChart3,
  'history': History,
  'cpu': Cpu,
  'hard-drive': HardDrive,
}

const iconComponent = computed(() => {
  return iconMap[props.name] || Circle
})

const iconClass = computed(() => {
  return cn(
    sizeClasses[props.size || 'md'],
    'shrink-0',
    props.class
  )
})
</script>

<template>
  <component :is="iconComponent" :class="iconClass" />
</template>
