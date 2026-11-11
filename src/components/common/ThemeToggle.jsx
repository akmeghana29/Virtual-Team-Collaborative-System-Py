import { useTheme } from '../../context/ThemeContext'
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full hover:bg-light-surface dark:hover:bg-dark-surface transition-colors duration-200"
    >
      {isDark ? (
        <HiOutlineSun size={18} className="text-dark-muted" />
      ) : (
        <HiOutlineMoon size={18} className="text-dark-bg/60" />
      )}
    </button>
  )
}