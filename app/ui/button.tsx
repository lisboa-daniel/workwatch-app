import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center rounded-lg px-4 text-m font-medium text-activeColor-400 transition-colors hover:bg-cyanWhiteBackground-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyanWhiteBackground-100 active:bg-cyanWhiteBackground-100 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 text-center text-bold',
        className,
      )}
    >
      {children}
    </button>
  );
}
