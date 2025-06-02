# NextJS Rendering Patterns

## Page router
![Rendering Patterns](img/renderingPatterns00002.png)

### Client-side Rendering (CSR)
![Rendering Patterns](img/renderingPatterns00002.png)

### Static Site Generation (SSG)
![Rendering Patterns](img/renderingPatterns00003.png)

### Server-side Rendering (SSR)
![Rendering Patterns](img/renderingPatterns00004.png)

![Rendering Patterns](img/renderingPatterns00005.png)

![Rendering Patterns](img/renderingPatterns00006.png)

### Incremental Static Regeneration (ISR)
![Rendering Patterns](img/renderingPatterns00007.png)

## App router

### Server components
- static rendering
    - routes are rendered at build time, or in the background after data revalidation. 
- dynamic rendering
    - routes are rendered for each user at request time.
    - During rendering, if a dynamic function (cookies(), headers(), searchParams()) 
      or uncached data request is discovered, Next.js will switch to dynamically rendering the whole route. 
- streaming rendering
The rendering work is split into chunks: by individual route segments and Suspense Boundaries 

![Rendering Patterns](img/renderingPatterns00008.png)

![Rendering Patterns](img/renderingPatterns00009.png)
