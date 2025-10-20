import * as React from "react";

import { IconSvgProps } from "@/types";

export const MoonFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export const SunFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);

export const UploadIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 256 256"
    width={width || size}
    {...props}
  >
    <path
      d="M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0ZM96.49,80.49,116,61v83a12,12,0,0,0,24,0V61l19.51,19.52a12,12,0,1,0,17-17l-40-40a12,12,0,0,0-17,0l-40,40a12,12,0,1,0,17,17Z"
      fill="currentColor"
    />
  </svg>
);

export const TrashIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 256 256"
    width={width || size}
    {...props}
  >
    <path
      d="M216,48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM188,204H68V72H188ZM76,20A12,12,0,0,1,88,8h80a12,12,0,0,1,0,24H88A12,12,0,0,1,76,20Z"
      fill="currentColor"
    />
  </svg>
);

export const AddCircleIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 256 256"
    width={width || size}
    {...props}
  >
    <path
      d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"
      fill="currentColor"
    />
  </svg>
);

export const BackArrowIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 256 256"
    width={width || size}
    {...props}
  >
    <path
      d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z"
      fill="currentColor"
    />
  </svg>
);

export const BookIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 256 256"
    width={width || size}
    {...props}
  >
    <path
      d="M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64ZM160,88h40a8,8,0,0,1,0,16H160a8,8,0,0,1,0-16Zm48,40a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,128Zm0,32a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,160Z"
      fill="currentColor"
    />
  </svg>
);

export const AddStackIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 256 256"
    width={width || size}
    {...props}
  >
    <path
      d="M230.91,124A8,8,0,0,1,228,134.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,121.09l92,53.65,92-53.65A8,8,0,0,1,230.91,124ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26ZM232,192H216V176a8,8,0,0,0-16,0v16H184a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V208h16a8,8,0,0,0,0-16Zm-92,23.76-12,7L36,169.09A8,8,0,0,0,28,182.91l96,56a8,8,0,0,0,8.06,0l16-9.33A8,8,0,1,0,140,215.76Z"
      fill="defaultColor"
    />
  </svg>
);

export const RemoveStackIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 256 256"
    width={width || size}
    {...props}
  >
    <path
      d="M230.91,124A8,8,0,0,1,228,134.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,121.09l92,53.65,92-53.65A8,8,0,0,1,230.91,124ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26ZM232,192H184a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Zm-92,23.76-12,7L36,169.09A8,8,0,0,0,28,182.91l96,56a8,8,0,0,0,8.06,0l16-9.33A8,8,0,1,0,140,215.76Z"
      fill="defaultColor"
    />
  </svg>
);

export const AddFolderIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 256 256"
    width={width || size}
    {...props}
  >
    <path
      d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM92.69,56l16,16H40V56ZM216,200H40V88H216Zm-88-88a8,8,0,0,1,8,8v16h16a8,8,0,0,1,0,16H136v16a8,8,0,0,1-16,0V152H104a8,8,0,0,1,0-16h16V120A8,8,0,0,1,128,112Z"
      fill="currentColor"
    />
  </svg>
);
