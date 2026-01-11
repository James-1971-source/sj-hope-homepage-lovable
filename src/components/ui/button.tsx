import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-warm-sm hover:bg-primary/90 active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-warm-sm hover:bg-destructive/90",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-warm-sm hover:bg-secondary/90",
        ghost: 
          "hover:bg-muted hover:text-foreground",
        link: 
          "text-primary underline-offset-4 hover:underline",
        // Custom variants for nonprofit site
        hero: 
          "bg-primary text-primary-foreground shadow-warm-md hover:bg-primary/90 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl active:scale-[0.98]",
        heroOutline:
          "border-2 border-primary-foreground/90 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl",
        cta:
          "bg-primary text-primary-foreground shadow-warm-lg hover:bg-primary/90 text-lg px-8 py-4 rounded-2xl font-bold active:scale-[0.98]",
        ctaSecondary:
          "bg-secondary text-secondary-foreground shadow-warm-md hover:bg-secondary/90 text-lg px-8 py-4 rounded-2xl font-bold",
        warm:
          "bg-warm-orange-light text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground",
        success:
          "bg-success text-success-foreground shadow-warm-sm hover:bg-success/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-xl px-6 text-base",
        xl: "h-14 rounded-xl px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
