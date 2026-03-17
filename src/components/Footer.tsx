export const Footer: React.FC = () => {
    return (
        <footer className="py-4 border-t border-gray-100 dark:border-white/8 text-center text-xs text-gray-300 dark:text-white/20">
            &copy; {new Date().getFullYear()} R2 Notify. All rights reserved.
          </footer>
    )
}