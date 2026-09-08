"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface ControlButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  /** Only for genuine toggles — shuffle, repeat, mute. Omitted elsewhere. */
  pressed?: boolean;
  className: string;
  children: React.ReactNode;
}

export function ControlButton({
  label,
  onClick,
  disabled,
  pressed,
  className,
  children,
}: ControlButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          disabled ? (
            <span>
              <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                aria-label={label}
                aria-pressed={pressed}
                className={className}
              >
                {children}
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={onClick}
              disabled={disabled}
              aria-label={label}
              aria-pressed={pressed}
              className={className}
            />
          )
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
