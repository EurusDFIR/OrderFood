/// <reference types="vite/client" />

declare module "*.postcss" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.postcss" {
  const classes: { [key: string]: string };
  export default classes;
}