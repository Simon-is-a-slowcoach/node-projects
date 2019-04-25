
// load json
declare module "*.json" {
    const value: any;
    export default value;
}

// "npm install @types/koa-onerror --save-dev" failed
declare module "koa-onerror";
