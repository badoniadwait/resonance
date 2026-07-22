import { createTRPCRouter } from '../init';
import { billingRouter } from './billing';
import { generationRouter } from './generations';
import { voicesRouter } from './voices';
 
export const appRouter = createTRPCRouter({
  voices: voicesRouter,
  generations: generationRouter,
  billing: billingRouter,
});
 
// export type definition of API
export type AppRouter = typeof appRouter;