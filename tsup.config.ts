import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    format: 'src/format/index.ts',
    parse: 'src/parse/index.ts',
    timezone: 'src/timezone/index.ts',
    temporal: 'src/temporal/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  target: 'es2020',
});
